// commands/8ball.js - Bola mágica 8
const logger = require('../utils/logger');

module.exports = {
  name: '8ball',
  aliases: ['bola8', 'magic8'],
  description: '🔮 Bola mágica 8 - responde tus preguntas',
  category: 'juegos',
  
  async execute(sock, message, args) {
    try {
      if (args.length === 0) {
        return await sock.sendMessage(message.key.remoteJid, {
          text: '❌ *Uso correcto:*\n\n!8ball <tu pregunta>\n\n*Ejemplo:*\n!8ball ¿Tendré suerte hoy?'
        });
      }

      const respuestas = [
        '✅ Sí, definitivamente',
        '✅ Es cierto',
        '✅ Sin duda',
        '✅ Sí',
        '✅ Puedes confiar en ello',
        '⚠️ Como yo lo veo, sí',
        '⚠️ Probablemente',
        '⚠️ Las perspectivas son buenas',
        '⚠️ Los signos apuntan que sí',
        '⚠️ Respuesta difusa, intenta de nuevo',
        '⚠️ Pregunta de nuevo más tarde',
        '⚠️ Mejor no decirte ahora',
        '⚠️ No puedo predecir ahora',
        '⚠️ Concéntrate y pregunta de nuevo',
        '❌ No cuentes con ello',
        '❌ Mi respuesta es no',
        '❌ Mis fuentes dicen que no',
        '❌ Las perspectivas no son buenas',
        '❌ Muy dudoso'
      ];

      const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
      const pregunta = args.join(' ');

      await sock.sendMessage(message.key.remoteJid, {
        text: `🔮 *Bola Mágica 8*\n\n` +
              `❓ Pregunta: ${pregunta}\n\n` +
              `💭 Respuesta: ${respuesta}`
      }, {
        quoted: message
      });

      logger.success('Comando 8ball ejecutado');

    } catch (error) {
      logger.error('Error en comando 8ball:', error.message);
    }
  }
};
