// utils/helpers.js - Funciones auxiliares
const fs = require('fs');
const path = require('path');

const helpers = {
  /**
   * Verifica si un mensaje viene de un grupo
   */
  isGroup: (message) => {
    return message.key.remoteJid.endsWith('@g.us');
  },

  /**
   * Obtiene el número del remitente
   */
  getSender: (message) => {
    return message.key.participant || message.key.remoteJid;
  },

  /**
   * Obtiene el nombre del remitente
   */
  getSenderName: (message) => {
    return message.pushName || 'Usuario';
  },

  /**
   * Extrae el comando y argumentos de un mensaje
   */
  parseCommand: (text, prefix) => {
    if (!text.startsWith(prefix)) return null;
    
    const args = text.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    
    return { command, args };
  },

  /**
   * Descarga un archivo temporal
   */
  downloadMedia: async (message) => {
    try {
      const buffer = await message.download();
      return buffer;
    } catch (error) {
      throw new Error('No se pudo descargar el archivo multimedia');
    }
  },

  /**
   * Crea un sticker a partir de una imagen
   */
  createSticker: async (buffer, ffmpeg) => {
    return new Promise((resolve, reject) => {
      const tempInput = path.join(__dirname, '..', 'temp_input.jpg');
      const tempOutput = path.join(__dirname, '..', 'temp_output.webp');

      fs.writeFileSync(tempInput, buffer);

      ffmpeg(tempInput)
        .outputOptions([
          '-vcodec', 'libwebp',
          '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,format=rgba",
          '-loop', '0',
          '-preset', 'default',
          '-an',
          '-vsync', '0'
        ])
        .toFormat('webp')
        .on('end', () => {
          const stickerBuffer = fs.readFileSync(tempOutput);
          fs.unlinkSync(tempInput);
          fs.unlinkSync(tempOutput);
          resolve(stickerBuffer);
        })
        .on('error', (err) => {
          if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
          if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
          reject(err);
        })
        .save(tempOutput);
    });
  },

  /**
   * Espera un tiempo determinado (para delays)
   */
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Genera un número aleatorio
   */
  random: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Elige un elemento aleatorio de un array
   */
  randomChoice: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  }
};

module.exports = helpers;
