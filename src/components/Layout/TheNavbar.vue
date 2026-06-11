<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar__container">

      <router-link to="/" class="navbar__logo">
        <img :src="logo" alt="Rise Of The Shadows" />
        <span>Rise Of The Shadows</span>
      </router-link>

      <nav class="navbar__links">
        <router-link to="/#hero">Media</router-link>
        <router-link to="/#social">Social</router-link>
        <router-link to="/#tour">Conciertos</router-link>
        <router-link to="/#game">Juego</router-link>
        <router-link to="/admin">Admin</router-link>
      </nav>

      <div class="navbar__actions">
        <a class="btn btn--spotify" href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
            <path fill="currentColor"
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207c-2.377-1.454-5.37-1.783-8.894-.982c-.336.074-.67-.14-.744-.477c-.074-.336.139-.67.476-.744c3.856-.88 7.15-.505 9.815 1.13c.295.18.387.563.207.858zm1.223-2.723c-.226.367-.707.487-1.074.26c-2.72-1.672-6.87-2.157-10.082-1.182c-.412.125-.845-.107-.97-.52c-.125-.413.108-.846.52-.97c3.673-1.114 8.243-.574 11.347 1.33c.367.227.487.708.26 1.075zm.106-2.828C14.393 8.74 8.557 8.547 5.167 9.575c-.522.158-1.076-.14-1.235-.662c-.158-.522.14-1.077.662-1.235C8.36 6.516 14.81 6.73 18.877 9.146c.47.28.622.893.342 1.364c-.28.472-.893.622-1.364.342z" />
          </svg>
          Spotify
        </a>
        <a class="btn btn--youtube" href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
            <path fill="currentColor"
              d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          YouTube
        </a>
      </div>

      <button class="navbar__toggle" @click="menuOpen = !menuOpen">
        ☰
      </button>
    </div>

    <div v-if="menuOpen" class="navbar__mobile">
      <router-link to="/#hero" @click="closeMenu">Media</router-link>
      <router-link to="/#social" @click="closeMenu">Social</router-link>
      <router-link to="/#tour" @click="closeMenu">Conciertos</router-link>
      <router-link to="/#game" @click="closeMenu">Juego</router-link>
      <router-link to="/admin" @click="closeMenu">Admin</router-link>
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
/* Mantén tus mismos estilos intactos, la etiqueta <router-link> se renderiza como un <a> automáticamente por lo que tus estilos CSS seguirán aplicando perfectamente */
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

.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

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

.navbar__links {
  display: flex;
  gap: 1.5rem;
}

/* Reemplaza .navbar__links a por esto para asegurar compatibilidad total en el scope */
.navbar__links :deep(a),
.navbar__links a {
  color: white;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.navbar__links :deep(a):hover,
.navbar__links a:hover {
  opacity: 1;
}

.navbar__actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.btn .icon {
  width: 18px;
  height: 18px;
}

.btn--spotify {
  background: #1db954;
  color: black;
}

.btn--youtube {
  background: #ff0000;
  color: white;
}

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

.navbar__mobile :deep(a),
.navbar__mobile a {
  color: white;
  padding: 0.8rem 0;
  text-decoration: none;
}

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