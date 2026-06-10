<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar__container">
      
      <!-- Logo -->
      <a href="#hero" class="navbar__logo">
        <img :src=logo alt="Rise Of The Shadows" />
        <span>Rise Of The Shadows</span>
      </a>

      <!-- Desktop nav -->
      <nav class="navbar__links">
        <a href="#hero">Inicio</a>
        <a href="#music">Música</a>
        <a href="#social">Social</a>
        <a href="#tour">Conciertos</a>
        <a href="#game">Juego</a>
        <a href="#contact">Contacto</a>
      </nav>

      <!-- Social / CTA -->
      <div class="navbar__actions">
        <a class="btn btn--spotify" href="https://open.spotify.com" target="_blank">
          Spotify
        </a>
        <a class="btn btn--youtube" href="https://youtube.com" target="_blank">
          YouTube
        </a>
      </div>

      <!-- Mobile button -->
      <button class="navbar__toggle" @click="menuOpen = !menuOpen">
        ☰
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="navbar__mobile">
      <a href="#hero" @click="closeMenu">Inicio</a>
      <a href="#music" @click="closeMenu">Música</a>
      <a href="#social" @click="closeMenu">Social</a>
      <a href="#tour" @click="closeMenu">Conciertos</a>
      <a href="#game" @click="closeMenu">Juego</a>
      <a href="#contact" @click="closeMenu">Contacto</a>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import logo from "../../assets/riseoftheshadows/logo.jpg"

const menuOpen = ref(false)
const scrolled = ref(false)

const closeMenu = () => {
  menuOpen.value = false
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped>
/* Base */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: background 0.3s ease, backdrop-filter 0.3s ease;
}

.navbar--scrolled {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
}

/* Container */
.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

/* Logo */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: white;
}

.navbar__logo img {
  width: 40px;
  height: 40px;
}

/* Links */
.navbar__links {
  display: flex;
  gap: 1.5rem;
}

.navbar__links a {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.navbar__links a:hover {
  opacity: 1;
}

/* Actions */
.navbar__actions {
  display: flex;
  gap: 0.5rem;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn--spotify {
  background: #1db954;
  color: black;
}

.btn--youtube {
  background: #ff0000;
  color: white;
}

/* Mobile */
.navbar__toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
}

.navbar__mobile {
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.95);
}

.navbar__mobile a {
  color: white;
  padding: 0.8rem 0;
  text-decoration: none;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar__links,
  .navbar__actions {
    display: none;
  }

  .navbar__toggle {
    display: block;
  }
}
</style>