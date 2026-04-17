// commands/sticker.js - Crear stickers SIMPLE Y FUNCIONAL
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const logger = require('../utils/logger');

module.exports = {
  name: 'sticker',
  description: '🎨 Convierte imagen en sticker',
  category: 'multimedia',
  
  async execute(sock, message) {
    try {
      // Obtener el mensaje citado o el mensaje actual
      const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const currentMessage = message.message;
      
      // Verificar si hay una imagen
      const imageMessage = quotedMessage?.imageMessage || currentMessage?.imageMessage;

      if (!imageMessage) {
        return await sock.sendMessage(message.key.remoteJid, { 
          text: '❌ *Cómo usar:*\n\n' +
                '1️⃣ Envía una imagen\n' +
                '2️⃣ Responde a la imagen con: !sticker\n\n' +
                '💡 La imagen debe ser JPG o PNG'
        });
      }

      // Mensaje de espera
      await sock.sendMessage(message.key.remoteJid, { 
        text: '🎨 Creando sticker... ⏳' 
      });

      // Descargar la imagen
      let buffer;
      if (quotedMessage) {
        // Si es un mensaje citado
        const msg = {
          message: quotedMessage,
          key: message.message.extendedTextMessage.contextInfo.stanzaId 
            ? { 
                remoteJid: message.key.remoteJid,
                id: message.message.extendedTextMessage.contextInfo.stanzaId 
              } 
            : message.key
        };
        buffer = await downloadMediaMessage(msg, 'buffer', {}, { 
          logger: require('pino')({ level: 'silent' }),
          reuploadRequest: sock.updateMediaMessage
        });
      } else {
        // Si es la imagen del mensaje actual
        buffer = await downloadMediaMessage(message, 'buffer', {}, { 
          logger: require('pino')({ level: 'silent' }),
          reuploadRequest: sock.updateMediaMessage
        });
      }

      // Enviar como sticker SIN procesar
      await sock.sendMessage(message.key.remoteJid, {
        sticker: buffer
      });

      logger.success('Sticker enviado correctamente');
      
    } catch (error) {
      logger.error('Error al crear sticker:', error.message);
      
      await sock.sendMessage(message.key.remoteJid, { 
        text: '❌ Error al crear el sticker.\n\n' +
              '*Posibles causas:*\n' +
              '• La imagen es muy grande (prueba con una más pequeña)\n' +
              '• Formato no soportado (usa JPG o PNG)\n' +
              '• El archivo está dañado\n\n' +
              '💡 Intenta con otra imagen'
      });
    }
  }
};

