// commands/menu.js - Menú completo con TODOS los comandos
const config = require('../config');

module.exports = {
  name: 'menu',
  aliases: ['help', 'comandos'],
  description: '📱 Muestra todos los comandos disponibles',
  
  async execute(sock, message, args) {
    // Si hay argumento numérico, mostrar página específica
    const pageNum = parseInt(args[0]);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 8) {
      return await this.sendPage(sock, message, pageNum);
    }

    // Menú principal
    const menuText = `
╔════════════════════════╗
║   ${config.botName}   ║
╚════════════════════════╝

📱 *MENÚ COMPLETO DE COMANDOS*

🎯 *NAVEGACIÓN:*
• !menu - Este menú
• !menu 1 - Juegos y diversión
• !menu 2 - Multimedia y descargas
• !menu 3 - Utilidades
• !menu 4 - Grupos (próximamente)
• !menu 5 - Economía (próximamente)

┌─────────────────────┐
│  📑 ÍNDICE DE CATEGORÍAS
└─────────────────────┘

*1️⃣ JUEGOS Y DIVERSIÓN* (!menu 1)
   🎮 Dados, monedas, bola 8, memes
   🎲 Verdad o reto, frases

*2️⃣ MULTIMEDIA Y DESCARGAS* (!menu 2)
   🎵 Música con información completa
   🎨 Stickers de imágenes
   🎤 Texto a voz

*3️⃣ UTILIDADES* (!menu 3)
   🛠️ Herramientas útiles
   ℹ️ Información del bot

*4️⃣ GRUPOS* (!menu 4)
   👥 Administración
   🔒 Moderación
   _Próximamente_

*5️⃣ ECONOMÍA Y RPG* (!menu 5)
   💰 Sistema de monedas
   🏪 Tienda virtual
   _Próximamente_

┌─────────────────────┐
│  🚀 COMANDOS RÁPIDOS
└─────────────────────┘

• !music despacito - Buscar música
• !sticker - Crear sticker
• !dado - Lanzar dado
• !meme - Meme aleatorio

╭──────────────────╮
│ Bot Premium v2.0 🔥
│ Todos los comandos
│ disponibles aquí
╰──────────────────╯
    `.trim();

    await sock.sendMessage(message.key.remoteJid, { 
      text: menuText 
    });
  },

  async sendPage(sock, message, page) {
    const pages = {
      1: this.getPage1(),
      2: this.getPage2(),
      3: this.getPage3(),
      4: this.getPage4(),
      5: this.getPage5()
    };

    const pageText = pages[page] || '❌ Página no encontrada';

    await sock.sendMessage(message.key.remoteJid, { 
      text: pageText 
    });
  },

  getPage1() {
    return `
╔═══════════════════════╗
║  🎮 JUEGOS (Página 1/5)
╚═══════════════════════╝

┌─ COMANDOS DISPONIBLES ─┐

*JUEGOS DE AZAR*
• !dado
  Lanza un dado (1-6)

• !moneda
  Lanza una moneda (cara/cruz)

• !8ball <pregunta>
  Bola mágica 8
  Ejemplo: !8ball ¿Tendré suerte?

*DIVERSIÓN*
• !meme
  Envía un meme aleatorio de Reddit

• !frase
  Frase motivacional aleatoria

• !verdad
  Pregunta de verdad para el grupo

• !reto
  Reto divertido para alguien

└─────────────────────────┘

💡 Ver más: !menu 2
🏠 Volver: !menu
    `.trim();
  },

  getPage2() {
    return `
╔════════════════════════════╗
║  🎵 MULTIMEDIA (Página 2/5)
╚════════════════════════════╝

┌─ COMANDOS DISPONIBLES ─┐

*MÚSICA Y AUDIO*
• !music <canción>
  Busca música en YouTube
  • Muestra thumbnail
  • Info: título, canal, duración, vistas
  • Enlace directo
  • Descarga audio MP3
  
  Ejemplos:
  !music despacito
  !music bad bunny chambea
  !music the weeknd

• !tts <texto>
  Convierte texto a voz
  • Genera audio con tu texto
  • Máximo 200 caracteres
  
  Ejemplo:
  !tts Hola amigos del grupo

*STICKERS*
• !sticker
  Convierte imagen en sticker
  
  Cómo usar:
  1. Envía una imagen
  2. Responde con: !sticker
  
  Formatos: JPG, PNG
  Tamaño: Máx 1MB

└─────────────────────────┘

💡 Ver más: !menu 3
🏠 Volver: !menu
    `.trim();
  },

  getPage3() {
    return `
╔═══════════════════════════╗
║  🛠️ UTILIDADES (Página 3/5)
╚═══════════════════════════╝

┌─ COMANDOS DISPONIBLES ─┐

*INFORMACIÓN*
• !menu
  Muestra este menú completo

• !menu <número>
  Ver página específica
  Ejemplo: !menu 1

└─────────────────────────┘

*PRÓXIMAMENTE:*
• !translate <texto>
  Traducir texto

• !clima <ciudad>
  Ver clima actual

• !calc <operación>
  Calculadora

• !google <búsqueda>
  Buscar en Google

└─────────────────────────┘

💡 Ver más: !menu 4
🏠 Volver: !menu
    `.trim();
  },

  getPage4() {
    return `
╔══════════════════════════╗
║  👥 GRUPOS (Página 4/5)
╚══════════════════════════╝

⚠️ *PRÓXIMAMENTE*

Comandos planeados:

*ADMINISTRACIÓN*
• !add <número>
  Agregar miembro (admin)

• !kick <@usuario>
  Expulsar miembro (admin)

• !promote <@usuario>
  Dar admin (admin)

• !demote <@usuario>
  Quitar admin (admin)

*MODERACIÓN*
• !welcome <on/off>
  Activar bienvenidas

• !antilink <on/off>
  Activar anti-enlaces

• !tagall
  Mencionar a todos

*CONFIGURACIÓN*
• !group <abrir/cerrar>
  Abrir/cerrar grupo

└─────────────────────────┘

📢 Estos comandos están en
   desarrollo y estarán
   disponibles pronto.

💡 Ver más: !menu 5
🏠 Volver: !menu
    `.trim();
  },

  getPage5() {
    return `
╔═══════════════════════════╗
║  💰 ECONOMÍA (Página 5/5)
╚═══════════════════════════╝

⚠️ *PRÓXIMAMENTE*

Sistema de economía virtual:

*DINERO*
• !balance / !bal
  Ver tu dinero

• !daily
  Recompensa diaria

• !work / !trabajar
  Trabajar y ganar dinero

• !rob <@usuario>
  Intentar robar

*TIENDA*
• !shop / !tienda
  Ver la tienda

• !buy <item>
  Comprar items

• !sell <item>
  Vender items

• !inventory / !inv
  Ver tu inventario

*ACTIVIDADES*
• !fish / !pescar
  Ir a pescar

• !mine / !minar
  Minar recursos

└─────────────────────────┘

📢 Sistema en desarrollo.
   Incluirá base de datos
   para guardar progreso.

🏠 Volver: !menu
    `.trim();
  }
};

