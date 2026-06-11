<template>
  <section class="social">
    <header class="social__header">
      <h2>Rots en la Prensa</h2>
      <p>Crónicas, entrevistas y reseñas del submundo musical.</p>
    </header>

    <div v-if="loading" class="loader-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Invocando crónicas...</p>
      
      <div class="carousel-container opacity-25">
        <div class="carousel-track">
          <div v-for="i in 3" :key="i" class="newspaper-card newspaper-card--skeleton">
            <div class="skeleton-line skeleton-title"></div>
            <div class="newspaper-card__divider"></div>
            <div class="skeleton-block"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="latestNews.length > 0" class="carousel-container">
      <div class="carousel-track">
        <a 
          v-for="post in latestNews" 
          :key="post.id" 
          :href="post.link || '#'" 
          target="_blank"
          rel="noopener noreferrer"
          class="newspaper-card"
        >
          <div class="newspaper-card__meta">
            <span class="newspaper-card__source">{{ post.source || 'EXTRA' }}</span>
            <span class="newspaper-card__date">{{ formatDate(post.timestamp) }}</span>
          </div>

          <h3 class="newspaper-card__title">{{ post.title }}</h3>
          
          <div class="newspaper-card__divider"></div>

          <div class="newspaper-card__body">
            <div v-if="post.media_url" class="newspaper-card__image-wrapper">
              <img :src="post.media_url" :alt="post.title" class="newspaper-card__img" loading="lazy" />
            </div>
            <p class="newspaper-card__snippet">{{ post.content }}</p>
          </div>

          <div class="newspaper-card__footer">
            <span class="read-more">Leer artículo completo →</span>
          </div>
        </a>
      </div>
    </div>

    <div v-else class="social__no-news">
      <p>No se han encontrado crónicas en el archivo por el momento.</p>
    </div>

    <footer class="social__networks">
      <h3>Únete al Culto</h3>
      <p>Sigue las sombras en sus redes oficiales para el día a día.</p>
      <div class="social-redirect-buttons">
        <a 
          v-if="socialLinks.instagramUrl" 
          :href="socialLinks.instagramUrl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="social-btn social-btn--instagram"
        >
          <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
            <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm4.4 3.5a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zm4.75-.75a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5z"/>
          </svg>
          Instagram
        </a>
        <a 
          v-if="socialLinks.facebookUrl" 
          :href="socialLinks.facebookUrl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="social-btn social-btn--facebook"
        >
          <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
            <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
          </svg>
          Facebook
        </a>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const latestNews = ref([])
const socialLinks = ref({ instagramUrl: '', facebookUrl: '' })
const loading = ref(true)

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

onMounted(async () => {
  try {
    const response = await fetch('/api/manage')
    if (response.ok) {
      const data = await response.json()
      if (data.news) latestNews.value = data.news
      if (data.settings) socialLinks.value = data.settings
    }
  } catch (error) {
    console.error('Error al invocar las noticias:', error)
  } finally {
    // Simulamos un retraso mínimo de 600ms para evitar parpadeos bruscos si la API es instantánea
    setTimeout(() => {
      loading.value = false
    }, 600)
  }
})
</script>

<style scoped>
/* --- ESTILOS COMPONENTE BASE --- */
.social { background: #000000; color: #ffffff; padding: 6rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 4rem; font-family: 'Times New Roman', Times, serif; }
.social__header { text-align: center; max-width: 600px; }
.social__header h2 { font-size: 2.8rem; text-transform: uppercase; letter-spacing: 3px; color: #ff003c; margin-bottom: 1rem; font-weight: 900; filter: drop-shadow(0 0 8px rgba(255,0,60,0.3)); }
.social__header p { color: #b0b0b0; font-size: 1.1rem; font-style: italic; }

/* --- NUEVOS ESTILOS DE CARGA (SPINNER & SKELETON) --- */
.loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; min-height: 400px; position: relative; }
.loading-text { color: #ff003c; font-size: 1rem; letter-spacing: 2px; text-transform: uppercase; margin-top: 1.5rem; font-weight: bold; animate: pulse 1.5s infinite; }

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 0, 60, 0.1);
  border-radius: 50%;
  border-top-color: #ff003c;
  border-right-color: #ff003c;
  animation: spin 1s infinite linear;
  filter: drop-shadow(0 0 6px #ff003c);
}

.opacity-25 { opacity: 0.25; filter: blur(1px); }

/* Animaciones */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Elementos de carga simulados (Skeletons) */
.newspaper-card--skeleton { animation: pulse 1.8s infinite ease-in-out; background: #111111 !important; border-color: #222 !important; cursor: default; }
.skeleton-line { height: 24px; background: #222; border-radius: 4px; margin-bottom: 1rem; }
.skeleton-title { width: 75%; height: 28px; }
.skeleton-block { height: 140px; background: #1a1a1a; border-radius: 4px; }

/* --- PERIÓDICO VINTAGE (MANTENIDO) --- */
.carousel-container { width: 100%; max-width: 1200px; overflow-x: auto; padding: 1.5rem 0; scrollbar-width: thin; scrollbar-color: #ff003c #111; }
.carousel-track { display: flex; gap: 2rem; padding: 0 1rem; }
.newspaper-card { flex: 0 0 350px; background: #f4edd8; color: #1c1a17; padding: 1.8rem; border: 2px solid #1c1a17; box-shadow: 10px 10px 0px #111111; display: flex; flex-direction: column; gap: 1rem; text-decoration: none; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease; border-radius: 2px; }
.newspaper-card:hover { transform: translate(-4px, -4px); box-shadow: 14px 14px 0px #ff003c; }
.newspaper-card__meta { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; border-bottom: 1px dashed #1c1a17; padding-bottom: 0.4rem; }
.newspaper-card__source { color: #ff003c; }
.newspaper-card__date { color: #666; }
.newspaper-card__title { font-size: 1.6rem; font-weight: 900; text-align: center; text-transform: uppercase; line-height: 1.1; margin: 0.5rem 0; font-family: 'Courier New', Courier, monospace; }
.newspaper-card__divider { height: 4px; border-top: 1px solid #1c1a17; border-bottom: 1px solid #1c1a17; margin: 0.2rem 0; }
.newspaper-card__body { display: flex; flex-direction: column; gap: 1rem; }
.newspaper-card__image-wrapper { width: 100%; aspect-ratio: 16/10; overflow: hidden; border: 1px solid #1c1a17; filter: grayscale(1) contrast(1.2); mix-blend-mode: multiply; }
.newspaper-card__img { width: 100%; height: 100%; object-fit: cover; }
.newspaper-card__snippet { font-size: 0.95rem; line-height: 1.4; text-align: justify; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; font-family: 'Georgia', serif; }
.newspaper-card__footer { margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(28, 26, 23, 0.1); text-align: right; }
.read-more { font-size: 0.85rem; font-weight: bold; text-transform: uppercase; color: #1c1a17; transition: color 0.2s; }
.newspaper-card:hover .read-more { color: #ff003c; }
.social__no-news { text-align: center; color: #888; padding: 3rem; font-style: italic; }

/* --- SECCIÓN REDES (MANTENIDO) --- */
.social__networks { text-align: center; border-top: 1px solid #222222; padding-top: 3.5rem; width: 100%; }
.social__networks h3 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; color: #fff; text-transform: uppercase; letter-spacing: 1px; }
.social__networks p { color: #888888; font-size: 0.95rem; margin-bottom: 2rem; }
.social-redirect-buttons { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
.social-btn { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.9rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 1rem; transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease; min-width: 180px; justify-content: center; box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
.social-btn .icon { width: 20px; height: 20px; }
.social-btn--instagram { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(220, 39, 67, 0.2); }
.social-btn--facebook { background: #1877f2; color: #ffffff; box-shadow: 0 4px 15px rgba(24, 119, 242, 0.2); }
.social-btn:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); }
</style>