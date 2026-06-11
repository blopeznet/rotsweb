<template>
  <section class="media">
    <div class="media__background">
      <video v-if="useVideo" class="media__video" autoplay muted loop playsinline>
        <source :src="backgroundVideo" type="video/mp4" />
      </video>

      <img v-else class="media__image" :src="backgroundImage" alt="Background RiseOfTheShadows" />
      <div class="media__overlay"></div>
    </div>

    <div class="media__content">
      <header class="media__header">
        <img class="media__logo" :src="logo" alt="RiseOfTheShadows logo" />

        <div class="media__buttons">
          <a class="btn btn--spotify"
            :href="`https://open.spotify.com/artist/${socialSettings.spotifyId || '2MxgkKOiWoRPTpDcNskI8A'}`"
            target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
              <path fill="currentColor"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207c-2.377-1.454-5.37-1.783-8.894-.982c-.336.074-.67-.14-.744-.477c-.074-.336.139-.67.476-.744c3.856-.88 7.15-.505 9.815 1.13c.295.18.387.563.207.858zm1.223-2.723c-.226.367-.707.487-1.074.26c-2.72-1.672-6.87-2.157-10.082-1.182c-.412.125-.845-.107-.97-.52c-.125-.413.108-.846.52-.97c3.673-1.114 8.243-.574 11.347 1.33c.367.227.487.708.26 1.075zm.106-2.828C14.393 8.74 8.557 8.547 5.167 9.575c-.522.158-1.076-.14-1.235-.662c-.158-.522.14-1.077.662-1.235C8.36 6.516 14.81 6.73 18.877 9.146c.47.28.622.893.342 1.364c-.28.472-.893.622-1.364.342z" />
            </svg>
            Escuchar en Spotify
          </a>

          <a class="btn btn--youtube" :href="socialSettings.youtubeUrl || 'https://youtube.com'" target="_blank"
            rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
              <path fill="currentColor"
                d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Ver en YouTube
          </a>
        </div>
      </header>

      <div class="media__grid">
        <article class="card card--spotify">
          <div class="card__head">
            <h3>Spotify</h3>
            <span>Streaming</span>
          </div>
          <iframe v-if="socialSettings.spotifyId" class="player player--spotify"
            :src="`https://open.spotify.com/embed/artist/${socialSettings.spotifyId}`"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
        </article>

        <article class="card card--youtube">
          <div class="card__head">
            <h3>YouTube</h3>
            <a v-if="socialSettings.youtubePlaylistId" 
               :href="`https://www.youtube.com/playlist?list=${socialSettings.youtubePlaylistId}`" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="card__link">
              Ver lista completa ↗
            </a>
            <span v-else>Playlist oficial</span>
          </div>
          <iframe v-if="socialSettings.youtubePlaylistId" class="player player--youtube"
            :src="`https://www.youtube.com/embed/videoseries?list=${socialSettings.youtubePlaylistId}&controls=1&modestbranding=1&rel=0`"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen loading="lazy" />
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"

import defaultLogo from "../../assets/riseoftheshadows/logo.jpg"
import defaultBackgroundImage from "../../assets/riseoftheshadows/hero.png"
import defaultBackgroundVideo from "../../assets/riseoftheshadows/hero.mp4"

defineProps({
  logo: { type: String, default: defaultLogo },
  backgroundImage: { type: String, default: defaultBackgroundImage },
  backgroundVideo: { type: String, default: defaultBackgroundVideo },
  useVideo: { type: Boolean, default: true }
})

const socialSettings = ref({
  spotifyUrl: '',
  youtubeUrl: '',
  spotifyId: '2MxgkKOiWoRPTpDcNskI8A',
  youtubePlaylistId: 'PLBQ20XP7QJY9oMga2bErWX8HZ8E_tiOu6'
})

onMounted(async () => {
  try {
    const response = await fetch('/api/manage')
    if (response.ok) {
      const data = await response.json()
      if (data.settings) {
        socialSettings.value = data.settings
      }
    }
  } catch (error) {
    console.error("Error al obtener los identificadores multimedia:", error)
  }
})
</script>

<style scoped>
.media {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
  padding: 4rem 1.5rem;
}

.media__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.media__video,
.media__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
}

.media__overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.92));
}

.media__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
}

.media__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.media__logo {
  width: 180px;
  max-width: 60vw;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.8));
}

.media__buttons {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.9rem 1.8rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
  min-width: 200px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  font-family: system-ui, sans-serif;
}

.btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
}

.btn .icon {
  width: 20px;
  height: 20px;
}

.btn--spotify {
  background: #1db954;
  color: #000;
}

.btn--youtube {
  background: #ff0000;
  color: #fff;
}

.media__grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 900px) {
  .media__grid {
    grid-template-columns: 1fr 1.2fr;
    align-items: stretch;
  }
}

.card {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  opacity: 0.9;
}

.card__link {
  color: #ff4444;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
}

.card__link:hover {
  color: #ff0000;
  text-decoration: underline;
}

.player {
  width: 100%;
  border: 0;
  border-radius: 12px;
  background: #000;
}

.player--spotify {
  aspect-ratio: 1 / 1.2;
  min-height: 380px;
}

.player--youtube {
  flex: 1;
  min-height: 450px;
  aspect-ratio: 16 / 9;
}

@media (max-width: 768px) {
  .media {
    padding: 3rem 1rem;
  }

  .media__logo {
    width: 140px;
  }

  .media__buttons {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .btn {
    width: 100%;
    max-width: 280px;
    padding: 0.9rem 1rem;
  }

  .player--spotify {
    min-height: 320px;
  }

  .player--youtube {
    min-height: 360px;
  }
}
</style>