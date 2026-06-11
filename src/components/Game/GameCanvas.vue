<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../../stores/gameStore'

const canvasRef = ref(null)
const wrapperRef = ref(null)
const gameStore = useGameStore()

let animationId

// ─── Dimensiones lógicas (espacio de juego interno) ───
const WIDTH  = 800
const HEIGHT = 500

// ─── Estado de teclas y táctil ────────────────────────
const keys = {}
const touch = { left: false, right: false }

// ─────────────────────────────────────────────
// SPRITE SYSTEM
// ─────────────────────────────────────────────

const SPRITE_PATHS = {
  playerWalk:     '/sprites/player_walk.png',
  playerDrink:    '/sprites/player_drink.png',
  playerFall:     '/sprites/player_fall.png',
  beer:            '/sprites/beer.png',
  obstacle:        '/sprites/obstacle.png',
  obstacleGuitar:  '/sprites/obstacle_guitar.png',
  obstacleVinyl:   '/sprites/obstacle_vinyl.png',
  obstacleDemon:   '/sprites/obstacle_demon.png',
  background:      '/sprites/background.png',
}

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
// ANIMACIÓN DE SPRITE
// ─────────────────────────────────────────────

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
  state: 'walk',
  stateTimer: 0,
}

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
// CONTROLES — teclado + táctil
// ─────────────────────────────────────────────

function handleKeyDown(e) { keys[e.key] = true }
function handleKeyUp(e)   { keys[e.key] = false }

// Evitar scroll de página al tocar los botones
function preventScroll(e) { e.preventDefault() }

function updatePlayer() {
  if (keys.ArrowLeft  || keys.a || touch.left)  player.x -= player.speed
  if (keys.ArrowRight || keys.d || touch.right) player.x += player.speed
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

  const bgDrawn = drawStaticSprite(ctx, 'background', 0, 0, WIDTH, HEIGHT)
  if (!bgDrawn) {
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
  }

  fallingObjects.forEach(obj => {
    const drawn = drawStaticSprite(ctx, obj.imageKey, obj.x, obj.y, obj.width, obj.height)
    if (!drawn) {
      ctx.fillStyle = obj.type === 'beer' ? '#f59e0b' : '#ffffff'
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
    }
  })

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
// ESCALADO RESPONSIVE
// ─────────────────────────────────────────────

function resizeCanvas() {
  const canvas = canvasRef.value
  const wrapper = wrapperRef.value
  if (!canvas || !wrapper) return
  // El canvas mantiene su resolución lógica; CSS lo escala
  const availableWidth = wrapper.clientWidth
  const scale = Math.min(1, availableWidth / WIDTH)
  canvas.style.width  = `${WIDTH  * scale}px`
  canvas.style.height = `${HEIGHT * scale}px`
}

// ─────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup',   handleKeyUp)
  window.addEventListener('resize',  resizeCanvas)

  await loadAllSprites()
  resizeCanvas()
  setPlayerState('walk')
  gameLoop()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup',   handleKeyUp)
  window.removeEventListener('resize',  resizeCanvas)
})
</script>

<template>
  <div ref="wrapperRef" class="canvas-wrapper">

    <!-- Canvas del juego -->
    <canvas
      ref="canvasRef"
      :width="WIDTH"
      :height="HEIGHT"
      class="game-canvas"
    />

    <!-- ── Controles táctiles ── -->
    <div class="touch-controls" aria-label="Controles táctiles">
      <button
        class="touch-btn touch-left"
        aria-label="Mover izquierda"
        @touchstart.prevent="touch.left = true"
        @touchend.prevent="touch.left = false"
        @touchcancel.prevent="touch.left = false"
        @mousedown.prevent="touch.left = true"
        @mouseup.prevent="touch.left = false"
        @mouseleave="touch.left = false"
      >◀</button>

      <button
        class="touch-btn touch-right"
        aria-label="Mover derecha"
        @touchstart.prevent="touch.right = true"
        @touchend.prevent="touch.right = false"
        @touchcancel.prevent="touch.right = false"
        @mousedown.prevent="touch.right = true"
        @mouseup.prevent="touch.right = false"
        @mouseleave="touch.right = false"
      >▶</button>
    </div>

  </div>
</template>

<style scoped>
/* ── Wrapper ocupa todo el ancho disponible ── */
.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0;
}

/* ── El canvas se escala por CSS manteniendo su resolución ── */
.game-canvas {
  display: block;
  max-width: 100%;
  border-radius: 4px;
  background: #000;
  /* El JS asigna width/height en píxeles de pantalla */
}

/* ── Controles táctiles ────────────────────────────────── */
.touch-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0.75rem;
  gap: 1rem;
  /* Visibles siempre; en desktop son extra, en móvil son esenciales */
}

.touch-btn {
  font-family: 'Press Start 2P', monospace;
  font-size: 1.5rem;
  color: #fff;
  background: rgba(255, 0, 60, 0.15);
  border: 3px solid #ff003c;
  border-radius: 8px;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;         /* evita scroll al mantener pulsado */
  box-shadow: 0 0 10px rgba(255, 0, 60, 0.3), 3px 3px 0 #7a0018;
  transition: background 0.08s, transform 0.05s;
  /* Botones grandes para dedos */
  min-width: 80px;
  min-height: 64px;
}

.touch-btn:active,
.touch-btn.pressed {
  background: rgba(255, 0, 60, 0.45);
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #7a0018;
}

/* En pantallas grandes los botones son más pequeños y discretos */
@media (min-width: 640px) {
  .touch-btn {
    min-width: 64px;
    min-height: 52px;
    font-size: 1.2rem;
    opacity: 0.7;
  }
}
</style>