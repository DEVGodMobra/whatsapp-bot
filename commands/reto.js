// commands/reto.js - Comando para retos aleatorios
const config = require('../config');
const helpers = require('../utils/helpers');

module.exports = {
  name: 'reto',
  description: 'Genera un reto aleatorio',
  
  async execute(sock, message) {
    // Obtener un reto aleatorio
    const reto = helpers.randomChoice(config.retos);
    
    const responseText = `
🎯 *RETO*

${reto}

¡Atrévete a cumplirlo! 💪
    `.trim();

    await sock.sendMessage(message.key.remoteJid, { 
      text: responseText 
    });
  }
};
