// commands/tts.js - Comando para convertir texto a voz (Google Translate)
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

      // Usar Google Translate TTS API
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(text)}`;
      
      // Descargar el audio
      const response = await axios.get(url, { 
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const audioBuffer = Buffer.from(response.data);

      // Enviar el audio
      await sock.sendMessage(message.key.remoteJid, {
        audio: audioBuffer,
        mimetype: 'audio/mp4',
        ptt: true  // Enviar como nota de voz
      });

      logger.success('Audio TTS enviado correctamente');
      
    } catch (error) {
      logger.error('Error al generar TTS', error);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ No pude generar el audio. Intenta de nuevo más tarde.' 
      });
    }
  }
};
