<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../../stores/gameStore'

const canvasRef = ref(null)
const gameStore = useGameStore()

let animationId

const WIDTH = 800
const HEIGHT = 500

const keys = {}

// ─────────────────────────────────────────────
// SPRITE SYSTEM
// ─────────────────────────────────────────────

/*
  Pon los archivos en /public/sprites/ y actualiza
  los paths de SPRITE_PATHS abajo.

  Cada hoja de sprite debe tener todos los frames
  del mismo tamaño, en una sola fila horizontal.
*/

const SPRITE_PATHS = {
  // ── Jugador ──────────────────────────────────────
  // Hoja de walk: 5 frames en fila (e.g. cada frame 80×80 px)
  playerWalk:     '/sprites/player_walk.png',
  // Hoja de drink (catch success): 5 frames en fila
  playerDrink:    '/sprites/player_drink.png',
  // Hoja de caída (game over / hit): 3 frames en fila
  playerFall:     '/sprites/player_fall.png',

  // ── Objetos que caen ─────────────────────────────
  beer:            '/sprites/beer.png',
  obstacle:        '/sprites/obstacle.png',
  obstacleGuitar:  '/sprites/obstacle_guitar.png',
  obstacleVinyl:   '/sprites/obstacle_vinyl.png',
  obstacleDemon:   '/sprites/obstacle_demon.png',

  // ── Fondo ─────────────────────────────────────────
  background:      '/sprites/background.png',
}

// Caché de imágenes cargadas
const images = {}

function loadImage(key, src) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = src
    img.onload  = () => { images[key] = img; resolve(img) }
    img.onerror = () => { images[key] = null; resolve(null) }
  })
}

async function loadAllSprites() {
  await Promise.all(
    Object.entries(SPRITE_PATHS).map(([key, src]) => loadImage(key, src))
  )
}

// ─────────────────────────────────────────────
// ANIMACIÓN DE SPRITE (hoja de frames)
// ─────────────────────────────────────────────

/*
  frameWidth  – ancho de UN frame dentro de la hoja
  frameHeight – alto de UN frame
  totalFrames – número de frames en la hoja
  fps         – velocidad de animación
*/

function createAnimatedSprite(imageKey, frameWidth, frameHeight, totalFrames, fps = 8) {
  return { imageKey, frameWidth, frameHeight, totalFrames, fps, currentFrame: 0, ticker: 0 }
}

function tickSprite(sprite) {
  sprite.ticker++
  const ticksPerFrame = Math.max(1, Math.floor(60 / sprite.fps))
  if (sprite.ticker >= ticksPerFrame) {
    sprite.ticker = 0
    sprite.currentFrame = (sprite.currentFrame + 1) % sprite.totalFrames
  }
}

function drawSprite(ctx, sprite, x, y, destWidth, destHeight) {
  const img = images[sprite.imageKey]
  if (!img) return false
  ctx.drawImage(
    img,
    sprite.currentFrame * sprite.frameWidth, 0,
    sprite.frameWidth, sprite.frameHeight,
    x, y, destWidth, destHeight
  )
  return true
}

function drawStaticSprite(ctx, imageKey, x, y, w, h) {
  const img = images[imageKey]
  if (!img) return false
  ctx.drawImage(img, x, y, w, h)
  return true
}

// ─────────────────────────────────────────────
// JUGADOR
// ─────────────────────────────────────────────

const PLAYER_W = 80
const PLAYER_H = 80

const player = {
  x: 350,
  y: HEIGHT - PLAYER_H - 10,
  width: PLAYER_W,
  height: PLAYER_H,
  speed: 5,
  state: 'walk',    // 'walk' | 'drink' | 'fall'
  stateTimer: 0,
}

/*
  ─── AJUSTA ESTOS VALORES SEGÚN TU SPRITE SHEET ───
  frameWidth  = ancho en px de cada frame en la hoja
  frameHeight = alto  en px de cada frame en la hoja
  totalFrames = cuántos frames tiene la animación
*/
const playerSprites = {
  walk:  createAnimatedSprite('playerWalk',  80, 80, 5, 8),
  drink: createAnimatedSprite('playerDrink', 80, 80, 3, 10),
  fall:  createAnimatedSprite('playerFall',  80, 80, 2, 6),
}

function setPlayerState(state, durationTicks = 0) {
  if (player.state === state) return
  player.state = state
  player.stateTimer = durationTicks
  playerSprites[state].currentFrame = 0
  playerSprites[state].ticker = 0
}

function updatePlayerState() {
  if (player.stateTimer > 0) {
    player.stateTimer--
    if (player.stateTimer === 0 && player.state !== 'fall') {
      setPlayerState('walk')
    }
  }
}

// ─────────────────────────────────────────────
// OBJETOS QUE CAEN
// ─────────────────────────────────────────────

const fallingObjects = []
let spawnTimer = 0

const OBSTACLE_VARIANTS = ['obstacle', 'obstacleGuitar', 'obstacleVinyl', 'obstacleDemon']

function spawnObject() {
  const isBeer = Math.random() > 0.25
  fallingObjects.push({
    x: Math.random() * (WIDTH - 48),
    y: -48,
    width: 48,
    height: 48,
    speed: 2 + Math.random() * 3,
    type: isBeer ? 'beer' : 'obstacle',
    imageKey: isBeer
      ? 'beer'
      : OBSTACLE_VARIANTS[Math.floor(Math.random() * OBSTACLE_VARIANTS.length)],
  })
}

// ─────────────────────────────────────────────
// CONTROLES
// ─────────────────────────────────────────────

function handleKeyDown(e) { keys[e.key] = true }
function handleKeyUp(e)   { keys[e.key] = false }

function updatePlayer() {
  if (keys.ArrowLeft || keys.a) player.x -= player.speed
  if (keys.ArrowRight || keys.d) player.x += player.speed
  player.x = Math.max(0, Math.min(WIDTH - player.width, player.x))
}

// ─────────────────────────────────────────────
// COLISIÓN (AABB)
// ─────────────────────────────────────────────

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width  &&
    a.x + a.width  > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

function updateObjects() {
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    const obj = fallingObjects[i]
    obj.y += obj.speed

    if (checkCollision(player, obj)) {
      if (obj.type === 'beer') {
        gameStore.addPoint()
        setPlayerState('drink', 40)
      } else {
        gameStore.loseLife()
      }
      fallingObjects.splice(i, 1)
      continue
    }

    if (obj.y > HEIGHT) {
      if (obj.type === 'beer') gameStore.loseLife()
      fallingObjects.splice(i, 1)
    }
  }
}

// ─────────────────────────────────────────────
// DRAW
// ─────────────────────────────────────────────

function draw(ctx) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  // Fondo
  const bgDrawn = drawStaticSprite(ctx, 'background', 0, 0, WIDTH, HEIGHT)
  if (!bgDrawn) {
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
  }

  // Objetos que caen
  fallingObjects.forEach(obj => {
    const drawn = drawStaticSprite(ctx, obj.imageKey, obj.x, obj.y, obj.width, obj.height)
    if (!drawn) {
      ctx.fillStyle = obj.type === 'beer' ? '#f59e0b' : '#ffffff'
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
    }
  })

  // Jugador animado
  const activeSprite = playerSprites[player.state]
  tickSprite(activeSprite)
  const playerDrawn = drawSprite(ctx, activeSprite, player.x, player.y, player.width, player.height)
  if (!playerDrawn) {
    ctx.fillStyle = '#ff003c'
    ctx.fillRect(player.x, player.y, player.width, player.height)
  }
}

// ─────────────────────────────────────────────
// GAME LOOP
// ─────────────────────────────────────────────

function gameLoop() {
  if (gameStore.gameState !== 'PLAYING') return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  updatePlayer()
  updatePlayerState()

  spawnTimer++
  if (spawnTimer > 40) {
    spawnObject()
    spawnTimer = 0
  }

  updateObjects()
  draw(ctx)

  animationId = requestAnimationFrame(gameLoop)
}

// ─────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  await loadAllSprites()
  setPlayerState('walk')
  gameLoop()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<template>
  <div class="flex justify-center">
    <canvas
      ref="canvasRef"
      :width="WIDTH"
      :height="HEIGHT"
      class="border-2 border-shadow-red rounded bg-black"
    />
  </div>
</template>