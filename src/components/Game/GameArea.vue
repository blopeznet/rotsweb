<script setup>
import { useGameStore } from '../../stores/gameStore'
import GameCanvas from './GameCanvas.vue'
import { Heart, Trophy } from 'lucide-vue-next'

const gameStore = useGameStore()
</script>

<template>
  <section id="game" class="arcade-section">

    <!-- ══════════════════════════════════════
         MARQUESINA DEL CABINET
         Pon tu imagen en /public/images/marquee.png
         Dimensiones recomendadas: 900×220 px
    ═══════════════════════════════════════════ -->
    <div class="cabinet-wrap">

      <div class="marquee">
        <img
          src="/sprites/marquee.png"
          alt="Beer Catcher Arcade marquee"
          class="marquee-img"
        />
        <!-- Fallback si no hay imagen todavía -->
        <div class="marquee-fallback">
          <span class="marquee-title">BEER CATCHER</span>
          <span class="marquee-sub">ROT SHADOWS ARCADE</span>
        </div>
      </div>

      <!-- ══════════════════════════════════
           CUERPO DEL CABINET (bezel + pantalla)
      ═══════════════════════════════════════ -->
      <div class="bezel">

        <!-- HUD estilo arcade -->
        <div class="hud">
          <div class="hud-block">
            <span class="hud-label">SCORE</span>
            <span class="hud-value">{{ String(gameStore.score).padStart(6, '0') }}</span>
          </div>

          <div class="hud-block hud-center">
            <span class="hud-label">HIGH SCORE</span>
            <span class="hud-value hud-gold">
              <Trophy :size="14" style="display:inline;vertical-align:middle;" />
              {{ String(gameStore.highScore).padStart(6, '0') }}
            </span>
          </div>

          <div class="hud-block hud-right">
            <span class="hud-label">LIVES</span>
            <span class="hud-lives">
              <Heart
                v-for="n in gameStore.lives"
                :key="n"
                :size="16"
                class="hud-heart"
              />
            </span>
          </div>
        </div>

        <!-- ══════════════════════════════
             PANTALLA  (3 capas apiladas)
        ═══════════════════════════════════ -->
        <div class="screen-wrap">

          <!-- Capa 1 (fondo): el canvas del juego -->
          <div class="screen-game">
            <div v-if="gameStore.gameState === 'START'" class="screen-overlay">
              <p class="insert-coin">INSERT COIN</p>
              <p class="press-start">PRESS START</p>
              <button @click="gameStore.startGame()" class="btn-arcade">
                START GAME
              </button>
            </div>

            <GameCanvas v-if="gameStore.gameState === 'PLAYING'" />

            <div v-if="gameStore.gameState === 'GAME_OVER'" class="screen-overlay">
              <p class="game-over-text">GAME OVER</p>
              <p class="score-final">SCORE &nbsp; {{ String(gameStore.score).padStart(6, '0') }}</p>
              <button @click="gameStore.startGame()" class="btn-arcade">
                PLAY AGAIN
              </button>
            </div>
          </div>

          <!-- Capa 2 (medio): efecto CRT por CSS — NO recibe clicks -->
          <div class="screen-crt" aria-hidden="true"></div>

          <!-- Capa 3 (top): reflejo de cristal — NO recibe clicks -->
          <div class="screen-glare" aria-hidden="true"></div>

        </div><!-- /screen-wrap -->

      </div><!-- /bezel -->

    </div><!-- /cabinet-wrap -->

  </section>
</template>

<style scoped>
/* ─────────────────────────────────────────────────────
   FUENTE ARCADE
   Press Start 2P es la fuente de arcade clásica por excelencia.
   Añade en tu index.html (o en tu CSS global):
   <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
───────────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* ─── Layout general ──────────────────────────────── */
.arcade-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem 0.5rem 2rem;
  background: #0a0a0a;
  font-family: 'Press Start 2P', monospace;
}

@media (min-width: 640px) {
  .arcade-section {
    padding: 3rem 1rem 4rem;
  }
}

/* ─── Cabinet wrapper ─────────────────────────────── */
.cabinet-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 880px;
}

/* ─── Marquesina ──────────────────────────────────── */
.marquee {
  position: relative;
  width: 100%;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  border: 4px solid #222;
  border-bottom: none;
  background: #000;
  min-height: 120px;
}

.marquee-img {
  width: 100%;
  height: auto;
  display: block;
  /* Ocultar si la imagen no carga → el fallback se mostrará */
  position: relative;
  z-index: 2;
}

/* Fallback visible siempre detrás de la imagen.
   Si la imagen carga, queda tapada. */
.marquee-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #1a0010 0%, #000 100%);
  z-index: 1;
}

.marquee-title {
  font-size: clamp(1.4rem, 4vw, 2.8rem);
  color: #ff003c;
  text-shadow:
    0 0 8px #ff003c,
    0 0 24px #ff003c,
    2px 2px 0 #7a0018;
  letter-spacing: 0.12em;
}

.marquee-sub {
  font-size: clamp(0.55rem, 1.5vw, 0.85rem);
  color: #f59e0b;
  text-shadow: 0 0 6px #f59e0b;
  margin-top: 0.5rem;
  letter-spacing: 0.2em;
}

/* ─── Bezel (marco del cabinet) ──────────────────── */
.bezel {
  width: 100%;
  background: #111;
  border: 4px solid #222;
  border-top: none;
  border-radius: 0 0 16px 16px;
  padding: 0.5rem 0.5rem 0.75rem;
  box-shadow:
    0 0 40px rgba(255,0,60,0.2),
    inset 0 0 30px rgba(0,0,0,0.8);
}

@media (min-width: 640px) {
  .bezel {
    padding: 1rem 1.5rem 1.5rem;
  }
}

/* ─── HUD ─────────────────────────────────────────── */
.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.25rem;
  border-bottom: 2px solid #2a2a2a;
}

.hud-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hud-center { align-items: center; }
.hud-right  { align-items: flex-end; }

.hud-label {
  font-size: 0.5rem;
  color: #555;
  letter-spacing: 0.15em;
}

.hud-value {
  font-size: clamp(0.75rem, 2vw, 1rem);
  color: #fff;
  text-shadow: 0 0 6px rgba(255,255,255,0.4);
}

.hud-gold {
  color: #f59e0b;
  text-shadow: 0 0 8px #f59e0b;
}

.hud-lives {
  display: flex;
  gap: 4px;
}

.hud-heart {
  color: #ff003c;
  filter: drop-shadow(0 0 4px #ff003c);
}

/* ─── Pantalla (screen-wrap) ─────────────────────── */
.screen-wrap {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  /* Aísla el contexto de apilamiento */
  isolation: isolate;
}

/* Capa 1 — juego */
.screen-game {
  position: relative;
  z-index: 1;
  background: #000;
  /* Sin altura fija: el canvas escalado determina la altura del contenedor */
  min-height: 120px;
}

/* ─── Overlays START / GAME OVER ────────────────── */
.screen-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 4rem 1rem;
  background: #000;
}

/* Texto parpadeante "INSERT COIN" */
.insert-coin {
  font-size: clamp(0.6rem, 2vw, 0.9rem);
  color: #aaa;
  animation: blink 1.1s step-start infinite;
}

.press-start {
  font-size: clamp(0.8rem, 2.5vw, 1.1rem);
  color: #fff;
  text-shadow: 0 0 8px #fff;
  animation: blink 0.8s step-start infinite;
}

.game-over-text {
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: #ff003c;
  text-shadow:
    0 0 10px #ff003c,
    0 0 30px #ff003c,
    3px 3px 0 #7a0018;
  animation: flicker 0.15s infinite alternate;
}

.score-final {
  font-size: clamp(0.6rem, 2vw, 0.85rem);
  color: #f59e0b;
  text-shadow: 0 0 8px #f59e0b;
}

/* Botón estilo arcade */
.btn-arcade {
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(0.55rem, 1.8vw, 0.8rem);
  color: #000;
  background: #ff003c;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  box-shadow:
    4px 4px 0 #7a0018,
    0 0 16px rgba(255,0,60,0.5);
  transition: transform 0.05s, box-shadow 0.05s;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.btn-arcade:hover {
  transform: translate(-2px, -2px);
  box-shadow:
    6px 6px 0 #7a0018,
    0 0 24px rgba(255,0,60,0.7);
}

.btn-arcade:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #7a0018;
}

/* ─── Capa 2 — Efecto CRT ─────────────────────────
   Scanlines + curvatura + viñeta
   pointer-events:none → no bloquea clicks al juego
─────────────────────────────────────────────────── */
.screen-crt {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: 6px;

  /* Scanlines horizontales */
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.18) 2px,
      rgba(0, 0, 0, 0.18) 4px
    );

  /* Viñeta oscura en los bordes */
  box-shadow:
    inset 0 0 60px rgba(0,0,0,0.55),
    inset 0 0 20px rgba(0,0,0,0.4);

  /* Leve tinte verde fosforescente */
  mix-blend-mode: multiply;
}

/* Curvatura barrel — simula el cristal convexo del CRT */
.screen-crt::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 6px;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0,0,0,0.45) 100%
  );
}

/* Línea de barrido animada */
.screen-crt::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.04);
  animation: scanline 8s linear infinite;
}

/* ─── Capa 3 — Reflejo de cristal ──────────────── */
.screen-glare {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  border-radius: 6px;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.05) 0%,
    transparent 40%,
    transparent 70%,
    rgba(255,255,255,0.02) 100%
  );
}

/* ─── Animaciones ─────────────────────────────── */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

@keyframes flicker {
  0%   { opacity: 1; }
  100% { opacity: 0.88; }
}

@keyframes scanline {
  0%   { top: -3px; }
  100% { top: 100%; }
}
</style>