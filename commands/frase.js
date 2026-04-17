// commands/frase.js - Comando para enviar frases motivacionales
const config = require('../config');
const helpers = require('../utils/helpers');

module.exports = {
  name: 'frase',
  description: 'Envía una frase motivacional aleatoria',
  
  async execute(sock, message) {
    // Obtener una frase aleatoria de la configuración
    const frase = helpers.randomChoice(config.frases);
    
    const responseText = `
💭 *FRASE DEL DÍA*

"${frase}"

✨ ¡Que tengas un excelente día!
    `.trim();

    await sock.sendMessage(message.key.remoteJid, { 
      text: responseText 
    });
  }
};
