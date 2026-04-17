// index.js - Archivo principal del bot de WhatsApp
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  makeInMemoryStore,
  Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Importar configuración y utilidades
const config = require('./config');
const logger = require('./utils/logger');
const helpers = require('./utils/helpers');

// Cargar todos los comandos dinámicamente
const commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.set(command.name, command);
  logger.info(`Comando cargado: ${command.name}`);
}

// Función principal para iniciar el bot
async function startBot() {
  // Configurar autenticación multi-archivo
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

  // Crear instancia del socket
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS('Desktop'),
    auth: state,
    defaultQueryTimeoutMs: undefined
  });

  // Guardar credenciales cuando cambien
  sock.ev.on('creds.update', saveCreds);

  // Manejar actualizaciones de conexión
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Mostrar código QR
    if (qr) {
      console.log('\n');
      logger.info('Escanea el código QR con WhatsApp:');
      console.log('\n');
      qrcode.generate(qr, { small: true });
      console.log('\n');
    }

    // Manejar conexión
    if (connection === 'close') {
      const shouldReconnect = 
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      
      logger.warn('Conexión cerrada. Razón: ' + lastDisconnect?.error);
      
      if (shouldReconnect) {
        logger.info('Reconectando...');
        setTimeout(() => startBot(), 5000);
      } else {
        logger.error('Bot desconectado. Por favor, escanea el código QR nuevamente.');
      }
    } else if (connection === 'open') {
      logger.success('✓ Bot conectado exitosamente!');
      console.log('\n');
      logger.info(`Bot: ${config.botName}`);
      logger.info(`Prefijo de comandos: ${config.prefix}`);
      logger.info(`Total de comandos: ${commands.size}`);
      console.log('\n');
      logger.success('El bot está listo para recibir mensajes! 🚀');
      console.log('\n');
    }
  });

  // Manejar mensajes entrantes
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    
    // Ignorar mensajes del bot mismo
    if (m.key.fromMe) return;
    
    // Ignorar mensajes sin contenido
    if (!m.message) return;

    try {
      // Obtener información del mensaje
      const messageType = Object.keys(m.message)[0];
      const isGroup = helpers.isGroup(m);
      const sender = helpers.getSender(m);
      const senderName = helpers.getSenderName(m);
      const chatId = m.key.remoteJid;

      // Log del mensaje
      logger.message(senderName, isGroup);

      // Obtener el texto del mensaje
      let text = '';
      
      if (m.message.conversation) {
        text = m.message.conversation;
      } else if (m.message.extendedTextMessage) {
        text = m.message.extendedTextMessage.text;
      } else if (m.message.imageMessage && m.message.imageMessage.caption) {
        text = m.message.imageMessage.caption;
      } else if (m.message.videoMessage && m.message.videoMessage.caption) {
        text = m.message.videoMessage.caption;
      }

      // Convertir a minúsculas para comparaciones
      const lowerText = text.toLowerCase().trim();

      // Respuestas automáticas
      for (const [trigger, response] of Object.entries(config.autoResponses)) {
        if (lowerText.includes(trigger)) {
          await sock.sendMessage(chatId, { text: response });
          return;
        }
      }

      // Procesar comandos
      if (text.startsWith(config.prefix)) {
        const parsed = helpers.parseCommand(text, config.prefix);
        
        if (!parsed) return;

        const { command, args } = parsed;

        // Log del comando
        logger.command(`${config.prefix}${command}`, senderName);

        // Ejecutar comando si existe
        if (commands.has(command)) {
          try {
            await commands.get(command).execute(sock, m, args);
          } catch (error) {
            logger.error(`Error ejecutando comando ${command}`, error);
            
            await sock.sendMessage(chatId, { 
              text: '❌ Hubo un error al ejecutar este comando. Intenta de nuevo más tarde.' 
            });
          }
        } else {
          // Comando no encontrado
          await sock.sendMessage(chatId, { 
            text: `❌ Comando *${config.prefix}${command}* no encontrado.\n\nEscribe *${config.prefix}menu* para ver los comandos disponibles.` 
          });
        }
      }
      
    } catch (error) {
      logger.error('Error procesando mensaje', error);
    }
  });

  return sock;
}

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  logger.error('Error no capturado', err);
});

process.on('unhandledRejection', (err) => {
  logger.error('Promesa rechazada no manejada', err);
});

// Iniciar el bot
console.clear();
console.log('\n');
logger.info('═══════════════════════════════════════════════');
logger.info(`  ${config.botName}`);
logger.info('  Bot de WhatsApp con Baileys');
logger.info('═══════════════════════════════════════════════');
console.log('\n');

startBot().catch((err) => {
  logger.error('Error fatal al iniciar el bot', err);
  process.exit(1);
});
