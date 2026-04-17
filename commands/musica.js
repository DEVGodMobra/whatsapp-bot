// commands/musica.js - Comando con vista previa de YouTube
const axios = require('axios');
const logger = require('../utils/logger');

module.exports = {
  name: 'musica',
  description: 'Busca música/video en YouTube y muestra vista previa',
  
  async execute(sock, message, args) {
    try {
      // Verificar que se haya proporcionado un nombre
      if (args.length === 0) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ Por favor especifica el nombre de la canción o video.\n\n*Ejemplo:* !musica despacito' 
        });
      }

      const query = args.join(' ');

      // Enviar mensaje de búsqueda
      await sock.sendMessage(message.key.remoteJid, { 
        text: `🔍 Buscando: *${query}*...\n⏳ Esto puede tomar unos segundos...` 
      });

      try {
        // Buscar en YouTube usando scraping simple
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const html = response.data;
        
        // Buscar el primer video ID en el HTML
        const videoIdMatch = html.match(/"videoId":"([^"]+)"/);
        
        if (videoIdMatch && videoIdMatch[1]) {
          const videoId = videoIdMatch[1];
          const videoUrl = `https://youtu.be/${videoId}`;
          
          // Enviar el enlace - WhatsApp generará vista previa automáticamente
          await sock.sendMessage(message.key.remoteJid, { 
            text: `🎵 *Resultado para:* ${query}\n\n${videoUrl}\n\n💡 *Toca la imagen para reproducir el video*\n\n_Vista previa generada automáticamente por WhatsApp_`
          });

          logger.success(`Video encontrado: ${videoUrl}`);
        } else {
          // Si no se encuentra, enviar enlace de búsqueda
          await sock.sendMessage(message.key.remoteJid, { 
            text: `🔍 *Búsqueda:* ${query}\n\n` +
                  `No pude encontrar un resultado exacto, pero aquí está el enlace de búsqueda:\n\n` +
                  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}\n\n` +
                  `💡 Toca el enlace para ver todos los resultados`
          });
        }
        
      } catch (searchError) {
        // Si falla el scraping, enviar enlace de búsqueda manual
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        
        await sock.sendMessage(message.key.remoteJid, { 
          text: `🔍 *Búsqueda:* ${query}\n\n` +
                `Aquí está el enlace de búsqueda:\n\n${searchUrl}\n\n` +
                `💡 Toca el enlace para ver los resultados`
        });
      }
      
    } catch (error) {
      logger.error('Error en comando música:', error.message);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ Ocurrió un error al buscar. Intenta de nuevo con otro término de búsqueda.' 
      });
    }
  }
};
