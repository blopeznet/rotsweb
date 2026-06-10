<template>
  <section class="music">

    <header class="music__header">
      <h2>Música</h2>
      <p>Escucha nuestras pistas y videoclips en streaming oficial.</p>
    </header>

    <div class="music__grid">

      <!-- SPOTIFY -->
      <article class="card card--spotify">
        <div class="card__head">
          <h3>Spotify</h3>
          <span>Streaming</span>
        </div>

        <iframe
          class="player player--spotify"
          :src="spotifyEmbedUrl"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </article>

      <!-- YOUTUBE PLAYLIST -->
      <article class="card card--youtube">
        <div class="card__head">
          <h3>YouTube</h3>
          <span>Playlist oficial</span>
        </div>

        <iframe
          class="player player--youtube"
          :src="youtubePlaylistUrl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        />
      </article>

    </div>

  </section>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  spotifyId: {
    type: String,
    default: "2MxgkKOiWoRPTpDcNskI8A"
  },
  youtubePlaylistId: {
    type: String,
    default: "PLBQ20XP7QJY9oMga2bErWX8HZ8E_tiOu6"
  }
})

const spotifyEmbedUrl = computed(() =>
  `https://open.spotify.com/embed/artist/${props.spotifyId}`
)

const youtubePlaylistUrl = computed(() =>
  `https://www.youtube.com/embed/videoseries?list=${props.youtubePlaylistId}`
)
</script>
<style scoped>
.music {
  padding: 5rem 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  color: white;
}

.music__header {
  text-align: center;
  margin-bottom: 3rem;
}

.music__header p {
  opacity: 0.7;
}

.music__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* desktop: mejor equilibrio */
@media (min-width: 900px) {
  .music__grid {
    grid-template-columns: 1fr 1.2fr;
    align-items: stretch;
  }
}

/* CARD */
.card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* HEADER CARD */
.card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  opacity: 0.9;
}

/* PLAYER BASE */
.player {
  width: 100%;
  border: 0;
  border-radius: 12px;
}

/* Spotify más compacto */
.player--spotify {
  aspect-ratio: 1 / 1.2;
  min-height: 380px;
}

/* YouTube playlist aprovecha altura */
.player--youtube {
  flex: 1;
  min-height: 380px;
  aspect-ratio: 16 / 9;
}

/* en móvil evita desperdicio de espacio */
@media (max-width: 768px) {
  .player--spotify,
  .player--youtube {
    min-height: 320px;
  }
}
</style>