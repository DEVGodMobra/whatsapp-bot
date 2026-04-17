// commands/sticker.js - Comando para crear stickers
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const helpers = require('../utils/helpers');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = {
  name: 'sticker',
  description: 'Convierte una imagen o video en sticker',
  
  async execute(sock, message) {
    try {
      // Verificar si el mensaje tiene una imagen o video
      const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imageMsg = message.message?.imageMessage || quotedMsg?.imageMessage;
      const videoMsg = message.message?.videoMessage || quotedMsg?.videoMessage;

      if (!imageMsg && !videoMsg) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ Por favor responde a una imagen o video con !sticker' 
        });
      }

      // Enviar mensaje de espera
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🎨 Creando sticker... ⏳' 
      });

      // Descargar el archivo multimedia
      let buffer;
      if (imageMsg) {
        const stream = await sock.downloadMediaMessage(message.message?.extendedTextMessage ? 
          { message: quotedMsg } : message);
        buffer = stream;
      } else if (videoMsg) {
        const stream = await sock.downloadMediaMessage(message.message?.extendedTextMessage ? 
          { message: quotedMsg } : message);
        buffer = stream;
      }

      // Crear rutas temporales
      const tempInput = path.join(__dirname, '..', `temp_${Date.now()}.${imageMsg ? 'jpg' : 'mp4'}`);
      const tempOutput = path.join(__dirname, '..', `sticker_${Date.now()}.webp`);

      // Guardar archivo temporal
      fs.writeFileSync(tempInput, buffer);

      // Convertir a sticker usando ffmpeg
      await new Promise((resolve, reject) => {
        const command = ffmpeg(tempInput);
        
        if (videoMsg) {
          // Para videos: limitar a 10 segundos y optimizar
          command
            .setStartTime('00:00:00')
            .setDuration(10)
            .outputOptions([
              '-vcodec', 'libwebp',
              '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,format=rgba",
              '-loop', '0',
              '-preset', 'default',
              '-an',
              '-vsync', '0',
              '-s', '512:512'
            ]);
        } else {
          // Para imágenes
          command.outputOptions([
            '-vcodec', 'libwebp',
            '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,format=rgba,pad=320:320:-1:-1:color=white@0.0",
            '-loop', '0',
            '-preset', 'default',
            '-an',
            '-vsync', '0'
          ]);
        }

        command
          .toFormat('webp')
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .save(tempOutput);
      });

      // Leer el sticker generado
      const stickerBuffer = fs.readFileSync(tempOutput);

      // Enviar el sticker
      await sock.sendMessage(message.key.remoteJid, {
        sticker: stickerBuffer
      });

      // Limpiar archivos temporales
      fs.unlinkSync(tempInput);
      fs.unlinkSync(tempOutput);

      logger.success('Sticker creado y enviado correctamente');
      
    } catch (error) {
      logger.error('Error al crear el sticker', error);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ No pude crear el sticker. Asegúrate de que la imagen o video sea válido.' 
      });
    }
  }
};
