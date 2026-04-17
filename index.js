// index.js - Versión con QR mejorado como imagen
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  Browsers,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
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

// Función para generar QR como imagen
async function generateQRImage(qrData) {
  try {
    // Generar QR como Data URL (base64)
    const qrDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // También generar como texto en terminal
    const qrTerminal = await QRCode.toString(qrData, {
      type: 'terminal',
      small: true
    });
    
    return { qrDataURL, qrTerminal };
  } catch (error) {
    logger.error('Error generando QR:', error.message);
    return null;
  }
}

// Función principal para iniciar el bot
async function startBot() {
  // Configurar autenticación multi-archivo
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  
  // Obtener la versión más reciente de Baileys
  const { version } = await fetchLatestBaileysVersion();

  // Crear instancia del socket
  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    auth: state,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    generateHighQualityLinkPreview: true
  });

  // Guardar credenciales cuando cambien
  sock.ev.on('creds.update', saveCreds);

  // Manejar actualizaciones de conexión
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // IMPORTANTE: Mostrar código QR
    if (qr) {
      console.log('\n\n');
      logger.info('═══════════════════════════════════════════════════════════');
      logger.info('        🔥 CÓDIGO QR GENERADO - ESCANEA CON WHATSAPP 🔥');
      logger.info('═══════════════════════════════════════════════════════════');
      console.log('\n');
      
      // Generar QR mejorado
      const qrResult = await generateQRImage(qr);
      
      if (qrResult) {
        // Mostrar QR en terminal
        console.log(qrResult.qrTerminal);
        console.log('\n');
        
        // Mostrar Data URL del QR (puedes abrirlo en navegador)
        logger.info('📱 OPCIÓN 1: Escanea el código de arriba con WhatsApp');
        console.log('\n');
        logger.info('📱 OPCIÓN 2: Copia esta URL y ábrela en tu navegador:');
        console.log('\n');
        console.log(qrResult.qrDataURL);
        console.log('\n');
        logger.info('   Luego escanea la imagen que aparece en el navegador');
        console.log('\n');
      }
      
      logger.info('═══════════════════════════════════════════════════════════');
      logger.info('PASOS PARA VINCULAR:');
      logger.info('1. Abre WhatsApp en tu celular (+57 322 313 8326)');
      logger.info('2. Toca Menú (⋮) → Dispositivos vinculados');
      logger.info('3. Vincular un dispositivo');
      logger.info('4. Escanea el código QR');
      logger.info('═══════════════════════════════════════════════════════════');
      console.log('\n\n');
    }

    // Manejar estados de conexión
    if (connection === 'close') {
      const shouldReconnect = 
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      
      const errorMessage = lastDisconnect?.error?.message || 'Desconocido';
      logger.warn(`Conexión cerrada. Razón: ${errorMessage}`);
      
      if (shouldReconnect) {
        logger.info('Reconectando en 5 segundos...');
        setTimeout(() => startBot(), 5000);
      } else {
        logger.error('Sesión cerrada. Necesitas escanear el código QR nuevamente.');
      }
    } else if (connection === 'connecting') {
      logger.info('Conectando a WhatsApp...');
    } else if (connection === 'open') {
      console.log('\n\n');
      logger.success('═══════════════════════════════════════════════════════════');
      logger.success('   ✓✓✓ BOT CONECTADO EXITOSAMENTE ✓✓✓');
      logger.success('═══════════════════════════════════════════════════════════');
      console.log('\n');
      logger.info(`🤖 Bot: ${config.botName}`);
      logger.info(`👤 Propietario: ${config.owner}`);
      logger.info(`⚡ Prefijo: ${config.prefix}`);
      logger.info(`📦 Comandos: ${commands.size}`);
      console.log('\n');
      logger.success('🚀 El bot está listo para recibir mensajes!');
      logger.info('💬 Prueba enviando: !menu');
      console.log('\n');
      logger.success('═══════════════════════════════════════════════════════════');
      console.log('\n\n');
    }
  });

  // Manejar mensajes entrantes
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    
    if (m.key.fromMe) return;
    if (!m.message) return;

    try {
      const isGroup = helpers.isGroup(m);
      const senderName = helpers.getSenderName(m);
      const chatId = m.key.remoteJid;

      logger.message(senderName, isGroup);

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

        logger.command(`${config.prefix}${command}`, senderName);

        if (commands.has(command)) {
          try {
            await commands.get(command).execute(sock, m, args);
          } catch (error) {
            logger.error(`Error ejecutando comando ${command}:`, error.message);
            
            await sock.sendMessage(chatId, { 
              text: '❌ Hubo un error al ejecutar este comando. Intenta de nuevo más tarde.' 
            });
          }
        } else {
          await sock.sendMessage(chatId, { 
            text: `❌ Comando *${config.prefix}${command}* no encontrado.\n\nEscribe *${config.prefix}menu* para ver los comandos disponibles.` 
          });
        }
      }
      
    } catch (error) {
      logger.error('Error procesando mensaje:', error.message);
    }
  });

  return sock;
}

// Manejo de errores
process.on('uncaughtException', (err) => {
  logger.error('Error no capturado:', err.message);
});

process.on('unhandledRejection', (err) => {
  logger.error('Promesa rechazada:', err.message);
});

// Iniciar el bot
console.clear();
console.log('\n\n');
logger.info('═══════════════════════════════════════════════════════════');
logger.info(`  ${config.botName}`);
logger.info('  Bot de WhatsApp con Baileys');
logger.info('═══════════════════════════════════════════════════════════');
console.log('\n');

startBot().catch((err) => {
  logger.error('Error fatal al iniciar el bot:', err.message);
  process.exit(1);
});