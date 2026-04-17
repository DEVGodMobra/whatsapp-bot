// commands/tts.js - Comando para convertir texto a voz (API mejorada)
const axios = require('axios');
const logger = require('../utils/logger');

module.exports = {
  name: 'tts',
  description: 'Convierte texto a voz',
  
  async execute(sock, message, args) {
    try {
      // Verificar que se haya proporcionado texto
      if (args.length === 0) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ Por favor escribe el texto a convertir.\n\n*Ejemplo:* !tts Hola amigos del grupo' 
        });
      }

      const text = args.join(' ');

      // Limitar longitud del texto
      if (text.length > 200) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ El texto es demasiado largo (máximo 200 caracteres).' 
        });
      }

      // Enviar mensaje de espera
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🎤 Generando audio... ⏳' 
      });

      try {
        // Usar API de Google Translate TTS con mejor formato
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(text)}`;
        
        // Descargar el audio con configuración correcta
        const response = await axios.get(url, { 
          responseType: 'arraybuffer',
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://translate.google.com/'
          }
        });

        const audioBuffer = Buffer.from(response.data);

        // Verificar que el audio se descargó correctamente
        if (audioBuffer.length < 100) {
          throw new Error('Audio muy pequeño o corrupto');
        }

        // Enviar el audio como mensaje de voz
        await sock.sendMessage(message.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: true  // Enviar como nota de voz
        });

        logger.success('Audio TTS enviado correctamente');
        
      } catch (apiError) {
        // Si la API de Google falla, usar API alternativa
        logger.warn('Google TTS falló, intentando con API alternativa');
        
        // API alternativa: StreamElements
        const altUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`;
        
        const altResponse = await axios.get(altUrl, { 
          responseType: 'arraybuffer',
          timeout: 15000
        });

        const audioBuffer = Buffer.from(altResponse.data);

        await sock.sendMessage(message.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: true
        });

        logger.success('Audio TTS enviado con API alternativa');
      }
      
    } catch (error) {
      logger.error('Error al generar TTS:', error.message);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ No pude generar el audio.\n\n' +
              'Posibles causas:\n' +
              '• Servicio de voz temporalmente no disponible\n' +
              '• Texto con caracteres especiales no soportados\n\n' +
              '💡 Intenta de nuevo en unos segundos o con texto más simple.'
      });
    }
  }
};
