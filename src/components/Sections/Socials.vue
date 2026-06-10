<template>
  <section class="social">
    <header class="social__header">
      <h2>Redes sociales</h2>
      <p>Contenido reciente y actualizaciones desde Instagram.</p>
    </header>

    <div v-if="loading" class="posts__grid">
      <div v-for="i in 3" :key="i" class="post-card post-card--skeleton">
        <div class="post-card__image-wrapper skeleton-anim"></div>
        <div class="post-card__content">
          <div class="skeleton-line skeleton-anim"></div>
          <div class="skeleton-line skeleton-anim" style="width: 60%"></div>
        </div>
      </div>
    </div>

    <div v-else class="posts__grid">
      <a 
        v-for="post in latestPosts" 
        :key="post.id" 
        :href="post.permalink" 
        target="_blank" 
        rel="noopener noreferrer"
        class="post-card"
      >
        <div class="post-card__image-wrapper">
          <img :src="post.media_url" :alt="post.caption" class="post-card__img" loading="lazy" />
          <span class="post-card__badge" :class="`post-card__badge--${post.platform}`">
            {{ post.platform }}
          </span>
        </div>
        
        <div class="post-card__content">
          <p class="post-card__text">{{ truncateText(post.caption, 110) }}</p>
          <div class="post-card__footer">
            <span class="post-card__date">{{ formatDate(post.timestamp) }}</span>
            <span class="post-card__cta">Ver publicación →</span>
          </div>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const latestPosts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Llama a tu función Serverless local o en producción de Vercel
    const response = await fetch('/api/get-socials')
    if (!response.ok) throw new Error('Error al obtener el feed')
    
    latestPosts.value = await response.json()
  } catch (e) {
    console.error("Error cargando posts desde Vercel Serverless:", e)
  } finally {
    loading.value = false
  }
})

// Cortar el texto si es muy largo
const truncateText = (text, limit) => {
  if (text.length <= limit) return text
  return text.substring(0, limit) + '...'
}

// Dar formato amigable a la fecha
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}
</script>

<style scoped>
/* --- Base Estilo Oscuro --- */
.social {
  padding: 3rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #0a0a0a;
  color: #ffffff;
}

.social__header {
  text-align: center;
  margin-bottom: 3rem;
}

.social__header h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.social__header p {
  color: #888888;
  font-size: 1rem;
}

/* --- Grid de Posts --- */
.posts__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

/* --- Tarjeta Individual --- */
.post-card {
  background: #141414;
  border: 1px solid #222222;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s ease;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-6px);
  border-color: #ff003c; /* Detalle rojo metalero en hover */
}

/* Contenedor Imagen (Mantiene proporción 1:1) */
.post-card__image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #1f1f1f;
}

.post-card__img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Badge de Red Social */
.post-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-card__badge--instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #ffffff;
}

/* Bloque de Contenido */
.post-card__content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.post-card__text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #dddddd;
  margin: 0 0 1.5rem 0;
}

/* Footer de Tarjeta */
.post-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  border-top: 1px solid #222222;
  padding-top: 1rem;
}

.post-card__date {
  color: #666666;
}

.post-card__cta {
  color: #ff003c;
  font-weight: 600;
  transition: color 0.2s ease;
}

.post-card:hover .post-card__cta {
  color: #ffffff;
}

/* --- Animaciones de Carga (Skeletons) --- */
.skeleton-anim {
  background: linear-gradient(90deg, #1f1f1f 25%, #2c2c2c 50%, #1f1f1f 75%);
  background-size: 200% 100%;
  animation: loading-skeleton 1.5s infinite;
}

.skeleton-line {
  height: 1rem;
  background-color: #1f1f1f;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

@keyframes loading-skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>