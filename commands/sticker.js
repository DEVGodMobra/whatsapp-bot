// commands/sticker.js - Comando para crear stickers (versión corregida)
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const logger = require('../utils/logger');

module.exports = {
  name: 'sticker',
  description: 'Convierte una imagen en sticker',
  
  async execute(sock, message) {
    try {
      // Verificar si el mensaje tiene una imagen
      const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imageMsg = message.message?.imageMessage || quotedMsg?.imageMessage;

      if (!imageMsg) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ Por favor responde a una *imagen* con !sticker\n\n' +
                '💡 Envía una imagen y luego responde a ella con !sticker'
        });
      }

      // Enviar mensaje de espera
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🎨 Creando sticker... ⏳' 
      });

      // Descargar la imagen
      const buffer = await downloadMediaMessage(
        message.message?.extendedTextMessage ? 
          { message: quotedMsg } : message,
        'buffer',
        {},
        { 
          logger: require('pino')({ level: 'silent' }),
          reuploadRequest: sock.updateMediaMessage
        }
      );

      // Enviar el sticker con metadata correcta
      await sock.sendMessage(message.key.remoteJid, {
        sticker: buffer,
        mimetype: 'image/webp'
      }, {
        quoted: message
      });

      logger.success('Sticker creado y enviado correctamente');
      
    } catch (error) {
      logger.error('Error al crear el sticker:', error.message);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ No pude crear el sticker.\n\n' +
              'Posibles causas:\n' +
              '• La imagen es muy grande (máx 1MB)\n' +
              '• Formato no soportado (usa JPG o PNG)\n' +
              '• Error temporal del servidor\n\n' +
              '💡 Intenta con una imagen más pequeña.'
      });
    }
  }
};
