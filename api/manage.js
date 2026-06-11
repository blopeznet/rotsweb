// api/manage.js
import fs from 'fs';
import path from 'path';

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Ruta física del archivo JSON en el entorno de Vercel/Local
  const filePath = path.join(process.cwd(), 'api', 'data.json');

  // OPERACIÓN GET: Servir los datos a la web
  if (request.method === 'GET') {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      return response.status(200).json(JSON.parse(fileData));
    } catch (error) {
      return response.status(500).json({ error: 'No se pudo leer la base de datos' });
    }
  }

  // OPERACIÓN POST: Guardar cambios desde la zona de administración
  if (request.method === 'POST') {
    const { password, newData } = request.body;

    // CONTRASEÑA DE ADMINISTRADOR (Cámbiala por la que tú quieras)
    if (password !== 'shadowsAdmin2026') {
      return response.status(403).json({ error: 'Contraseña de administrador incorrecta' });
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
      return response.status(200).json({ success: true, message: 'Datos guardados correctamente' });
    } catch (error) {
      return response.status(500).json({ error: 'Error al escribir en el archivo' });
    }
  }

  return response.status(405).json({ error: 'Método no permitido' });
}