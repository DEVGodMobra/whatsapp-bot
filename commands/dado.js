// commands/dado.js - Comando para lanzar un dado
const helpers = require('../utils/helpers');

module.exports = {
  name: 'dado',
  description: 'Lanza un dado virtual (1-6)',
  
  async execute(sock, message) {
    // Generar número aleatorio del 1 al 6
    const resultado = helpers.random(1, 6);
    
    // Emojis de dados
    const dadoEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    
    const responseText = `
🎲 *LANZAMIENTO DE DADO*

${dadoEmojis[resultado - 1]} Resultado: *${resultado}*
    `.trim();

    await sock.sendMessage(message.key.remoteJid, { 
      text: responseText 
    });
  }
};
