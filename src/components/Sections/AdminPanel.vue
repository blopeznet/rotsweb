<template>
  <section class="admin-panel">
    <h2>Panel de Control - Rise of the Shadows</h2>

    <div class="login-box" v-if="!authorized">
      <input type="password" v-model="password" placeholder="Contraseña Admin" @keyup.enter="login" />
      <button @click="login">Acceder</button>
    </div>

    <div v-else class="admin-editor">
      <div class="admin-card">
        <h3>Configuración Global de Redes e IDs</h3>
        <label>Instagram URL:</label>
        <input v-model="db.settings.instagramUrl" />

        <label>Facebook URL:</label>
        <input v-model="db.settings.facebookUrl" />

        <label>Spotify Album ID:</label>
        <input v-model="db.settings.spotifyId" />

        <label>YouTube Playlist ID:</label>
        <input v-model="db.settings.youtubePlaylistId" />
      </div>

      <div class="admin-card">
        <h3>Gestión de Enlaces a Medios (Carrusel)</h3>

        <div v-for="(post, index) in db.news" :key="post.id || index" class="admin-news-item">
          <div class="news-item-header">
            <h4>Enlace #{{ index + 1 }}</h4>
            <button @click="db.news.splice(index, 1)" class="btn-delete-block">🗑️ Eliminar</button>
          </div>

          <div class="news-grid-inputs">
            <div>
              <label>Medio / Origen de la Noticia:</label>
              <input v-model="post.source" placeholder="Ej: RockFM, Metal Hammer, Rafabasa" />
            </div>
            <div>
              <label>Título del artículo:</label>
              <input v-model="post.title" placeholder="Ej: Reseña brutal de 'The Abyss'" />
            </div>
          </div>

          <label>Entradilla / Subtítulo corto:</label>
          <input v-model="post.subtitle" placeholder="Ej: El medio nos califica con un 10/10 en su último número..." />

          <div class="news-grid-inputs">
            <div>
              <label>URL de Destino (Enlace a la noticia):</label>
              <input v-model="post.link" placeholder="https://www.rafabasa.com/noticia-rise" />
            </div>
            <div>
              <label>Imagen o Miniatura:</label>
              <div class="image-upload-zone">
                <input type="file" accept="image/*" @change="handleImageUpload($event, post)" class="file-input" />
                <small class="image-preview-text" v-if="post.media_url">✓ Imagen lista</small>
              </div>
            </div>
          </div>

          <div v-if="post.media_url" class="admin-img-preview">
            <img :src="post.media_url" alt="Previsualización" />
          </div>
        </div>

        <button @click="addNewPost" class="btn-add">+ Añadir Nuevo Enlace</button>
      </div>

      <div class="admin-card">
        <h3>Próximos Conciertos</h3>
        <div v-for="(concert, index) in db.concerts" :key="index" class="form-row">
          <input v-model="concert.city" placeholder="Ciudad" />
          <input v-model="concert.venue" placeholder="Sala" />
          <input type="date" v-model="concert.date" />
          <input v-model="concert.tickets" placeholder="Link Entradas" />
          <button @click="db.concerts.splice(index, 1)" class="btn-delete">❌</button>
        </div>
        <button @click="db.concerts.push({ city: '', venue: '', date: '', tickets: '#' })" class="btn-add">+ Añadir
          Concierto</button>
      </div>

      <button @click="saveChanges" class="btn-save">💾 GUARDAR TODO EN LA WEB</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const password = ref('');
const authorized = ref(false);
const db = ref({ settings: {}, concerts: [], news: [] });

const login = async () => {
  try {
    const response = await fetch('/api/manage');
    db.value = await response.json();
    if (!db.value.news) db.value.news = [];
    if (!db.value.settings) db.value.settings = {};
    if (!db.value.concerts) db.value.concerts = [];
    authorized.value = true;
  } catch (error) {
    alert("Error al conectar.");
  }
};

const addNewPost = () => {
  db.value.news.unshift({
    id: Date.now(),
    source: '', // Nuevo campo
    title: '',
    subtitle: '',
    media_url: '',
    link: '',
    timestamp: new Date().toISOString()
  });
};

const handleImageUpload = (event, post) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    post.media_url = e.target.result;
  };
  reader.readAsDataURL(file);
};

const saveChanges = async () => {
  const response = await fetch('/api/manage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password.value, newData: db.value })
  });

  if (response.ok) {
    alert('¡Web actualizada con éxito!');
    window.location.reload();
  } else {
    alert('Error al guardar.');
  }
};
</script>

<style scoped>
.admin-panel {
  background: #111;
  color: #fff;
  padding: 2rem;
  border-radius: 12px;
  margin: 6rem auto;
  max-width: 900px;
  border: 2px solid #ff003c;
  font-family: sans-serif;
  padding-top:3rem;
}

.admin-card {
  background: #1a1a1a;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border-left: 3px solid #ff003c;
}

h2 {
  color: #ff003c;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

h3 {
  margin-top: 0;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
  font-size: 1.3rem;
}

label {
  font-size: 0.85rem;
  color: #aaa;
  font-weight: bold;
  display: block;
  margin-top: 0.5rem;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin: 0.4rem 0 1rem 0;
  background: #222;
  border: 1px solid #444;
  color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.form-row input {
  margin: 0;
}

.btn-add {
  background: #333;
  color: #fff;
  border: 1px dashed #ff003c;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-add:hover {
  background: #ff003c22;
}

.btn-save {
  background: #ff003c;
  color: white;
  padding: 1.2rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.admin-news-item {
  background: #222;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border: 1px solid #333;
}

.news-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.news-item-header h4 {
  margin: 0;
  color: #ff003c;
}

.btn-delete-block {
  background: #ff003c;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.news-grid-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .news-grid-inputs {
    grid-template-columns: 1fr;
  }
}

.image-upload-zone {
  margin: 0.4rem 0 1rem 0;
}

.file-input {
  margin: 0;
  background: #2a2a2a;
}

.image-preview-text {
  color: #00ff66;
  display: block;
  margin-top: 0.2rem;
}

.admin-img-preview {
  margin-top: 0.5rem;
  max-width: 200px;
  max-height: 120px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #444;
}

.admin-img-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>