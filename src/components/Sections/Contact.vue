<template>
  <section class="contact" id="contacto">
    <div class="contact-container">
      <h2>Contacto</h2>
      <p class="contact-subtitle">¿Tienes alguna pregunta? Escríbenos y te responderemos lo antes posible.</p>

      <form
        action="https://formspree.io/f/your-id"
        method="POST"
      >
        <div class="form-group">
          <input type="text" name="name" placeholder="Nombre" required />
        </div>
        
        <div class="form-group">
          <input type="email" name="email" placeholder="Email" required />
        </div>
        
        <div class="form-group">
          <input type="text" name="subject" placeholder="Asunto" />
        </div>
        
        <div class="form-group">
          <textarea name="message" placeholder="Mensaje" rows="5" required></textarea>
        </div>

        <button :disabled=true type="submit" class="submit-btn">Enviar</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 4rem 1.5rem; /* Reducido el padding lateral en móviles */
  color: white;
  display: flex;
  justify-content: center;
}

.contact-container {
  width: 100%;
  max-width: 600px; /* Evita que el formulario se estire demasiado en pantallas grandes */
  text-align: center;
}

h2 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.contact-subtitle {
  color: #ccc;
  margin-bottom: 2rem;
  font-size: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
}

input, textarea {
  width: 100%;
  padding: 0.9rem;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: rgba(255, 255, 255, 0.1); /* Fondo sutil para que encaje en fondos oscuros */
  color: white;
  font-size: 16px; /* ¡CRÍTICAL! Evita el zoom automático en iOS (Safari/Chrome) */
  transition: border-color 0.3s ease, background-color 0.3s ease;
  box-sizing: border-box; /* Asegura que el padding no rompa el ancho del 100% */
}

/* Cambiar el color del placeholder para que sea legible en fondos oscuros */
input::placeholder, textarea::placeholder {
  color: #aaa;
}

/* Efecto Focus para mejorar la experiencia de usuario (UX) */
input:focus, textarea:focus {
  outline: none;
  border-color: #ff0000;
  background-color: rgba(255, 255, 255, 0.15);
}

textarea {
  resize: vertical; /* Permite estirar hacia abajo, pero no de lado destruyendo el diseño */
  min-height: 120px;
}

.submit-btn {
  background: #ff0000;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.1s ease;
  width: 100%; /* Botón grande y fácil de presionar con el pulgar en móviles */
}

/* Efectos de interacción para ordenadores */
@media (min-width: 768px) {
  .submit-btn:hover {
    background: #cc0000;
  }
  
  .submit-btn:active {
    transform: scale(0.98);
  }
}
</style>