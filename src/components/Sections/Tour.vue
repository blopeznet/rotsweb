<template>
  <section class="tour" id="tour">
    <div class="tour-container">
      <h2>Próximos Conciertos</h2>
      <p class="tour-subtitle">¡No te quedes sin tu lugar! Asegura tus entradas para los siguientes shows.</p>

      <div class="tour__list">
        <div v-for="(c, i) in concerts" :key="i" class="tour__item">
          <div class="tour__info">
            <span class="tour__date">{{ formatDate(c.date) }}</span>
            <div class="tour__place">
              <h3>{{ c.city }}</h3>
              <p>{{ c.venue }}</p>
            </div>
          </div>

          <a :href="c.tickets" target="_blank" class="btn-tickets">
            Comprar Entradas
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  concerts: {
    type: Array,
    default: () => [
      {
        city: "Madrid",
        venue: "Sala Nazca",
        date: "2026-09-12",
        tickets: "#",
      },
      {
        city: "Barcelona",
        venue: "Razzmatazz",
        date: "2026-10-05",
        tickets: "#",
      }
    ],
  },
})

const formatDate = (date) => {
  // Añadimos 'UTC' explícito o reemplazamos guiones para evitar problemas de desfase de días en zonas horarias al usar strings
  const dateObj = new Date(date.replace(/-/g, '\/'));
  return dateObj.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).replace('.', ''); // Quitamos el punto que a veces añade 'short' en español (ej: "sep.")
}
</script>

<style scoped>
.tour {
  padding: 4rem 1.5rem; /* Padding lateral ideal para pantallas móviles */
  color: white;
  display: flex;
  justify-content: center;
}

.tour-container {
  width: 100%;
  max-width: 800px; /* Ancho máximo para que las filas no se vean infinitas en PC */
}

h2 {
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.tour-subtitle {
  color: #aaa;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

.tour__list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.tour__item {
  display: flex;
  flex-direction: column; /* Por defecto en móvil: todo en columna */
  gap: 1.2rem;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.03); /* Fondo sutil para enmarcar el evento */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-align: center;
  align-items: center;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.tour__info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.tour__date {
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: bold;
  color: #ff0000; /* Resalta la fecha con el color de tu marca */
  letter-spacing: 1px;
}

.tour__place h3 {
  font-size: 1.4rem;
  margin: 0 0 0.2rem 0;
}

.tour__place p {
  color: #ccc;
  margin: 0;
  font-size: 1rem;
}

.btn-tickets {
  background: #ff0000;
  color: white;
  padding: 0.9rem 1.5rem;
  border-radius: 8px; /* Cambiado a 8px para hacer juego con los inputs del componente Contacto */
  text-decoration: none;
  font-weight: bold;
  font-size: 0.95rem;
  width: 100%; /* Botón ancho en móvil, fácil de pulsar */
  box-sizing: border-box;
  text-align: center;
  transition: background 0.3s ease, transform 0.1s ease;
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
    flex-direction: row; /* La fecha y el lugar se ponen de lado */
    align-items: center;
    gap: 2.5rem;
    width: auto;
  }

  .tour__date {
    font-size: 1.05rem;
    min-width: 110px; /* Evita que la fecha altere el alineamiento de la fila */
  }

  .btn-tickets {
    width: auto; /* El botón recupera su tamaño original en PC */
    padding: 0.8rem 1.8rem;
  }

  /* Efectos Hover solo funcionales en pantallas con ratón (PC) */
  .tour__item:hover {
    border-color: rgba(255, 0, 0, 0.4);
    transform: translateY(-2px);
  }

  .btn-tickets:hover {
    background: #cc0000;
  }

  .btn-tickets:active {
    transform: scale(0.97);
  }
}
</style>