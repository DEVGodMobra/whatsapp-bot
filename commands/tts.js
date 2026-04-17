// commands/tts.js - Texto a voz SIMPLIFICADO Y FUNCIONAL
const axios = require('axios');
const logger = require('../utils/logger');

module.exports = {
  name: 'tts',
  description: '🎤 Convierte texto a voz',
  category: 'multimedia',
  
  async execute(sock, message, args) {
    try {
      // Verificar texto
      if (args.length === 0) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ *Cómo usar:*\n\n!tts <tu texto>\n\n*Ejemplo:*\n!tts Hola amigos del grupo' 
        });
      }

      const text = args.join(' ');

      // Limitar longitud
      if (text.length > 200) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ Texto demasiado largo (máximo 200 caracteres)' 
        });
      }

      // Mensaje de espera
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🎤 Generando audio... ⏳' 
      });

      try {
        // Intentar con Google Translate TTS (método simple)
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(text)}`;
        
        const response = await axios.get(url, { 
          responseType: 'arraybuffer',
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });

        const audioBuffer = Buffer.from(response.data);

        // Verificar que se descargó algo
        if (audioBuffer.length < 100) {
          throw new Error('Audio muy pequeño');
        }

        // Enviar como nota de voz
        await sock.sendMessage(message.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          ptt: true
        });

        logger.success('TTS enviado correctamente');
        
      } catch (apiError) {
        // Si Google falla, usar API alternativa simple
        logger.warn('Google TTS falló, usando alternativa');
        
        const altUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Conchita&text=${encodeURIComponent(text)}`;
        
        const altResponse = await axios.get(altUrl, { 
          responseType: 'arraybuffer',
          timeout: 15000
        });

        const audioBuffer = Buffer.from(altResponse.data);

        await sock.sendMessage(message.key.remoteJid, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          ptt: true
        });

        logger.success('TTS enviado con API alternativa');
      }
      
    } catch (error) {
      logger.error('Error en TTS:', error.message);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ No pude generar el audio.\n\n' +
              '*Intenta:*\n' +
              '• Texto más corto\n' +
              '• Sin caracteres especiales\n' +
              '• Esperar unos segundos y reintentar'
      });
    }
  }
};

