<script setup>
import TheNavbar from './components/Layout/TheNavbar.vue'

import Hero from './components/Sections/Hero.vue'
import Music from './components/Sections/Music.vue'
import Socials from './components/Sections/Socials.vue'
import Tour from './components/Sections/Tour.vue'
import Contact from './components/Sections/Contact.vue'

import GameArea from './components/Game/GameArea.vue'
</script>

<template>
  <div
    class="bg-zinc-950 text-zinc-100 min-h-screen"
  >
    <TheNavbar />

    <main>
      <Hero  id="hero" />
      <Music id="music" />
      <Socials id="social" />
      <Tour id="tour"  />
      <GameArea id="game"/>
      <Contact id="contact" />
    </main>
  </div>
</template>