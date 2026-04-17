// commands/musica.js - Comando para descargar música de YouTube
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const axios = require('axios');

module.exports = {
  name: 'musica',
  description: 'Descarga música de YouTube',
  
  async execute(sock, message, args) {
    try {
      // Verificar que se haya proporcionado un nombre
      if (args.length === 0) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ Por favor especifica el nombre de la canción.\n\n*Ejemplo:* !musica despacito' 
        });
      }

      const query = args.join(' ');

      // Enviar mensaje de búsqueda
      await sock.sendMessage(message.key.remoteJid, { 
        text: `🔍 Buscando: *${query}*... ⏳` 
      });

      // Buscar en YouTube usando una API de búsqueda
      // Nota: Usaremos una búsqueda simple de YouTube
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      
      // Alternativa: usar ytdl-core para obtener info de un video conocido
      // Por simplicidad, vamos a asumir que el usuario proporciona una URL o usamos una API externa
      
      // Para este ejemplo, vamos a simular con una URL de ejemplo
      // En producción, deberías usar una API de búsqueda de YouTube como youtube-search-api
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: `ℹ️ *Nota:* Para descargar música, necesitas proporcionar una URL directa de YouTube.\n\n*Ejemplo:* !musica https://youtu.be/kJQP7kiw5Fk\n\n_O puedes usar servicios de búsqueda de YouTube manualmente por ahora._` 
      });

      // Si el primer argumento es una URL válida de YouTube
      if (ytdl.validateURL(args[0])) {
        const url = args[0];
        
        await sock.sendMessage(message.key.remoteJid, { 
          text: '📥 Descargando audio... ⏳' 
        });

        // Obtener información del video
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        const duration = parseInt(info.videoDetails.lengthSeconds);

        // Limitar a 10 minutos (600 segundos)
        if (duration > 600) {
          return await sock.sendMessage(message.key.remoteJid, { 
            text: '❌ El audio es demasiado largo (máximo 10 minutos).' 
          });
        }

        // Crear archivo temporal
        const tempFile = path.join(__dirname, '..', `audio_${Date.now()}.mp3`);

        // Descargar audio
        const stream = ytdl(url, { 
          quality: 'highestaudio',
          filter: 'audioonly'
        });

        const writeStream = fs.createWriteStream(tempFile);
        stream.pipe(writeStream);

        await new Promise((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });

        // Leer el archivo
        const audioBuffer = fs.readFileSync(tempFile);

        // Enviar el audio
        await sock.sendMessage(message.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          fileName: `${title}.mp3`,
          ptt: false
        }, { 
          quoted: message 
        });

        // Eliminar archivo temporal
        fs.unlinkSync(tempFile);

        logger.success(`Audio enviado: ${title}`);
      }
      
    } catch (error) {
      logger.error('Error al descargar música', error);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ No pude descargar el audio. Verifica que la URL sea válida o intenta de nuevo más tarde.' 
      });
    }
  }
};
