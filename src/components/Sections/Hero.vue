<template>
  <section class="hero">
    <!-- Background -->
    <div class="hero__background">
      <video
        v-if="useVideo"
        class="hero__video"
        autoplay
        muted
        loop
        playsinline
      >
        <source :src="backgroundVideo" type="video/mp4" />
      </video>

      <img
        v-else
        class="hero__image"
        :src="backgroundImage"
        alt="Background RiseOfTheShadows"
      />
      <div class="hero__overlay"></div>
    </div>

    <!-- Content -->
    <div class="hero__content">
      <img class="hero__logo" :src="logo" alt="RiseOfTheShadows logo" />

      <h1 class="hero__album">{{ albumName }}</h1>

      <div class="hero__buttons">
        <a
          class="btn btn--spotify"
          :href="spotifyUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Escuchar en Spotify
        </a>

        <a
          class="btn btn--youtube"
          :href="youtubeUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver en YouTube
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>

import logo from "../../assets/riseoftheshadows/logo.jpg"
import backgroundImage from "../../assets/riseoftheshadows/hero.png"
import backgroundVideo from "../../assets/riseoftheshadows/hero.mp4"


const props = defineProps({
  logo: {
    type: String,
    default: logo,
  },
  albumName: {
    type: String,
    default: "Emerging from wounds (2025)",
  },
  spotifyUrl: {
    type: String,
    default: "https://open.spotify.com/intl-es/artist/2MxgkKOiWoRPTpDcNskI8A",
  },
  youtubeUrl: {
    type: String,
    default: "https://www.youtube.com/@riseoftheshadowsband",
  },
  backgroundImage: {
    type: String,
    default: backgroundImage,
  },
  backgroundVideo: {
    type: String,
    default: backgroundVideo,
  },
  useVideo: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
}

/* Background */
.hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__video,
.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05); /* evita bordes en móviles */
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.35),
    rgba(0, 0, 0, 0.88)
  );
}

/* Content */
.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
  max-width: 100%;
}

/* LOGO */
.hero__logo {
  width: 180px;
  max-width: 60vw; /* importante en móvil */
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.8));
}

/* ALBUM TITLE */
.hero__album {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  text-transform: uppercase;
  line-height: 1.1;
  max-width: 90vw;
}

/* BUTTONS */
.hero__buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* BUTTON BASE */
.btn {
  padding: 0.9rem 1.4rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
  min-width: 140px;
  text-align: center;
}

.btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* COLORS */
.btn--spotify {
  background: #1db954;
  color: #000;
}

.btn--youtube {
  background: #ff0000;
  color: #fff;
}

/* ========================= */
/* 📱 MOBILE OPTIMIZATION */
/* ========================= */
@media (max-width: 768px) {
  .hero__content {
    padding: 1.2rem;
  }

  .hero__logo {
    width: 140px;
  }

  .hero__album {
    font-size: 1.8rem;
    letter-spacing: 1px;
  }

  .hero__buttons {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
    max-width: 260px;
    padding: 0.9rem 1rem;
  }
}

/* ========================= */
/* 📱 VERY SMALL PHONES */
/* ========================= */
@media (max-width: 380px) {
  .hero__logo {
    width: 120px;
  }

  .hero__album {
    font-size: 1.5rem;
  }
}
</style>