<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from './components/Layout/TheNavbar.vue'
import TheFooter from './components/Layout/TheFooter.vue'

</script>

<template>
  <div class="bg-zinc-950 text-zinc-100 min-h-screen">
    <TheNavbar />

    <RouterView />
        <TheFooter />

  </div>
</template>