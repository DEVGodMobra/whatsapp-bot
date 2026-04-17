// commands/meme.js - Comando para enviar memes aleatorios
const axios = require('axios');
const logger = require('../utils/logger');

module.exports = {
  name: 'meme',
  description: 'Envía un meme aleatorio de Reddit',
  
  async execute(sock, message) {
    try {
      // Enviar mensaje de espera
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🎭 Buscando el mejor meme... ⏳' 
      });

      // Obtener meme de la API
      const response = await axios.get('https://meme-api.com/gimme');
      const memeData = response.data;

      // Verificar que la URL sea válida
      if (!memeData.url) {
        throw new Error('No se pudo obtener el meme');
      }

      // Descargar la imagen del meme
      const imageResponse = await axios.get(memeData.url, { 
        responseType: 'arraybuffer' 
      });
      
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');

      // Enviar el meme
      await sock.sendMessage(message.key.remoteJid, {
        image: imageBuffer,
        caption: `🎭 *${memeData.title}*\n\n👍 Upvotes: ${memeData.ups}\n📱 r/${memeData.subreddit}`
      });

      logger.success('Meme enviado correctamente');
      
    } catch (error) {
      logger.error('Error al obtener el meme', error);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ No pude obtener un meme en este momento. Intenta de nuevo más tarde.' 
      });
    }
  }
};
