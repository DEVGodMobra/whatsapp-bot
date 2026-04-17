// commands/verdad.js - Comando para preguntas de verdad
const config = require('../config');
const helpers = require('../utils/helpers');

module.exports = {
  name: 'verdad',
  description: 'Genera una pregunta de verdad aleatoria',
  
  async execute(sock, message) {
    // Obtener una pregunta aleatoria
    const pregunta = helpers.randomChoice(config.verdades);
    
    const responseText = `
❓ *VERDAD*

${pregunta}

¡Responde con sinceridad! 😏
    `.trim();

    await sock.sendMessage(message.key.remoteJid, { 
      text: responseText 
    });
  }
};
