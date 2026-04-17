// commands/music.js - Música con información detallada y descarga
const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

module.exports = {
  name: 'music',
  aliases: ['musica', 'play'],
  description: '🎵 Busca música en YouTube con información completa',
  category: 'descargas',
  
  async execute(sock, message, args) {
    try {
      if (args.length === 0) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ *Uso:* !music <nombre de canción>\n\n*Ejemplo:* !music despacito'
        });
      }

      const query = args.join(' ');

      await sock.sendMessage(message.key.remoteJid, { 
        text: '🔍 Buscando *' + query + '*... ⏳' 
      });

      // Buscar en YouTube
      const videoData = await this.searchYouTube(query);
      
      if (!videoData) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ No encontré: *' + query + '*'
        });
      }

      // Enviar información con thumbnail
      await this.sendVideoInfo(sock, message, videoData);

      // Intentar descargar
      await sock.sendMessage(message.key.remoteJid, { 
        text: '⬇️ Descargando audio... ⏳\n_Puede tardar unos segundos_'
      });

      const audioBuffer = await this.downloadAudio(videoData.videoId);

      if (audioBuffer && audioBuffer.length > 1000) {
        await sock.sendMessage(message.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          fileName: `${videoData.title}.mp3`
        });
        logger.success('Audio descargado: ' + videoData.title);
      } else {
        await sock.sendMessage(message.key.remoteJid, { 
          text: '⚠️ No pude descargar el audio.\n\n🔗 Escúchalo aquí:\n' + videoData.url
        });
      }
      
    } catch (error) {
      logger.error('Error en music:', error.message);
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ Error al procesar la solicitud.'
      });
    }
  },

  async searchYouTube(query) {
    try {
      // Si tiene API key, usar YouTube Data API
      if (config.youtubeApiKey && config.youtubeApiKey !== 'TU_API_KEY_AQUI') {
        return await this.searchWithAPI(query);
      }
      
      // Si no, usar scraping simple
      return await this.searchWithScraping(query);
      
    } catch (error) {
      logger.error('Error buscando:', error.message);
      return null;
    }
  },

  async searchWithAPI(query) {
    try {
      const searchUrl = `${config.apis.youtube}/search`;
      
      const searchResponse = await axios.get(searchUrl, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 1,
          key: config.youtubeApiKey
        },
        timeout: 10000
      });

      if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
        return null;
      }

      const video = searchResponse.data.items[0];
      const videoId = video.id.videoId;

      // Obtener detalles
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
      logger.error('Error con YouTube API:', error.message);
      return await this.searchWithScraping(query);
    }
  },

  async searchWithScraping(query) {
    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl, { timeout: 10000 });
      
      const match = response.data.match(/"videoId":"([^"]+)"/);
      const titleMatch = response.data.match(/"title":{"runs":\[{"text":"([^"]+)"/);
      
      if (match) {
        const videoId = match[1];
        const title = titleMatch ? titleMatch[1] : query;
        
        return {
          videoId: videoId,
          title: title,
          channel: 'YouTube',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: '0:00',
          url: `https://youtu.be/${videoId}`,
          views: 'N/A'
        };
      }
      
      return null;

    } catch (error) {
      logger.error('Error en scraping:', error.message);
      return null;
    }
  },

  async sendVideoInfo(sock, message, videoData) {
    try {
      const thumbnailResponse = await axios.get(videoData.thumbnail, {
        responseType: 'arraybuffer',
        timeout: 10000
      });
      
      const thumbnailBuffer = Buffer.from(thumbnailResponse.data);

      const infoText = `🎵 *${videoData.title}*\n\n` +
                      `👤 Canal: ${videoData.channel}\n` +
                      `⏱️ Duración: ${videoData.duration}\n` +
                      `👁️ Vistas: ${videoData.views}\n` +
                      `🔗 Link: ${videoData.url}`;

      await sock.sendMessage(message.key.remoteJid, {
        image: thumbnailBuffer,
        caption: infoText
      });

    } catch (error) {
      const infoText = `🎵 *${videoData.title}*\n\n` +
                      `👤 ${videoData.channel}\n` +
                      `⏱️ ${videoData.duration}\n` +
                      `🔗 ${videoData.url}`;

      await sock.sendMessage(message.key.remoteJid, {
        text: infoText
      });
    }
  },

  async downloadAudio(videoId) {
    try {
      // Usar YT1S.com API (más confiable)
      const convertUrl = `https://yt1s.com/api/ajaxSearch/index`;
      
      const convertResponse = await axios.post(convertUrl, 
        `q=https://www.youtube.com/watch?v=${videoId}&vt=mp3`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 15000
        }
      );

      if (convertResponse.data && convertResponse.data.links && convertResponse.data.links.mp3) {
        const mp3Links = convertResponse.data.links.mp3;
        const bestQuality = mp3Links['128'] || mp3Links['320'] || Object.values(mp3Links)[0];
        
        if (bestQuality && bestQuality.k) {
          // Obtener link de descarga
          const downloadUrl = `https://yt1s.com/api/ajaxConvert/convert`;
          const downloadResponse = await axios.post(downloadUrl,
            `vid=${videoId}&k=${bestQuality.k}`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              timeout: 30000
            }
          );

          if (downloadResponse.data && downloadResponse.data.dlink) {
            const audioResponse = await axios.get(downloadResponse.data.dlink, {
              responseType: 'arraybuffer',
              timeout: 60000,
              maxContentLength: 50 * 1024 * 1024
            });

            return Buffer.from(audioResponse.data);
          }
        }
      }

      return null;

    } catch (error) {
      logger.error('Error descargando:', error.message);
      return null;
    }
  },

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

