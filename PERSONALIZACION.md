# 🎨 GUÍA DE PERSONALIZACIÓN AVANZADA

Esta guía te enseña a modificar y extender tu bot de WhatsApp.

---

## 📝 CREAR COMANDOS PERSONALIZADOS

### Ejemplo 1: Comando de Saludo Personalizado

Crea `commands/saludo.js`:

```javascript
// commands/saludo.js
const helpers = require('../utils/helpers');

module.exports = {
  name: 'saludo',
  description: 'Saluda a un usuario mencionado',
  
  async execute(sock, message, args) {
    const senderName = helpers.getSenderName(message);
    
    // Si hay menciones en el mensaje
    const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentions.length > 0) {
      await sock.sendMessage(message.key.remoteJid, {
        text: `👋 ¡Hola amigos! ${senderName} quiere saludar a todos.`,
        mentions: mentions
      });
    } else {
      await sock.sendMessage(message.key.remoteJid, {
        text: `👋 ¡Hola ${senderName}! ¿Cómo estás?`
      });
    }
  }
};
```

### Ejemplo 2: Comando con API Externa

Crea `commands/chiste.js`:

```javascript
// commands/chiste.js
const axios = require('axios');
const logger = require('../utils/logger');

module.exports = {
  name: 'chiste',
  description: 'Envía un chiste aleatorio',
  
  async execute(sock, message) {
    try {
      await sock.sendMessage(message.key.remoteJid, {
        text: '😄 Buscando un chiste... ⏳'
      });

      // API gratuita de chistes en español
      const response = await axios.get('https://api.chucknorris.io/jokes/random');
      const chiste = response.data.value;

      await sock.sendMessage(message.key.remoteJid, {
        text: `😂 *CHISTE*\n\n${chiste}`
      });

      logger.success('Chiste enviado');
    } catch (error) {
      logger.error('Error al obtener chiste', error);
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ No pude conseguir un chiste en este momento.'
      });
    }
  }
};
```

### Ejemplo 3: Comando con Argumentos

Crea `commands/calcular.js`:

```javascript
// commands/calcular.js
module.exports = {
  name: 'calcular',
  description: 'Realiza operaciones matemáticas simples',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Uso: !calcular [operación]\n\nEjemplo: !calcular 5 + 3'
      });
    }

    try {
      const operacion = args.join(' ');
      
      // Sanitizar entrada (solo números y operadores básicos)
      if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(operacion)) {
        throw new Error('Operación inválida');
      }

      const resultado = eval(operacion);

      await sock.sendMessage(message.key.remoteJid, {
        text: `🔢 *CALCULADORA*\n\n${operacion} = *${resultado}*`
      });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Operación inválida. Solo usa números y +, -, *, /'
      });
    }
  }
};
```

### Ejemplo 4: Comando Solo para Administradores

Crea `commands/limpiar.js`:

```javascript
// commands/limpiar.js
const logger = require('../utils/logger');

module.exports = {
  name: 'limpiar',
  description: 'Borra mensajes del bot (solo admins)',
  
  async execute(sock, message) {
    try {
      // Obtener metadata del grupo
      const groupMetadata = await sock.groupMetadata(message.key.remoteJid);
      const sender = message.key.participant || message.key.remoteJid;
      
      // Verificar si el usuario es admin
      const isAdmin = groupMetadata.participants.find(
        p => p.id === sender
      )?.admin;

      if (!isAdmin) {
        return await sock.sendMessage(message.key.remoteJid, {
          text: '❌ Este comando es solo para administradores.'
        });
      }

      await sock.sendMessage(message.key.remoteJid, {
        text: '🧹 Función de limpieza activada. (En desarrollo)'
      });

      logger.info('Comando de limpieza ejecutado por admin');
    } catch (error) {
      logger.error('Error en comando limpiar', error);
    }
  }
};
```

---

## 🎯 PERSONALIZAR RESPUESTAS AUTOMÁTICAS

### En `config.js`, agrega más respuestas:

```javascript
autoResponses: {
  'hola bot': '¡Hola! 👋 Escribe !menu para ver mis comandos',
  'buenos dias': '¡Buenos días! ☀️',
  'buenas tardes': '¡Buenas tardes! 🌅',
  'buenas noches': '¡Buenas noches! 🌙',
  'gracias': '¡De nada! 😊',
  'bot tonto': '😢 Eso no es muy amable...',
  'te amo bot': '❤️ ¡Yo también! (como amigos)',
  'quien eres': 'Soy un bot creado para ayudar en el grupo 🤖',
  'ayuda': 'Escribe !menu para ver todos mis comandos',
  'bot': '¿Sí? ¿Necesitas algo? Escribe !menu'
}
```

### Respuestas con Expresiones Regulares

Modifica `index.js` para agregar después de las respuestas automáticas:

```javascript
// Respuestas con regex
const regexResponses = [
  {
    pattern: /buenos?\s*(d[íi]as?|dias?)/i,
    response: '¡Buenos días! ☀️ ¿Cómo amaneciste?'
  },
  {
    pattern: /c[óo]mo\s+est[áa]s?/i,
    response: '¡Muy bien! Gracias por preguntar 😊'
  },
  {
    pattern: /qu[ée]\s+hora\s+es/i,
    response: () => `🕐 Son las ${new Date().toLocaleTimeString('es-CO')}`
  }
];

// Usar después del loop de autoResponses
for (const { pattern, response } of regexResponses) {
  if (pattern.test(lowerText)) {
    const msg = typeof response === 'function' ? response() : response;
    await sock.sendMessage(chatId, { text: msg });
    return;
  }
}
```

---

## 🎲 AGREGAR JUEGOS INTERACTIVOS

### Ejemplo: Adivina el Número

Crea `commands/adivinar.js`:

```javascript
// commands/adivinar.js
const helpers = require('../utils/helpers');

// Almacenar juegos activos (en memoria, se pierde al reiniciar)
const activeGames = new Map();

module.exports = {
  name: 'adivinar',
  description: 'Juego de adivinar el número (1-100)',
  
  async execute(sock, message, args) {
    const chatId = message.key.remoteJid;
    
    // Si no hay juego activo, iniciar uno
    if (!activeGames.has(chatId)) {
      const numero = helpers.random(1, 100);
      activeGames.set(chatId, {
        numero,
        intentos: 0,
        maxIntentos: 7
      });
      
      await sock.sendMessage(chatId, {
        text: `🎲 *ADIVINA EL NÚMERO*\n\nHe pensado un número entre 1 y 100.\n\nTienes 7 intentos.\n\nUsa: !adivinar [número]`
      });
      return;
    }
    
    // Si hay un juego activo
    const juego = activeGames.get(chatId);
    
    if (args.length === 0) {
      return await sock.sendMessage(chatId, {
        text: `🎲 Juego en curso.\n\nIntentos: ${juego.intentos}/${juego.maxIntentos}\n\nUsa: !adivinar [número]`
      });
    }
    
    const intento = parseInt(args[0]);
    
    if (isNaN(intento) || intento < 1 || intento > 100) {
      return await sock.sendMessage(chatId, {
        text: '❌ Por favor, ingresa un número válido entre 1 y 100.'
      });
    }
    
    juego.intentos++;
    
    if (intento === juego.numero) {
      activeGames.delete(chatId);
      await sock.sendMessage(chatId, {
        text: `🎉 *¡GANASTE!*\n\nAdivinaste el número *${juego.numero}* en ${juego.intentos} intentos.\n\n¡Felicidades! 🏆`
      });
    } else if (juego.intentos >= juego.maxIntentos) {
      activeGames.delete(chatId);
      await sock.sendMessage(chatId, {
        text: `😔 *GAME OVER*\n\nSe acabaron los intentos.\n\nEl número era: *${juego.numero}*\n\nIntenta de nuevo con !adivinar`
      });
    } else {
      const pista = intento < juego.numero ? '⬆️ MÁS ALTO' : '⬇️ MÁS BAJO';
      const restantes = juego.maxIntentos - juego.intentos;
      
      await sock.sendMessage(chatId, {
        text: `${pista}\n\nIntentos restantes: ${restantes}`
      });
    }
  }
};
```

---

## 🔔 NOTIFICACIONES Y RECORDATORIOS

### Ejemplo: Sistema de Recordatorios

Crea `commands/recordar.js`:

```javascript
// commands/recordar.js
const logger = require('../utils/logger');

module.exports = {
  name: 'recordar',
  description: 'Programa un recordatorio',
  
  async execute(sock, message, args) {
    if (args.length < 2) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Uso: !recordar [minutos] [mensaje]\n\nEjemplo: !recordar 10 Revisar la pizza'
      });
    }
    
    const minutos = parseInt(args[0]);
    
    if (isNaN(minutos) || minutos <= 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Por favor ingresa un número válido de minutos.'
      });
    }
    
    const mensaje = args.slice(1).join(' ');
    const chatId = message.key.remoteJid;
    
    await sock.sendMessage(chatId, {
      text: `⏰ Recordatorio programado para ${minutos} minuto(s).\n\n"${mensaje}"`
    });
    
    // Programar el recordatorio
    setTimeout(async () => {
      await sock.sendMessage(chatId, {
        text: `🔔 *RECORDATORIO*\n\n${mensaje}`
      });
      logger.info(`Recordatorio enviado: ${mensaje}`);
    }, minutos * 60 * 1000);
  }
};
```

---

## 🌐 INTEGRAR MÁS APIs

### APIs Útiles Gratuitas:

1. **Clima**: OpenWeatherMap
2. **Noticias**: NewsAPI
3. **Traducción**: LibreTranslate
4. **Imágenes**: Unsplash API
5. **GIFs**: Giphy API
6. **Datos COVID**: disease.sh
7. **Criptomonedas**: CoinGecko API

### Ejemplo: Comando de Clima

```javascript
// commands/clima.js
const axios = require('axios');

module.exports = {
  name: 'clima',
  description: 'Consulta el clima de una ciudad',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Uso: !clima [ciudad]\n\nEjemplo: !clima Bogotá'
      });
    }
    
    const ciudad = args.join(' ');
    const API_KEY = 'TU_API_KEY_AQUI'; // Obtén una en openweathermap.org
    
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
      );
      
      const data = response.data;
      
      const climaText = `
🌤️ *CLIMA EN ${data.name.toUpperCase()}*

🌡️ Temperatura: ${data.main.temp}°C
🌡️ Sensación térmica: ${data.main.feels_like}°C
💧 Humedad: ${data.main.humidity}%
☁️ Descripción: ${data.weather[0].description}
💨 Viento: ${data.wind.speed} m/s
      `.trim();
      
      await sock.sendMessage(message.key.remoteJid, {
        text: climaText
      });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ No pude obtener el clima. Verifica el nombre de la ciudad.'
      });
    }
  }
};
```

---

## 🎨 PERSONALIZAR EL MENÚ

### Modificar `commands/menu.js`:

```javascript
const config = require('../config');
const helpers = require('../utils/helpers');

module.exports = {
  name: 'menu',
  description: 'Muestra todos los comandos disponibles',
  
  async execute(sock, message) {
    const senderName = helpers.getSenderName(message);
    const hora = new Date().getHours();
    let saludo;
    
    if (hora < 12) saludo = 'Buenos días';
    else if (hora < 19) saludo = 'Buenas tardes';
    else saludo = 'Buenas noches';
    
    const menuText = `
╔═══════════════════════════════╗
║   ${config.botName}   ║
╚═══════════════════════════════╝

${saludo}, *${senderName}*! 👋

📋 *COMANDOS DISPONIBLES*

*🎮 DIVERSIÓN Y JUEGOS*
┣ !meme - Meme aleatorio de Reddit
┣ !dado - Lanza un dado (1-6)
┣ !frase - Frase motivacional
┣ !verdad - Pregunta de verdad
┣ !reto - Reto divertido
┗ !chiste - Chiste aleatorio

*🎵 MULTIMEDIA*
┣ !sticker - Imagen/video → sticker
┣ !musica [url] - Descarga de YouTube
┗ !tts [texto] - Texto a voz

*🛠️ UTILIDADES*
┣ !calcular [operación] - Calculadora
┣ !recordar [min] [msg] - Recordatorio
┗ !clima [ciudad] - Consultar clima

*ℹ️ INFO*
┗ !menu - Este menú

╔═══════════════════════════════╗
║  Creado con ❤️ para el grupo     ║
╚═══════════════════════════════╝

_Usa ${config.prefix} antes de cada comando_
    `.trim();

    await sock.sendMessage(message.key.remoteJid, { 
      text: menuText 
    });
  }
};
```

---

## 💾 GUARDAR DATOS PERSISTENTES

### Usando archivos JSON:

```javascript
// utils/database.js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data.json');

class Database {
  constructor() {
    this.data = this.load();
  }
  
  load() {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
    return {};
  }
  
  save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
  }
  
  get(key) {
    return this.data[key];
  }
  
  set(key, value) {
    this.data[key] = value;
    this.save();
  }
  
  delete(key) {
    delete this.data[key];
    this.save();
  }
}

module.exports = new Database();
```

### Usar en comandos:

```javascript
const db = require('../utils/database');

// Guardar
db.set('puntuacion_' + userId, 100);

// Leer
const puntos = db.get('puntuacion_' + userId) || 0;
```

---

## 🎉 ¡Disfruta Personalizando!

Estas son solo ideas. Puedes crear cualquier comando que imagines.

**Consejos:**
- Prueba en un grupo de prueba primero
- Agrega logs con `logger.info()` para debug
- Maneja errores con try/catch
- Documenta tus comandos

¡Diviértete creando! 🚀
