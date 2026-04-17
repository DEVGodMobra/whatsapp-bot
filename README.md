# 🤖 Bot de WhatsApp con Baileys

Bot completo de WhatsApp para grupos de amigos con comandos interactivos, música, memes, stickers y más.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación en Computadora](#-instalación-en-computadora)
- [Instalación en Android (Termux)](#-instalación-en-android-termux)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Comandos Disponibles](#-comandos-disponibles)
- [Personalización](#-personalización)
- [Solución de Problemas](#-solución-de-problemas)
- [Consejos para Evitar Bloqueos](#️-consejos-para-evitar-bloqueos)

---

## ✨ Características

- ✅ Sistema de comandos con prefijo `!`
- ✅ Memes aleatorios de Reddit
- ✅ Convertir imágenes/videos a stickers
- ✅ Descargar música de YouTube
- ✅ Texto a voz (TTS)
- ✅ Juegos: dado, verdad o reto
- ✅ Frases motivacionales
- ✅ Respuestas automáticas
- ✅ Detección de grupos
- ✅ Logs detallados en consola
- ✅ Manejo robusto de errores

---

## 💻 Instalación en Computadora

### Requisitos Previos

- **Node.js** (versión 16 o superior)
- **FFmpeg** (para stickers y conversión de audio)
- **Git** (opcional, para clonar repositorios)

### Paso 1: Instalar Node.js

#### Windows:
1. Ve a https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Verifica la instalación:
   ```bash
   node --version
   npm --version
   ```

#### macOS:
```bash
# Usando Homebrew
brew install node

# Verificar instalación
node --version
npm --version
```

#### Linux (Ubuntu/Debian):
```bash
# Actualizar repositorios
sudo apt update

# Instalar Node.js y npm
sudo apt install nodejs npm -y

# Verificar instalación
node --version
npm --version
```

### Paso 2: Instalar FFmpeg

#### Windows:
1. Descarga FFmpeg desde: https://ffmpeg.org/download.html
2. Extrae el archivo ZIP
3. Agrega la carpeta `bin` al PATH del sistema
4. Verifica: `ffmpeg -version`

#### macOS:
```bash
brew install ffmpeg
```

#### Linux:
```bash
sudo apt install ffmpeg -y
```

### Paso 3: Configurar el Proyecto

```bash
# Crear carpeta del proyecto
mkdir whatsapp-bot
cd whatsapp-bot

# Copiar todos los archivos del bot a esta carpeta
# (package.json, index.js, config.js, carpetas commands y utils)

# Instalar dependencias
npm install

# Si hay errores, intenta:
npm install --legacy-peer-deps
```

### Paso 4: Configurar el Bot

Edita el archivo `config.js` y cambia:

```javascript
owner: '593XXXXXXXXX@s.whatsapp.net', // Tu número con código de país
```

Por ejemplo: `'573001234567@s.whatsapp.net'` (Colombia)

### Paso 5: Iniciar el Bot

```bash
npm start
```

Aparecerá un código QR. Escanéalo con WhatsApp:
1. Abre WhatsApp en tu teléfono
2. Ve a Configuración → Dispositivos vinculados
3. Toca "Vincular un dispositivo"
4. Escanea el código QR

¡Listo! El bot está funcionando.

---

## 📱 Instalación en Android (Termux)

### Paso 1: Instalar Termux

1. Descarga Termux desde F-Droid (no uses Google Play)
   - Enlace: https://f-droid.org/en/packages/com.termux/
2. Instala la aplicación

### Paso 2: Actualizar Termux

Abre Termux y ejecuta:

```bash
# Actualizar paquetes
pkg update && pkg upgrade -y

# Aceptar todas las actualizaciones presionando 'y'
```

### Paso 3: Instalar Node.js y FFmpeg

```bash
# Instalar Node.js
pkg install nodejs -y

# Instalar FFmpeg
pkg install ffmpeg -y

# Instalar Git (opcional)
pkg install git -y

# Verificar instalaciones
node --version
npm --version
ffmpeg -version
```

### Paso 4: Dar Permisos de Almacenamiento

```bash
termux-setup-storage
```

Acepta el permiso cuando te lo pida.

### Paso 5: Crear el Proyecto

```bash
# Ir a la carpeta de almacenamiento
cd storage/downloads

# Crear carpeta del proyecto
mkdir whatsapp-bot
cd whatsapp-bot

# Copiar todos los archivos del bot aquí
# Puedes transferir los archivos desde tu PC usando:
# - Telegram
# - Google Drive
# - Cable USB

# O crear los archivos manualmente con:
nano package.json
# (pega el contenido, CTRL+X, Y, Enter)
```

### Paso 6: Instalar Dependencias

```bash
npm install
```

Si hay errores, prueba:

```bash
npm install --legacy-peer-deps
```

### Paso 7: Iniciar el Bot

```bash
node index.js
```

**Importante en Termux:**
- No cierres la aplicación Termux
- No limpies la memoria RAM
- Considera usar un "wake lock" para mantener la app activa
- Instala `termux-wake-lock` para evitar que se duerma:

```bash
termux-wake-lock
```

---

## ⚙️ Configuración

### Editar config.js

```javascript
module.exports = {
  // Prefijo de comandos (puedes cambiarlo a /, ., #, etc.)
  prefix: '!',
  
  // Nombre del bot
  botName: '🤖 Mi Bot Personalizado',
  
  // Tu número de WhatsApp
  owner: '593XXXXXXXXX@s.whatsapp.net',
  
  // Respuestas automáticas (agregar más)
  autoResponses: {
    'hola bot': '¡Hola! 👋',
    'buenos dias': '¡Buenos días! ☀️'
  },
  
  // Personalizar frases, verdades y retos
  frases: [
    'Tu frase personalizada aquí'
  ]
};
```

---

## 🎮 Uso

### Vincular el Bot

1. Ejecuta `npm start` o `node index.js`
2. Escanea el código QR con WhatsApp
3. El bot se conectará automáticamente

### Usar en un Grupo

1. Crea un grupo de WhatsApp
2. Agrega el número vinculado al bot al grupo
3. Prueba enviando: `!menu`

### Hacer al Bot Administrador (Opcional)

Para algunas funciones avanzadas:
1. Entra al grupo
2. Toca el nombre del grupo
3. Toca sobre el bot
4. Selecciona "Convertir en administrador"

---

## 📜 Comandos Disponibles

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `!menu` | Muestra todos los comandos | `!menu` |
| `!meme` | Envía un meme aleatorio | `!meme` |
| `!sticker` | Convierte imagen/video a sticker | Responde a una imagen con `!sticker` |
| `!musica [url]` | Descarga audio de YouTube | `!musica https://youtu.be/...` |
| `!dado` | Lanza un dado (1-6) | `!dado` |
| `!frase` | Frase motivacional | `!frase` |
| `!tts [texto]` | Convierte texto a voz | `!tts hola amigos` |
| `!verdad` | Pregunta de verdad | `!verdad` |
| `!reto` | Reto divertido | `!reto` |

---

## 🎨 Personalización

### Agregar Nuevos Comandos

1. Crea un nuevo archivo en `commands/`, por ejemplo `clima.js`:

```javascript
// commands/clima.js
module.exports = {
  name: 'clima',
  description: 'Muestra el clima',
  
  async execute(sock, message, args) {
    await sock.sendMessage(message.key.remoteJid, { 
      text: '☀️ El clima hoy está soleado!' 
    });
  }
};
```

2. Reinicia el bot
3. El comando se cargará automáticamente

### Cambiar Respuestas Automáticas

Edita `config.js`:

```javascript
autoResponses: {
  'bot': '¿Sí? 🤖',
  'gracias': '¡De nada! 😊',
  'ayuda': 'Escribe !menu para ver los comandos'
}
```

### Personalizar el Menú

Edita `commands/menu.js` para cambiar el diseño del menú.

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error al crear stickers
Verifica que FFmpeg esté instalado:
```bash
ffmpeg -version
```

### El bot no responde
- Verifica que el código QR se haya escaneado correctamente
- Revisa los logs en la consola
- Asegúrate de usar el prefijo correcto (por defecto `!`)

### "ECONNRESET" o errores de conexión
- Tu internet puede estar inestable
- WhatsApp puede estar bloqueando temporalmente
- Espera unos minutos y reinicia el bot

### El bot se desconecta en Termux
```bash
# Mantener Termux despierto
termux-wake-lock

# Ejecutar en segundo plano
nohup node index.js &
```

### Errores al descargar música de YouTube
- Verifica que la URL sea válida
- YouTube puede haber cambiado su API
- Considera usar APIs alternativas

---

## 🛡️ Consejos para Evitar Bloqueos

### ⚠️ Importante: WhatsApp puede banear cuentas que usen bots

### Mejores Prácticas:

1. **Usa un número secundario**
   - No uses tu número principal
   - Consigue una SIM adicional

2. **No envíes spam**
   - Evita enviar muchos mensajes seguidos
   - No uses el bot para marketing masivo

3. **Limita el uso**
   - Úsalo solo en grupos pequeños de amigos
   - No lo uses para grupos públicos grandes

4. **Evita contenido inapropiado**
   - No envíes contenido que viole las políticas de WhatsApp

5. **No hagas scraping intensivo**
   - No descargues cientos de audios al día

6. **Usa delays entre acciones**
   - El bot ya tiene delays integrados

7. **Monitorea el comportamiento**
   - Si recibes advertencias de WhatsApp, detén el bot

### Señales de Advertencia:

- Mensajes no se envían
- "Esta cuenta no puede usar WhatsApp"
- Código QR no funciona

**Si recibes un ban:**
- Es temporal (24-48 horas generalmente)
- Si es permanente, necesitarás un nuevo número

---

## 📝 Estructura del Proyecto

```
whatsapp-bot/
├── package.json          # Dependencias del proyecto
├── config.js            # Configuración del bot
├── index.js             # Archivo principal
├── commands/            # Carpeta de comandos
│   ├── menu.js
│   ├── meme.js
│   ├── sticker.js
│   ├── musica.js
│   ├── dado.js
│   ├── frase.js
│   ├── tts.js
│   ├── verdad.js
│   └── reto.js
├── utils/               # Utilidades
│   ├── logger.js        # Sistema de logs
│   └── helpers.js       # Funciones auxiliares
└── auth_info_baileys/   # Datos de autenticación (auto-generado)
```

---

## 🤝 Contribuir

¿Quieres agregar más comandos? ¡Hazlo!

Ideas para nuevos comandos:
- Horóscopo diario
- Clima de una ciudad
- Traducción de textos
- Calculadora
- Recordatorios
- Chistes

---

## 📄 Licencia

MIT License - Úsalo libremente y modifícalo a tu gusto.

---

## ⚡ Comandos Útiles

```bash
# Iniciar el bot
npm start

# Ver logs en tiempo real
npm start | tee bot.log

# Ejecutar en segundo plano (Linux/Mac/Termux)
nohup node index.js > output.log 2>&1 &

# Detener el bot (CTRL + C)

# Ver procesos de Node (para matar el bot)
ps aux | grep node
kill [PID]
```

---

## 🎉 ¡Disfruta tu bot!

Si tienes problemas, revisa los logs en la consola. Todos los errores se muestran ahí.

Para más ayuda, busca en:
- GitHub: Issues de Baileys
- Stack Overflow
- Grupos de WhatsApp sobre bots

---

**Creado con ❤️ para grupos de amigos**
