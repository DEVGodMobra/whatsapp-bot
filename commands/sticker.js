// commands/sticker.js - Comando para crear stickers (versión simplificada)
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
                '💡 Tip: El comando funciona con imágenes solamente.\n' +
                '(Los videos requieren procesamiento adicional que está en desarrollo)'
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

      // Enviar el sticker directamente
      await sock.sendMessage(message.key.remoteJid, {
        sticker: buffer
      });

      logger.success('Sticker creado y enviado correctamente');
      
    } catch (error) {
      logger.error('Error al crear el sticker:', error.message);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ No pude crear el sticker.\n\n' +
              'Posibles causas:\n' +
              '• La imagen es muy grande\n' +
              '• Formato de imagen no soportado\n' +
              '• Error del servidor\n\n' +
              '💡 Intenta con una imagen más pequeña o en formato JPG/PNG.'
      });
    }
  }
};
