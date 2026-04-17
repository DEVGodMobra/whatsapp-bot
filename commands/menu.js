// commands/menu.js - Comando para mostrar el menú
const config = require('../config');

module.exports = {
  name: 'menu',
  description: 'Muestra todos los comandos disponibles',
  
  async execute(sock, message) {
    const menuText = `
╔═══════════════════════════╗
║   ${config.botName}   ║
╚═══════════════════════════╝

📋 *MENÚ DE COMANDOS*

*🎮 DIVERSIÓN*
• !meme - Envía un meme aleatorio
• !dado - Lanza un dado (1-6)
• !frase - Frase motivacional
• !verdad - Pregunta de verdad
• !reto - Reto divertido

*🎵 MULTIMEDIA*
• !sticker - Convierte imagen/video en sticker
  _Responde a una imagen o video_
• !musica [nombre] - Descarga música de YouTube
  _Ejemplo: !musica despacito_
• !tts [texto] - Convierte texto a voz
  _Ejemplo: !tts hola amigos_

*ℹ️ INFORMACIÓN*
• !menu - Muestra este menú

╔═══════════════════════════╗
║  Creado con ❤️ para el grupo  ║
╚═══════════════════════════╝
    `.trim();

    await sock.sendMessage(message.key.remoteJid, { 
      text: menuText 
    });
  }
};
