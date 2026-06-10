// api/get-socials.js

export default async function handler(request, response) {
  // Permitimos que tu frontend consulte la API sin bloqueos
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET');

  // Caché de Vercel: Guarda el resultado 12 horas (43200 seg) en sus servidores mundiales
  response.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate=3600');

  try {
    // 💡 Pon aquí tu usuario de Instagram exacto
    const username = 'riseoftheshadowsmetalband'; 
    const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://rssbridge.app/action%3Ddisplay%26bridge%3DInstagram%26u%3D${username}%26format%3DAtom`;

    const fetchResponse = await fetch(rssUrl);
    const data = await fetchResponse.json();

    if (!data.items || data.items.length === 0) {
      return response.status(404).json({ error: 'No se encontraron publicaciones.' });
    }

    // Mapeamos los posts al formato limpio que tu Vue entiende
    const cleanPosts = data.items.slice(0, 3).map((item, index) => {
      // Expresión regular para extraer la URL de la imagen que viene dentro del HTML del RSS
      const imgRegex = /<img[^>]+src="([^">]+)"/;
      const match = item.content.match(imgRegex);
      const mediaUrl = match ? match[1] : `https://picsum.photos/600/600?random=${index}`;

      return {
        id: item.guid || String(index),
        platform: 'instagram',
        media_url: mediaUrl,
        permalink: item.link,
        caption: item.title || 'Ver publicación',
        timestamp: item.pubDate
      };
    });

    return response.status(200).json(cleanPosts);

  } catch (error) {
    console.error('Error en la Serverless Function:', error);
    return response.status(500).json({ error: 'Error interno al obtener el feed.' });
  }
}