// commands/music.js - Comando de música PREMIUM con descarga real
const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

module.exports = {
  name: 'music',
  aliases: ['musica', 'song', 'cancion'],
  description: '🎵 Busca y descarga música de YouTube con información detallada',
  category: 'descargas',
  
  async execute(sock, message, args) {
    try {
      // Verificar que se proporcionó el nombre de la canción
      if (args.length === 0) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ *Uso correcto:*\n\n' +
                '!music <nombre de la canción>\n\n' +
                '*Ejemplos:*\n' +
                '• !music despacito\n' +
                '• !music bohemian rhapsody\n' +
                '• !music bad bunny chambea'
        });
      }

      const query = args.join(' ');

      // Verificar si hay API key de YouTube
      if (!config.youtubeApiKey || config.youtubeApiKey === 'TU_API_KEY_AQUI') {
        return await this.sendPreviewOnly(sock, message, query);
      }

      // Enviar mensaje de búsqueda
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🔍 Buscando *' + query + '*... ⏳' 
      });

      // Buscar en YouTube con API
      const videoData = await this.searchYouTube(query);
      
      if (!videoData) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ No encontré resultados para: *' + query + '*\n\nIntenta con otro nombre.'
        });
      }

      // Enviar información del video con thumbnail
      await this.sendVideoInfo(sock, message, videoData);

      // Intentar descargar el audio
      await sock.sendMessage(message.key.remoteJid, { 
        text: '⬇️ Descargando audio... ⏳\n\n_Esto puede tardar unos segundos_'
      });

      const audioBuffer = await this.downloadAudio(videoData.videoId);

      if (audioBuffer) {
        // Enviar el audio
        await sock.sendMessage(message.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          fileName: `${videoData.title}.mp3`,
          ptt: false // No es nota de voz, es archivo de audio
        }, {
          quoted: message
        });

        logger.success(`Audio descargado y enviado: ${videoData.title}`);
      } else {
        // Si falla la descarga, enviar solo el enlace
        await sock.sendMessage(message.key.remoteJid, { 
          text: '⚠️ No pude descargar el audio.\n\n' +
                '🔗 Puedes verlo aquí:\n' +
                videoData.url
        });
      }
      
    } catch (error) {
      logger.error('Error en comando music:', error.message);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ Hubo un error al procesar tu solicitud.\n\n' +
              'Intenta de nuevo en unos segundos.'
      });
    }
  },

  // Buscar video en YouTube usando YouTube Data API v3
  async searchYouTube(query) {
    try {
      const url = `${config.apis.youtube}/search`;
      
      const response = await axios.get(url, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 1,
          key: config.youtubeApiKey,
          videoCategoryId: '10' // Categoría de música
        },
        timeout: 10000
      });

      if (!response.data.items || response.data.items.length === 0) {
        return null;
      }

      const video = response.data.items[0];
      const videoId = video.id.videoId;

      // Obtener detalles adicionales del video
      const detailsUrl = `${config.apis.youtube}/videos`;
      const detailsResponse = await axios.get(detailsUrl, {
        params: {
          part: 'contentDetails,statistics',
          id: videoId,
          key: config.youtubeApiKey
        },
        timeout: 10000
      });

      const details = detailsResponse.data.items[0];
      const duration = this.parseDuration(details.contentDetails.duration);

      return {
        videoId: videoId,
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.high.url,
        duration: duration,
        url: `https://youtu.be/${videoId}`,
        views: parseInt(details.statistics.viewCount).toLocaleString()
      };

    } catch (error) {
      logger.error('Error buscando en YouTube:', error.message);
      return null;
    }
  },

  // Enviar información del video con imagen
  async sendVideoInfo(sock, message, videoData) {
    try {
      // Descargar thumbnail
      const thumbnailResponse = await axios.get(videoData.thumbnail, {
        responseType: 'arraybuffer',
        timeout: 10000
      });
      
      const thumbnailBuffer = Buffer.from(thumbnailResponse.data);

      // Mensaje con información
      const infoText = `🎵 *${videoData.title}*\n\n` +
                      `👤 Canal: ${videoData.channel}\n` +
                      `⏱️ Duración: ${videoData.duration}\n` +
                      `👁️ Vistas: ${videoData.views}\n` +
                      `🔗 Link: ${videoData.url}\n\n` +
                      `⬇️ _Descargando audio..._`;

      // Enviar imagen con caption
      await sock.sendMessage(message.key.remoteJid, {
        image: thumbnailBuffer,
        caption: infoText
      }, {
        quoted: message
      });

    } catch (error) {
      logger.error('Error enviando info del video:', error.message);
      
      // Si falla la imagen, enviar solo texto
      const infoText = `🎵 *${videoData.title}*\n\n` +
                      `👤 ${videoData.channel}\n` +
                      `⏱️ ${videoData.duration}\n` +
                      `👁️ ${videoData.views} vistas\n` +
                      `🔗 ${videoData.url}`;

      await sock.sendMessage(message.key.remoteJid, {
        text: infoText
      });
    }
  },

  // Descargar audio usando Cobalt.tools API
  async downloadAudio(videoId) {
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      // Llamar a Cobalt API
      const response = await axios.post(config.apis.cobalt, {
        url: videoUrl,
        vCodec: 'h264',
        vQuality: '720',
        aFormat: 'mp3',
        isAudioOnly: true
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data.status === 'redirect' || response.data.status === 'stream') {
        const audioUrl = response.data.url;
        
        // Descargar el audio
        const audioResponse = await axios.get(audioUrl, {
          responseType: 'arraybuffer',
          timeout: 60000,
          maxContentLength: 50 * 1024 * 1024 // 50MB max
        });

        return Buffer.from(audioResponse.data);
      }

      return null;

    } catch (error) {
      logger.error('Error descargando con Cobalt:', error.message);
      
      // Intentar con API alternativa (si Cobalt falla)
      return await this.downloadAudioFallback(videoId);
    }
  },

  // Método alternativo de descarga (fallback)
  async downloadAudioFallback(videoId) {
    try {
      // Usar API de yt-download como fallback
      const url = `https://yt-download.org/api/button/mp3/${videoId}`;
      
      const response = await axios.get(url, {
        timeout: 30000
      });

      if (response.data && response.data.link) {
        const audioResponse = await axios.get(response.data.link, {
          responseType: 'arraybuffer',
          timeout: 60000
        });

        return Buffer.from(audioResponse.data);
      }

      return null;

    } catch (error) {
      logger.error('Error en descarga fallback:', error.message);
      return null;
    }
  },

  // Modo solo preview (cuando no hay API key)
  async sendPreviewOnly(sock, message, query) {
    try {
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🔍 Buscando... ⏳' 
      });

      // Buscar en YouTube sin API (scraping simple)
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl, { timeout: 10000 });
      
      const match = response.data.match(/"videoId":"([^"]+)"/);
      
      if (match) {
        const videoId = match[1];
        const videoUrl = `https://youtu.be/${videoId}`;
        
        await sock.sendMessage(message.key.remoteJid, {
          text: `🎵 Encontré esto:\n\n${videoUrl}\n\n` +
                `💡 *Nota:* Para descargar el audio, necesito que configures la API de YouTube.\n` +
                `Pídele al administrador que configure YOUTUBE_API_KEY`
        });
      } else {
        await sock.sendMessage(message.key.remoteJid, {
          text: '❌ No encontré resultados para: *' + query + '*'
        });
      }

    } catch (error) {
      logger.error('Error en preview:', error.message);
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Error al buscar el video.'
      });
    }
  },

  // Convertir duración ISO 8601 a formato legible
  parseDuration(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};
