<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__content">
        <p class="footer__copyright">
          &copy; {{ currentYear }} <strong>Rise Of The Shadows</strong>. Todos los derechos reservados.
        </p>
        <p class="footer__disclaimer">
          Esta es una plataforma web oficial sin ánimo de lucro creada únicamente con fines culturales, promocionales e informativos sobre la actividad musical de la banda.
        </p>
      </div>
      <div class="footer__divider"></div>
      <div class="footer__meta">
        <span>Hecho por y para el Culto 🤘</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: #09090b; /* Zinc 950 muy profundo para cerrar la página */
  color: #a1a1aa; /* Zinc 400 */
  padding: 3rem 2rem 2rem 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  border-top: 1px solid #18181b; /* Zinc 900 */
  font-size: 0.9rem;
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
}

.footer__content {
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__copyright {
  color: #f4f4f5; /* Zinc 100 */
  letter-spacing: 0.5px;
}

.footer__copyright strong {
  color: #ff003c; /* Detalle carmesí de ROTS */
  font-weight: 700;
}

.footer__disclaimer {
  font-size: 0.8rem;
  line-height: 1.5;
  opacity: 0.7;
}

.footer__divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #27272a, transparent); /* Zinc 800 desvanecido */
}

.footer__meta {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #71717a; /* Zinc 500 */
}
</style>