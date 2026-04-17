# 🎯 COMANDOS AVANZADOS - COPIA Y USA

Colección de comandos listos para copiar y pegar en tu bot.

---

## 📸 COMANDO: Imagen Aleatoria

**Archivo:** `commands/imagen.js`

```javascript
const axios = require('axios');
const logger = require('../utils/logger');

module.exports = {
  name: 'imagen',
  description: 'Envía una imagen aleatoria de Unsplash',
  
  async execute(sock, message, args) {
    try {
      const query = args.join(' ') || 'nature';
      
      await sock.sendMessage(message.key.remoteJid, {
        text: `🖼️ Buscando imagen de: ${query}...`
      });

      // API de Unsplash (gratuita, 50 requests/hora)
      const response = await axios.get(
        `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`,
        { responseType: 'arraybuffer' }
      );

      const imageBuffer = Buffer.from(response.data);

      await sock.sendMessage(message.key.remoteJid, {
        image: imageBuffer,
        caption: `🖼️ Imagen: ${query}\n\n_Powered by Unsplash_`
      });

      logger.success('Imagen enviada');
    } catch (error) {
      logger.error('Error al obtener imagen', error);
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ No pude obtener la imagen.'
      });
    }
  }
};
```

---

## 🌍 COMANDO: Traductor

**Archivo:** `commands/traducir.js`

```javascript
const axios = require('axios');

module.exports = {
  name: 'traducir',
  description: 'Traduce texto a otro idioma',
  
  async execute(sock, message, args) {
    if (args.length < 2) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Uso: !traducir [idioma] [texto]

*Ejemplos:*
!traducir en Hola amigos
!traducir es Hello friends
!traducir fr Buenos días

*Idiomas:* es, en, fr, de, it, pt, ru, ja, ko, zh`
      });
    }

    const idioma = args[0].toLowerCase();
    const texto = args.slice(1).join(' ');

    try {
      // Usar LibreTranslate API (gratuita, auto-hospedada)
      const response = await axios.post(
        'https://libretranslate.de/translate',
        {
          q: texto,
          source: 'auto',
          target: idioma,
          format: 'text'
        }
      );

      const traduccion = response.data.translatedText;

      await sock.sendMessage(message.key.remoteJid, {
        text: `🌍 *TRADUCCIÓN*\n\n📝 Original: ${texto}\n\n✅ Traducido: ${traduccion}`
      });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Error al traducir. Verifica el código de idioma.'
      });
    }
  }
};
```

---

## 🎮 COMANDO: Trivia

**Archivo:** `commands/trivia.js`

```javascript
const axios = require('axios');
const helpers = require('../utils/helpers');

// Almacenar trivias activas
const activeTrivias = new Map();

module.exports = {
  name: 'trivia',
  description: 'Juego de preguntas y respuestas',
  
  async execute(sock, message, args) {
    const chatId = message.key.remoteJid;

    try {
      // Obtener pregunta de Open Trivia DB
      const response = await axios.get(
        'https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986'
      );

      const data = response.data.results[0];
      const pregunta = decodeURIComponent(data.question);
      const correcta = decodeURIComponent(data.correct_answer);
      const incorrectas = data.incorrect_answers.map(a => decodeURIComponent(a));

      // Mezclar respuestas
      const todas = [correcta, ...incorrectas].sort(() => Math.random() - 0.5);
      const opciones = todas.map((r, i) => `${i + 1}. ${r}`).join('\n');

      const triviaText = `
🎯 *TRIVIA*

❓ ${pregunta}

${opciones}

_Responde con el número (1-4)_
_Tienes 30 segundos_
      `.trim();

      await sock.sendMessage(chatId, { text: triviaText });

      // Guardar respuesta correcta
      const numeroCorrect = todas.indexOf(correcta) + 1;
      activeTrivias.set(chatId, {
        correcta: numeroCorrect,
        respuesta: correcta,
        timestamp: Date.now()
      });

      // Eliminar después de 30 segundos
      setTimeout(() => {
        if (activeTrivias.has(chatId)) {
          sock.sendMessage(chatId, {
            text: `⏰ *TIEMPO AGOTADO*\n\nLa respuesta correcta era: ${correcta}`
          });
          activeTrivias.delete(chatId);
        }
      }, 30000);

    } catch (error) {
      await sock.sendMessage(chatId, {
        text: '❌ No pude obtener una pregunta. Intenta de nuevo.'
      });
    }
  }
};

// Agregar en index.js para manejar respuestas:
/*
if (activeTrivias.has(chatId) && !text.startsWith(config.prefix)) {
  const trivia = activeTrivias.get(chatId);
  const respuesta = parseInt(text);
  
  if (!isNaN(respuesta) && respuesta >= 1 && respuesta <= 4) {
    if (respuesta === trivia.correcta) {
      await sock.sendMessage(chatId, {
        text: '🎉 *¡CORRECTO!* ✅\n\n¡Bien hecho! 🏆'
      });
    } else {
      await sock.sendMessage(chatId, {
        text: `❌ *INCORRECTO*\n\nLa respuesta correcta era: ${trivia.respuesta}`
      });
    }
    activeTrivias.delete(chatId);
  }
}
*/
```

---

## 📊 COMANDO: Encuesta

**Archivo:** `commands/encuesta.js`

```javascript
const polls = new Map();

module.exports = {
  name: 'encuesta',
  description: 'Crea una encuesta en el grupo',
  
  async execute(sock, message, args) {
    if (args.length < 3) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Uso: !encuesta [pregunta] | [opción1] | [opción2] | ...

*Ejemplo:*
!encuesta ¿Qué pizza pedimos? | Pepperoni | Hawaiana | Vegetariana`
      });
    }

    const partes = args.join(' ').split('|').map(p => p.trim());
    const pregunta = partes[0];
    const opciones = partes.slice(1);

    if (opciones.length < 2) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Debes incluir al menos 2 opciones.'
      });
    }

    const chatId = message.key.remoteJid;
    const pollId = Date.now().toString();

    polls.set(pollId, {
      pregunta,
      opciones,
      votos: opciones.map(() => []),
      chatId
    });

    const opcionesText = opciones
      .map((op, i) => `${i + 1}. ${op} - 0 votos`)
      .join('\n');

    const encuestaText = `
📊 *ENCUESTA*

❓ ${pregunta}

${opcionesText}

_Para votar: !votar ${pollId} [número]_
_Ejemplo: !votar ${pollId} 1_
    `.trim();

    await sock.sendMessage(chatId, { text: encuestaText });
  }
};
```

**También necesitas:** `commands/votar.js`

```javascript
const helpers = require('../utils/helpers');

module.exports = {
  name: 'votar',
  description: 'Vota en una encuesta activa',
  
  async execute(sock, message, args, polls) {
    if (args.length !== 2) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Uso: !votar [id] [opción]\n\nEjemplo: !votar 123456 1'
      });
    }

    const pollId = args[0];
    const opcion = parseInt(args[1]) - 1;

    if (!polls.has(pollId)) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Encuesta no encontrada o expirada.'
      });
    }

    const poll = polls.get(pollId);
    const userId = helpers.getSender(message);

    // Verificar que la opción sea válida
    if (opcion < 0 || opcion >= poll.opciones.length) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Opción inválida.'
      });
    }

    // Remover voto anterior
    poll.votos.forEach(v => {
      const index = v.indexOf(userId);
      if (index > -1) v.splice(index, 1);
    });

    // Agregar nuevo voto
    poll.votos[opcion].push(userId);

    // Mostrar resultados
    const resultados = poll.opciones
      .map((op, i) => `${i + 1}. ${op} - ${poll.votos[i].length} votos`)
      .join('\n');

    await sock.sendMessage(message.key.remoteJid, {
      text: `📊 *RESULTADOS ACTUALIZADOS*\n\n${resultados}`
    });
  }
};
```

---

## 💰 COMANDO: Cripto Precio

**Archivo:** `commands/cripto.js`

```javascript
const axios = require('axios');

module.exports = {
  name: 'cripto',
  description: 'Consulta el precio de criptomonedas',
  
  async execute(sock, message, args) {
    const moneda = args[0]?.toLowerCase() || 'bitcoin';

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${moneda}&vs_currencies=usd,eur&include_24hr_change=true`
      );

      const data = response.data[moneda];

      if (!data) {
        return await sock.sendMessage(message.key.remoteJid, {
          text: `❌ Criptomoneda "${moneda}" no encontrada.

*Ejemplos:* bitcoin, ethereum, cardano, dogecoin`
        });
      }

      const cambio = data.usd_24h_change > 0 ? '📈' : '📉';
      const color = data.usd_24h_change > 0 ? '+' : '';

      const criptoText = `
💰 *${moneda.toUpperCase()}*

💵 USD: $${data.usd.toLocaleString()}
💶 EUR: €${data.eur.toLocaleString()}

${cambio} Cambio 24h: ${color}${data.usd_24h_change.toFixed(2)}%

_Datos de CoinGecko_
      `.trim();

      await sock.sendMessage(message.key.remoteJid, {
        text: criptoText
      });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Error al obtener datos. Intenta de nuevo.'
      });
    }
  }
};
```

---

## 🎲 COMANDO: 8Ball (Bola Mágica)

**Archivo:** `commands/8ball.js`

```javascript
const helpers = require('../utils/helpers');

const respuestas = [
  'Es seguro.',
  'Sin duda.',
  'Definitivamente sí.',
  'Puedes confiar en ello.',
  'Como yo lo veo, sí.',
  'Muy probablemente.',
  'Las perspectivas son buenas.',
  'Sí.',
  'Las señales apuntan a que sí.',
  'Respuesta confusa, intenta de nuevo.',
  'Pregunta de nuevo más tarde.',
  'Mejor no decirte ahora.',
  'No puedo predecirlo ahora.',
  'Concéntrate y pregunta de nuevo.',
  'No cuentes con ello.',
  'Mi respuesta es no.',
  'Mis fuentes dicen que no.',
  'Las perspectivas no son buenas.',
  'Muy dudoso.'
];

module.exports = {
  name: '8ball',
  description: 'Pregúntale a la bola mágica',
  
  async execute(sock, message, args) {
    if (args.length === 0) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Debes hacer una pregunta.\n\n*Ejemplo:* !8ball ¿Lloverá mañana?'
      });
    }

    const pregunta = args.join(' ');
    const respuesta = helpers.randomChoice(respuestas);

    await sock.sendMessage(message.key.remoteJid, {
      text: `🔮 *BOLA MÁGICA*\n\n❓ ${pregunta}\n\n🎱 ${respuesta}`
    });
  }
};
```

---

## 👥 COMANDO: Info del Grupo

**Archivo:** `commands/grupoinfo.js`

```javascript
const helpers = require('../utils/helpers');

module.exports = {
  name: 'grupoinfo',
  description: 'Muestra información del grupo',
  
  async execute(sock, message) {
    if (!helpers.isGroup(message)) {
      return await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Este comando solo funciona en grupos.'
      });
    }

    try {
      const groupMetadata = await sock.groupMetadata(message.key.remoteJid);

      const admins = groupMetadata.participants
        .filter(p => p.admin)
        .map(p => `  • ${p.id.split('@')[0]}`)
        .join('\n');

      const infoText = `
👥 *INFORMACIÓN DEL GRUPO*

📛 Nombre: ${groupMetadata.subject}
📝 Descripción: ${groupMetadata.desc || 'Sin descripción'}
👤 Creador: ${groupMetadata.owner?.split('@')[0] || 'Desconocido'}
📅 Creado: ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}
👥 Participantes: ${groupMetadata.participants.length}
👑 Administradores: ${admins.length}

*Lista de Admins:*
${admins || '  Ninguno'}
      `.trim();

      await sock.sendMessage(message.key.remoteJid, {
        text: infoText
      });
    } catch (error) {
      await sock.sendMessage(message.key.remoteJid, {
        text: '❌ Error al obtener información del grupo.'
      });
    }
  }
};
```

---

## 🕐 COMANDO: Hora Mundial

**Archivo:** `commands/hora.js`

```javascript
module.exports = {
  name: 'hora',
  description: 'Muestra la hora en diferentes zonas horarias',
  
  async execute(sock, message, args) {
    const zonas = {
      'bogota': 'America/Bogota',
      'mexico': 'America/Mexico_City',
      'madrid': 'Europe/Madrid',
      'londres': 'Europe/London',
      'nueva york': 'America/New_York',
      'tokio': 'Asia/Tokyo',
      'sydney': 'Australia/Sydney'
    };

    const ciudad = args.join(' ').toLowerCase() || 'todas';

    if (ciudad === 'todas') {
      const horas = Object.entries(zonas).map(([nombre, zona]) => {
        const hora = new Date().toLocaleString('es-CO', {
          timeZone: zona,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        return `🕐 ${nombre.charAt(0).toUpperCase() + nombre.slice(1)}: ${hora}`;
      }).join('\n');

      await sock.sendMessage(message.key.remoteJid, {
        text: `⏰ *HORA MUNDIAL*\n\n${horas}`
      });
    } else if (zonas[ciudad]) {
      const hora = new Date().toLocaleString('es-CO', {
        timeZone: zonas[ciudad],
        dateStyle: 'full',
        timeStyle: 'long'
      });

      await sock.sendMessage(message.key.remoteJid, {
        text: `🕐 *${ciudad.toUpperCase()}*\n\n${hora}`
      });
    } else {
      await sock.sendMessage(message.key.remoteJid, {
        text: `❌ Ciudad no encontrada.

*Disponibles:* ${Object.keys(zonas).join(', ')}`
      });
    }
  }
};
```

---

## 📝 COMANDO: Notas

**Archivo:** `commands/nota.js`

```javascript
const fs = require('fs');
const path = require('path');

const NOTAS_FILE = path.join(__dirname, '..', 'notas.json');

function loadNotas() {
  if (fs.existsSync(NOTAS_FILE)) {
    return JSON.parse(fs.readFileSync(NOTAS_FILE, 'utf8'));
  }
  return {};
}

function saveNotas(notas) {
  fs.writeFileSync(NOTAS_FILE, JSON.stringify(notas, null, 2));
}

module.exports = {
  name: 'nota',
  description: 'Guarda y consulta notas del grupo',
  
  async execute(sock, message, args) {
    const chatId = message.key.remoteJid;
    const notas = loadNotas();

    if (!notas[chatId]) {
      notas[chatId] = [];
    }

    if (args.length === 0) {
      // Listar notas
      if (notas[chatId].length === 0) {
        return await sock.sendMessage(chatId, {
          text: '📝 No hay notas guardadas.\n\n*Uso:* !nota [texto] para guardar una nota.'
        });
      }

      const lista = notas[chatId]
        .map((n, i) => `${i + 1}. ${n}`)
        .join('\n');

      await sock.sendMessage(chatId, {
        text: `📝 *NOTAS GUARDADAS*\n\n${lista}\n\n_Usa !borranota [número] para eliminar_`
      });
    } else {
      // Guardar nota
      const nota = args.join(' ');
      notas[chatId].push(nota);
      saveNotas(notas);

      await sock.sendMessage(chatId, {
        text: `✅ Nota guardada:\n\n"${nota}"`
      });
    }
  }
};
```

**También agregar:** `commands/borranota.js`

```javascript
module.exports = {
  name: 'borranota',
  description: 'Elimina una nota guardada',
  
  async execute(sock, message, args) {
    const chatId = message.key.remoteJid;
    const notas = loadNotas();

    if (!notas[chatId] || notas[chatId].length === 0) {
      return await sock.sendMessage(chatId, {
        text: '❌ No hay notas guardadas.'
      });
    }

    const numero = parseInt(args[0]) - 1;

    if (isNaN(numero) || numero < 0 || numero >= notas[chatId].length) {
      return await sock.sendMessage(chatId, {
        text: '❌ Número de nota inválido.'
      });
    }

    const notaEliminada = notas[chatId].splice(numero, 1)[0];
    saveNotas(notas);

    await sock.sendMessage(chatId, {
      text: `🗑️ Nota eliminada:\n\n"${notaEliminada}"`
    });
  }
};
```

---

## 🎉 ¡Usa estos comandos!

Todos estos comandos están listos para copiar y pegar en tu carpeta `commands/`.

**Recuerda:**
1. Copia el código completo
2. Guarda en `commands/[nombre].js`
3. Reinicia el bot
4. ¡Listo para usar!

---

Más ideas de comandos:
- Horóscopo diario
- Generador de contraseñas
- Conversor de unidades
- Acortador de URLs
- Contador de palabras
- Generador de memes con texto
- Info de películas (OMDb API)
- Letras de canciones (Lyrics.ovh API)
