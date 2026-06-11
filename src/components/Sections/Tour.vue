<template>
  <section class="tour" id="tour">
    <div class="tour-container">
      <h2>Próximos Conciertos</h2>
      <p class="tour-subtitle">¡No te quedes sin tu lugar! Asegura tus entradas para los siguientes shows.</p>

      <div v-if="loading" class="tour__loading">
        <p>Cargando fechas de la gira...</p>
      </div>

      <div v-else-if="concerts.length > 0" class="tour__list">
        <div v-for="(c, i) in concerts" :key="i" class="tour__item">
          <div class="tour__info">
            <span class="tour__date">{{ formatDate(c.date) }}</span>
            <div class="tour__place">
              <h3>{{ c.city }}</h3>
              <p>{{ c.venue }}</p>
            </div>
          </div>

          <a 
            :href="c.tickets && c.tickets !== '#' ? c.tickets : '#contact'" 
            target="_blank" 
            class="btn-tickets"
            :class="{ 'btn-tickets--contact': !c.tickets || c.tickets === '#' }"
          >
            {{ c.tickets && c.tickets !== '#' ? 'Comprar Entradas' : 'Más Info / Reservar' }}
          </a>
        </div>
      </div>

      <div v-else class="tour__empty">
        <p>Próximamente anunciaremos nuevas fechas del tour. ¡Mantente atento!</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const concerts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Llamamos al endpoint común autogestionado
    const response = await fetch('/api/manage')
    if (!response.ok) throw new Error('Error al cargar las fechas del tour')
    
    const data = await response.json()
    concerts.value = data.concerts || []
  } catch (e) {
    console.error("Error obteniendo conciertos desde Tour.vue:", e)
  } finally {
    loading.value = false
  }
})

const formatDate = (date) => {
  if (!date) return ''
  // Reemplazamos guiones por barras para normalizar el comportamiento entre navegadores y evitar desajustes de zona horaria
  const normalizedDate = date.replace(/-/g, '/')
  const options = { day: '2-digit', month: 'short' }
  
  try {
    const d = new Date(normalizedDate)
    const formatted = d.toLocaleDateString('es-ES', options).toUpperCase()
    // Limpiamos el punto que a veces añade 'es-ES' en los meses cortos (ej: 'AGO.')
    return formatted.replace('.', '')
  } catch (e) {
    return date
  }
}
</script>

<style scoped>
/* --- Estilos base del componente Tour --- */
.tour {
  background: #000;
  color: white;
  padding: 5rem 1.5rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.tour-container {
  max-width: 900px;
  margin: 0 auto;
}

.tour h2 {
  font-size: 2.5rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  color: #fff;
  font-weight: 800;
}

.tour-subtitle {
  text-align: center;
  color: #888;
  margin-bottom: 3.5rem;
  font-size: 1.1rem;
}

/* --- Estados de carga y vacío --- */
.tour__loading,
.tour__empty {
  text-align: center;
  padding: 3rem;
  color: #666;
  border: 1px dashed #222;
  border-radius: 12px;
  font-size: 1.1rem;
}

/* --- Lista de Conciertos --- */
.tour__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tour__item {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  transition: border-color 0.3s ease, transform 0.3s ease;
}

.tour__item:hover {
  border-color: #ff0000; /* Detalle infernal/metalero en hover */
  transform: scale(1.01);
}

.tour__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.tour__date {
  font-size: 1.8rem;
  font-weight: 900;
  color: #ff0000;
  letter-spacing: 1px;
  line-height: 1;
}

.tour__place h3 {
  font-size: 1.4rem;
  margin: 0 0 0.3rem 0;
  font-weight: 700;
}

.tour__place p {
  color: #aaaaaa;
  margin: 0;
  font-size: 1rem;
}

/* --- Botón de entradas --- */
.btn-tickets {
  background: #ff0000;
  color: white;
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  transition: background 0.3s ease, transform 0.1s ease;
  letter-spacing: 0.5px;
}

.btn-tickets:hover {
  background: #cc0000;
}

.btn-tickets--contact {
  background: #222;
  border: 1px solid #444;
}

.btn-tickets--contact:hover {
  background: #333;
  border-color: #666;
}

/* 🖥️ MEDIA QUERY: Ajustes para pantallas grandes (Tablets y PC) */
@media (min-width: 650px) {
  .tour__item {
    flex-direction: row; /* En PC se vuelve una fila horizontal */
    justify-content: space-between;
    text-align: left;
    padding: 1.2rem 2rem;
  }

  .tour__info {
    flex-direction: row; /* La fecha y el lugar se ponen en línea */
    align-items: center;
    gap: 3rem;
    width: auto;
  }

  .tour__date {
    min-width: 110px; /* Evita que el texto de la fecha haga saltos de línea */
  }

  .btn-tickets {
    width: auto; /* El botón recupera su tamaño contenido en PC */
    padding: 0.8rem 2rem;
  }
}
</style>