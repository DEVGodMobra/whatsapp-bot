// commands/moneda.js - Lanzar moneda
const logger = require('../utils/logger');

module.exports = {
  name: 'moneda',
  aliases: ['coin', 'flip'],
  description: '🪙 Lanza una moneda (cara o cruz)',
  category: 'juegos',
  
  async execute(sock, message) {
    try {
      const resultado = Math.random() < 0.5 ? 'CARA' : 'CRUZ';
      const emoji = resultado === 'CARA' ? '🪙' : '💰';

      await sock.sendMessage(message.key.remoteJid, {
        text: `${emoji} *Lanzando moneda...*\n\n✨ Resultado: *${resultado}*`
      }, {
        quoted: message
      });

      logger.success('Comando moneda ejecutado');

    } catch (error) {
      logger.error('Error en comando moneda:', error.message);
    }
  }
};
