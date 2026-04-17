// commands/menu.js - Sistema de menú paginado PREMIUM
const config = require('../config');
const logger = require('../utils/logger');

module.exports = {
  name: 'menu',
  aliases: ['help', 'comandos', 'ayuda'],
  description: '📱 Muestra el menú de comandos organizado por categorías',
  
  async execute(sock, message, args) {
    try {
      // Si no hay argumentos, mostrar menú principal
      if (args.length === 0) {
        return await this.sendMainMenu(sock, message);
      }

      // Si hay argumento, mostrar página específica
      const pageNumber = parseInt(args[0]);
      
      if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 14) {
        return await sock.sendMessage(message.key.remoteJid, {
          text: '❌ Página no válida.\n\nUsa: !menu <1-14>\nEjemplo: !menu 1'
        });
      }

      await this.sendMenuPage(sock, message, pageNumber);

    } catch (error) {
      logger.error('Error en comando menu:', error.message);
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Error al mostrar el menú.'
      });
    }
  },

  // Menú principal con índice de categorías
  async sendMainMenu(sock, message) {
    const menuText = `
╔═══════════════════════╗
║   📱 *MENÚ PAGINADO* 🐼   ║
╚═══════════════════════╝

El menú está dividido en *14 páginas* organizadas por categorías.

🔹 *Para navegar:*
• \`!menu <número>\` - Ir a una página específica (1-14)
• \`!menu1\`, \`!menu2\`, etc. - Atajos directos

📋 *Total de páginas: 14*
🔥 *Total de comandos: 100+*

┌───────────────────────┐
│  📑 CATEGORÍAS DISPONIBLES
└───────────────────────┘

*1️⃣ JUEGOS Y DIVERSIÓN* (!menu 1)
   🎮 Juegos interactivos, dados, trivia

*2️⃣ RPG Y ECONOMÍA* (!menu 2)
   💰 Sistema de monedas, tienda, trabajo

*3️⃣ PERSONAJES Y COLECCIÓN* (!menu 3)
   🎭 Personajes, cartas, gacha

*4️⃣ PIZZERÍA* (!menu 4)
   🍕 Simulador de restaurante

*5️⃣ INVERSIONES* (!menu 5)
   📈 Sistema de inversión virtual

*6️⃣ DESCARGAS* (!menu 6)
   📥 Música, videos, imágenes, stickers

*7️⃣ MANEJO DE GRUPOS* (!menu 7)
   👥 Administración, bienvenidas, antilink

*8️⃣ UTILIDADES* (!menu 8)
   🛠️ Herramientas útiles, clima, traductor

*9️⃣ IDEAS Y OPINIONES* (!menu 9)
   💭 Encuestas, votaciones, sugerencias

*🔟 ANUNCIOS Y RECOMPENSAS* (!menu 10)
   📢 Sistema de anuncios y premios

*1️⃣1️⃣ DESCARGAS Y MEDIA* (!menu 11)
   🎬 Videos, audio, documentos

*1️⃣2️⃣ MANEJO DE GRUPOS 2* (!menu 12)
   👮 Comandos avanzados de moderación

*1️⃣3️⃣ SISTEMA* (!menu 13)
   ⚙️ Configuración, info del bot

*1️⃣4️⃣ VIP PREMIUM* (!menu 14)
   👑 Comandos exclusivos VIP

┌───────────────────────┐
│  💡 EJEMPLOS DE USO
└───────────────────────┘

• \`!menu 1\` - Ver juegos
• \`!menu 6\` - Ver descargas
• \`!menu 14\` - Ver comandos VIP

╭─────────────────────╮
│ *Bot Premium v2.0* 🚀
│ Desarrollado con ❤️
╰─────────────────────╯
`.trim();

    await sock.sendMessage(message.key.remoteJid, {
      text: menuText
    }, {
      quoted: message
    });
  },

  // Enviar página específica del menú
  async sendMenuPage(sock, message, page) {
    const pages = {
      1: this.getPage1(), // Juegos y Diversión
      2: this.getPage2(), // RPG y Economía
      3: this.getPage3(), // Personajes
      4: this.getPage4(), // Pizzería
      5: this.getPage5(), // Inversiones
      6: this.getPage6(), // Descargas
      7: this.getPage7(), // Manejo de Grupos
      8: this.getPage8(), // Utilidades
      9: this.getPage9(), // Ideas y Opiniones
      10: this.getPage10(), // Anuncios
      11: this.getPage11(), // Descargas y Media
      12: this.getPage12(), // Manejo de Grupos 2
      13: this.getPage13(), // Sistema
      14: this.getPage14()  // VIP Premium
    };

    const pageContent = pages[page];

    if (!pageContent) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Página no encontrada.'
      });
    }

    await sock.sendMessage(message.key.remoteJid, {
      text: pageContent
    }, {
      quoted: message
    });
  },

  // PÁGINA 1: Juegos y Diversión
  getPage1() {
    return `
╔═════════════════════════╗
║  🎮 *JUEGOS Y DIVERSIÓN* (1/14)
╚═════════════════════════╝

┌─ COMANDOS DISPONIBLES ─┐

📌 *!dado* 
   Lanza un dado (1-6)

📌 *!moneda*
   Lanza una moneda (cara/cruz)

📌 *!8ball <pregunta>*
   Bola mágica 8 - responde tus preguntas

📌 *!trivia*
   Preguntas de trivia aleatoria

📌 *!adivinanza*
   Juego de adivinanzas

📌 *!acertijo*
   Acertijos para resolver

📌 *!verdad*
   Pregunta de verdad aleatoria

📌 *!reto*
   Reto aleatorio para el grupo

📌 *!amor <@usuario1> <@usuario2>*
   Calculadora de amor

📌 *!gay <@usuario>*
   Medidor de gay (humor)

📌 *!meme*
   Envía un meme aleatorio

📌 *!chiste*
   Cuenta un chiste

📌 *!frase*
   Frase motivacional

📌 *!top <tema>*
   Top 5 de cualquier tema

📌 *!quien <pregunta>*
   ¿Quién del grupo...?

└─────────────────────────┘

💡 *Navega:* !menu <1-14>
⬅️ !menu - Volver al índice
➡️ !menu 2 - Siguiente página
    `.trim();
  },

  // PÁGINA 2: RPG y Economía
  getPage2() {
    return `
╔═════════════════════════╗
║  💰 *RPG Y ECONOMÍA* (2/14)
╚═════════════════════════╝

┌─ SISTEMA ECONÓMICO ─┐

📌 *!balance* / *!bal*
   Ver tu dinero y banco

📌 *!daily*
   Reclama tu recompensa diaria

📌 *!work* / *!trabajar*
   Trabaja y gana dinero

📌 *!rob <@usuario>*
   Intenta robar a otro usuario

📌 *!crime* / *!crimen*
   Comete un crimen (riesgo/recompensa)

📌 *!dep <cantidad>*
   Depositar dinero en el banco

📌 *!with <cantidad>*
   Retirar dinero del banco

📌 *!transfer <@usuario> <cantidad>*
   Transferir dinero

📌 *!buy <item>*
   Comprar items de la tienda

📌 *!sell <item>*
   Vender items

📌 *!inventory* / *!inv*
   Ver tu inventario

📌 *!tienda* / *!shop*
   Ver la tienda

📌 *!use <item>*
   Usar un item del inventario

📌 *!fish* / *!pescar*
   Ir a pescar

📌 *!mine* / *!minar*
   Minar recursos

└─────────────────────────┘

⬅️ !menu 1 - Anterior
➡️ !menu 3 - Siguiente
    `.trim();
  },

  // PÁGINA 3: Personajes y Colección
  getPage3() {
    return `
╔═════════════════════════╗
║  🎭 *PERSONAJES* (3/14)
╚═════════════════════════╝

┌─ COLECCIÓN ─┐

📌 *!personaje*
   Obtener personaje aleatorio

📌 *!carta*
   Obtener carta aleatoria

📌 *!waifus*
   Ver tu colección de waifus

📌 *!claim <código>*
   Reclamar personaje

📌 *!trade <@usuario> <carta>*
   Intercambiar cartas

📌 *!gacha*
   Sistema gacha para personajes

📌 *!collection*
   Ver toda tu colección

📌 *!rarity*
   Ver rareza de personajes

└─────────────────────────┘

⬅️ !menu 2 - Anterior
➡️ !menu 4 - Siguiente
    `.trim();
  },

  // PÁGINA 4: Pizzería
  getPage4() {
    return `
╔═════════════════════════╗
║  🍕 *PIZZERÍA* (4/14)
╚═════════════════════════╝

┌─ SIMULADOR ─┐

📌 *!pizza*
   Abrir tu pizzería

📌 *!cocinar <tipo>*
   Cocinar una pizza

📌 *!clientes*
   Ver clientes en espera

📌 *!servir*
   Servir a los clientes

📌 *!mejorar*
   Mejorar tu pizzería

📌 *!ingredientes*
   Comprar ingredientes

└─────────────────────────┘

⬅️ !menu 3 - Anterior
➡️ !menu 5 - Siguiente
    `.trim();
  },

  // PÁGINA 5: Inversiones
  getPage5() {
    return `
╔═════════════════════════╗
║  📈 *INVERSIONES* (5/14)
╚═════════════════════════╝

┌─ MERCADO VIRTUAL ─┐

📌 *!invest <cantidad>*
   Invertir dinero

📌 *!portfolio*
   Ver tus inversiones

📌 *!stocks*
   Ver mercado de acciones

📌 *!dividends*
   Reclamar dividendos

└─────────────────────────┘

⬅️ !menu 4 - Anterior
➡️ !menu 6 - Siguiente
    `.trim();
  },

  // PÁGINA 6: Descargas
  getPage6() {
    return `
╔═════════════════════════╗
║  📥 *DESCARGAS* (6/14)
╚═════════════════════════╝

┌─ MEDIA DOWNLOADER ─┐

📌 *!music <canción>* 🔥
   Descargar música de YouTube
   • Muestra thumbnail
   • Información completa
   • Descarga audio MP3

📌 *!ytmp3 <link>*
   YouTube a MP3

📌 *!ytmp4 <link>*
   YouTube a MP4

📌 *!tiktok <link>*
   Descargar video de TikTok

📌 *!instagram <link>*
   Descargar de Instagram

📌 *!facebook <link>*
   Descargar de Facebook

📌 *!twitter <link>*
   Descargar de Twitter/X

📌 *!pinterest <link>*
   Descargar de Pinterest

📌 *!spotify <link>*
   Info de Spotify

📌 *!play <canción>*
   Buscar y reproducir

└─────────────────────────┘

⬅️ !menu 5 - Anterior
➡️ !menu 7 - Siguiente
    `.trim();
  },

  // PÁGINA 7: Manejo de Grupos
  getPage7() {
    return `
╔═════════════════════════╗
║  👥 *GRUPOS* (7/14)
╚═════════════════════════╝

┌─ ADMINISTRACIÓN ─┐

📌 *!add <número>*
   Agregar miembro (admin)

📌 *!kick <@usuario>*
   Expulsar miembro (admin)

📌 *!promote <@usuario>*
   Dar admin (admin)

📌 *!demote <@usuario>*
   Quitar admin (admin)

📌 *!group <abrir/cerrar>*
   Abrir/cerrar grupo (admin)

📌 *!welcome <on/off>*
   Act/Desact bienvenidas

📌 *!setwelcome <mensaje>*
   Configurar mensaje de bienvenida

📌 *!antilink <on/off>*
   Activar antilink

📌 *!tagall <mensaje>*
   Mencionar a todos

📌 *!hidetag <mensaje>*
   Mensaje oculto a todos

📌 *!delete* / *!del*
   Eliminar mensaje (responder)

└─────────────────────────┘

⬅️ !menu 6 - Anterior
➡️ !menu 8 - Siguiente
    `.trim();
  },

  // PÁGINA 8: Utilidades
  getPage8() {
    return `
╔═════════════════════════╗
║  🛠️ *UTILIDADES* (8/14)
╚═════════════════════════╝

┌─ HERRAMIENTAS ─┐

📌 *!sticker*
   Crear sticker de imagen

📌 *!tts <texto>*
   Texto a voz

📌 *!translate <texto>*
   Traducir texto

📌 *!clima <ciudad>*
   Ver clima actual

📌 *!calc <operación>*
   Calculadora

📌 *!qr <texto>*
   Generar código QR

📌 *!fake <texto>*
   Generar mensaje fake

📌 *!google <búsqueda>*
   Buscar en Google

📌 *!wiki <término>*
   Buscar en Wikipedia

📌 *!lyrics <canción>*
   Letra de canción

└─────────────────────────┘

⬅️ !menu 7 - Anterior
➡️ !menu 9 - Siguiente
    `.trim();
  },

  // Páginas restantes (9-14)
  getPage9() {
    return `
╔═════════════════════════╗
║  💭 *IDEAS* (9/14)
╚═════════════════════════╝

📌 *!poll <pregunta>*
   Crear encuesta

📌 *!vote*
   Votar en encuesta

📌 *!suggest <idea>*
   Sugerir mejoras

⬅️ !menu 8 - Anterior
➡️ !menu 10 - Siguiente
    `.trim();
  },

  getPage10() {
    return `
╔═════════════════════════╗
║  📢 *ANUNCIOS* (10/14)
╚═════════════════════════╝

📌 *!announce <mensaje>*
   Hacer anuncio

📌 *!reward*
   Reclamar recompensa

⬅️ !menu 9 - Anterior
➡️ !menu 11 - Siguiente
    `.trim();
  },

  getPage11() {
    return `
╔═════════════════════════╗
║  🎬 *MEDIA* (11/14)
╚═════════════════════════╝

📌 *!wallpaper <búsqueda>*
   Buscar fondos de pantalla

📌 *!logo <texto>*
   Crear logo

📌 *!photo*
   Foto aleatoria

⬅️ !menu 10 - Anterior
➡️ !menu 12 - Siguiente
    `.trim();
  },

  getPage12() {
    return `
╔═════════════════════════╗
║  👮 *MODERACIÓN* (12/14)
╚═════════════════════════╝

📌 *!warn <@usuario>*
   Advertir usuario

📌 *!unwarn <@usuario>*
   Quitar advertencia

📌 *!warns <@usuario>*
   Ver advertencias

⬅️ !menu 11 - Anterior
➡️ !menu 13 - Siguiente
    `.trim();
  },

  getPage13() {
    return `
╔═════════════════════════╗
║  ⚙️ *SISTEMA* (13/14)
╚═════════════════════════╝

📌 *!ping*
   Ver velocidad del bot

📌 *!info*
   Información del bot

📌 *!owner*
   Info del creador

📌 *!runtime*
   Tiempo activo

⬅️ !menu 12 - Anterior
➡️ !menu 14 - Siguiente
    `.trim();
  },

  getPage14() {
    return `
╔═════════════════════════╗
║  👑 *VIP PREMIUM* (14/14)
╚═════════════════════════╝

┌─ EXCLUSIVO VIP ─┐

📌 *!vip*
   Ver estado VIP

📌 *!musicpro <canción>*
   Descarga sin límites

📌 *!premium*
   Beneficios premium

💎 *Hazte VIP:*
   Contacta al administrador

└─────────────────────────┘

⬅️ !menu 13 - Anterior
🏠 !menu - Volver al inicio
    `.trim();
  }
};
