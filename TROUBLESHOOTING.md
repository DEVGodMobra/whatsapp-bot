# 🔧 GUÍA DE SOLUCIÓN DE PROBLEMAS

Soluciones a los problemas más comunes con el bot de WhatsApp.

---

## 🚫 PROBLEMAS DE INSTALACIÓN

### Error: "node no se reconoce como comando" (Windows)

**Causa:** Node.js no está en el PATH o necesita reinicio.

**Solución:**
1. Cierra todas las ventanas de CMD/PowerShell
2. Reinicia tu computadora
3. Abre CMD nuevamente
4. Prueba: `node --version`

Si aún no funciona:
1. Busca "Variables de entorno" en Windows
2. Edita "Path" en Variables del sistema
3. Agrega: `C:\Program Files\nodejs\`
4. Reinicia

---

### Error: "Cannot find module '@whiskeysockets/baileys'"

**Causa:** Las dependencias no se instalaron correctamente.

**Solución:**
```bash
# Eliminar node_modules
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install
```

Si persiste:
```bash
npm install --legacy-peer-deps
```

---

### Error: "gyp ERR!" o errores de compilación

**Causa:** Faltan herramientas de compilación.

**Solución Windows:**
```cmd
npm install --global windows-build-tools
```

**Solución macOS:**
```bash
xcode-select --install
```

**Solución Linux:**
```bash
sudo apt install build-essential python3 -y
```

---

### Error al instalar en Termux

**Causa:** Repositorios desactualizados.

**Solución:**
```bash
# Actualizar repositorios
pkg update && pkg upgrade -y

# Si hay conflictos
pkg update --force

# Reinstalar Node.js
pkg uninstall nodejs -y
pkg install nodejs -y
```

---

## 📱 PROBLEMAS DE CONEXIÓN

### El código QR no aparece

**Solución 1:** Esperar más tiempo
- Puede tardar 30-60 segundos en generarse
- No interrumpas el proceso

**Solución 2:** Limpiar sesión anterior
```bash
# Eliminar carpeta de autenticación
rm -rf auth_info_baileys

# Reiniciar el bot
npm start
```

**Solución 3:** Verificar conexión a internet
```bash
# Probar conexión
ping google.com
```

---

### Error: "Connection Closed"

**Causas comunes:**
1. Internet inestable
2. WhatsApp detectó actividad sospechosa
3. Sesión expiró

**Soluciones:**

1. **Verificar internet:**
```bash
ping -c 5 google.com
```

2. **Limpiar y reconectar:**
```bash
rm -rf auth_info_baileys
npm start
```

3. **Esperar 10-15 minutos** si WhatsApp bloqueó temporalmente

---

### Error: "Logged Out"

**Causa:** La sesión se cerró desde el teléfono.

**Solución:**
1. No cierres sesión desde WhatsApp en el teléfono
2. Elimina `auth_info_baileys`
3. Escanea el QR nuevamente

---

### Error: "Rate Limit"

**Causa:** Demasiados mensajes en poco tiempo.

**Solución:**
1. Espera 5-10 minutos
2. Reduce la frecuencia de comandos
3. Agrega delays en el código:

```javascript
// En index.js, antes de enviar mensajes
await helpers.sleep(2000); // 2 segundos
```

---

## 🖼️ PROBLEMAS CON STICKERS

### Error: "FFmpeg not found"

**Solución Windows:**
1. Descarga FFmpeg: https://www.gyan.dev/ffmpeg/builds/
2. Extrae a `C:\ffmpeg`
3. Agrega `C:\ffmpeg\bin` al PATH
4. Reinicia CMD

Verificar:
```cmd
ffmpeg -version
```

**Solución macOS:**
```bash
brew install ffmpeg
```

**Solución Linux:**
```bash
sudo apt install ffmpeg -y
```

**Solución Termux:**
```bash
pkg install ffmpeg -y
```

---

### Los stickers no se crean

**Causa 1:** Archivo muy grande

**Solución:**
- Comprime la imagen antes
- Máximo 1MB para imágenes
- Máximo 10 segundos para videos

**Causa 2:** Formato no soportado

**Solución:**
- Usa JPG, PNG para imágenes
- Usa MP4 para videos
- Evita GIF animados (usa MP4 en su lugar)

---

### Error: "Cannot read property 'download'"

**Causa:** El mensaje no contiene multimedia.

**Solución:**
1. Asegúrate de responder a una imagen/video
2. No funcionará con stickers existentes
3. Verifica que la imagen se haya enviado completamente

---

## 🎵 PROBLEMAS CON MÚSICA

### Error: "YouTube SignatureCipher"

**Causa:** YouTube cambió su API (muy común).

**Solución temporal:**
```bash
npm install ytdl-core@latest
```

**Solución permanente:**
Usar una API alternativa:

```javascript
// Opción 1: youtube-dl-exec
npm install youtube-dl-exec

// Opción 2: ytdl-core con proxy
const ytdl = require('ytdl-core');
const agent = ytdl.createProxyAgent({ uri: 'http://proxy-url' });
```

---

### Error: "Video unavailable"

**Causas:**
1. Video eliminado o privado
2. Restricción geográfica
3. URL incorrecta

**Solución:**
- Verifica la URL manualmente
- Prueba con otro video
- Usa VPN si hay restricción

---

### Descarga muy lenta

**Solución:**
1. Limitar calidad de audio en `commands/musica.js`:

```javascript
const stream = ytdl(url, { 
  quality: 'lowestaudio', // Cambiar a lowestaudio
  filter: 'audioonly'
});
```

2. Limitar duración máxima (ya implementado):
```javascript
if (duration > 300) { // 5 minutos máximo
  return await sock.sendMessage(chatId, { 
    text: '❌ El audio es demasiado largo.'
  });
}
```

---

## 🗣️ PROBLEMAS CON TTS

### Error: "Failed to fetch"

**Causa:** API de TTS no disponible.

**Solución:**
Usar API alternativa en `commands/tts.js`:

```javascript
// Opción 1: Google TTS (unofficial)
const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(text)}`;

// Opción 2: ResponsiveVoice (limitado)
const url = `https://responsivevoice.org/responsivevoice/getvoice.php?t=${encodeURIComponent(text)}&tl=es`;

// Opción 3: API local (instalando festival)
// sudo apt install festival
// echo "texto" | festival --tts
```

---

## 🌐 PROBLEMAS CON APIs

### Error: "Network Error" o "Timeout"

**Solución:**
1. Verificar internet:
```bash
curl https://api.example.com
```

2. Aumentar timeout en axios:
```javascript
const response = await axios.get(url, { 
  timeout: 30000 // 30 segundos
});
```

3. Usar retry lógico:
```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(2000); // Esperar 2 segundos
    }
  }
}
```

---

### Error: "Rate limit exceeded"

**Causa:** Demasiadas peticiones a la API.

**Solución:**
1. Implementar caché:
```javascript
const cache = new Map();

async function getMeme() {
  if (cache.has('last_meme')) {
    const { data, time } = cache.get('last_meme');
    if (Date.now() - time < 60000) { // 1 minuto
      return data;
    }
  }
  
  const meme = await fetchMeme();
  cache.set('last_meme', { data: meme, time: Date.now() });
  return meme;
}
```

2. Agregar delays entre comandos

---

## 💥 ERRORES EN RUNTIME

### Error: "TypeError: Cannot read property..."

**Causa:** Objeto undefined/null.

**Solución:**
Usar optional chaining:
```javascript
// ❌ Malo
const text = message.message.conversation;

// ✅ Bueno
const text = message.message?.conversation || '';
```

---

### Bot se cae con "UnhandledPromiseRejection"

**Solución:**
1. Agregar try/catch en comandos:
```javascript
async execute(sock, message, args) {
  try {
    // tu código
  } catch (error) {
    logger.error('Error en comando', error);
    await sock.sendMessage(message.key.remoteJid, {
      text: '❌ Hubo un error. Intenta de nuevo.'
    });
  }
}
```

2. Ya está implementado en `index.js`:
```javascript
process.on('unhandledRejection', (err) => {
  logger.error('Promesa rechazada no manejada', err);
});
```

---

### Memoria RAM se llena

**Causa:** Archivos temporales no se eliminan.

**Solución:**
1. Agregar limpieza al final de comandos:
```javascript
// Limpiar archivos temporales
if (fs.existsSync(tempFile)) {
  fs.unlinkSync(tempFile);
}
```

2. Crear cron job para limpiar:
```javascript
// En index.js
setInterval(() => {
  const tempDir = __dirname;
  const files = fs.readdirSync(tempDir);
  
  files.forEach(file => {
    if (file.startsWith('temp_') || file.startsWith('audio_')) {
      fs.unlinkSync(path.join(tempDir, file));
    }
  });
  
  logger.info('Archivos temporales limpiados');
}, 3600000); // Cada hora
```

---

## 📱 PROBLEMAS EN TERMUX

### "Killed" al ejecutar el bot

**Causa:** Memoria RAM insuficiente.

**Solución:**
1. Liberar memoria:
```bash
# Limpiar caché
npm cache clean --force

# Reiniciar Termux
exit
# (reabrir Termux)
```

2. Usar swap (memoria virtual):
```bash
# Crear archivo de swap de 1GB
dd if=/dev/zero of=/data/local/tmp/swapfile bs=1M count=1024
chmod 600 /data/local/tmp/swapfile
mkswap /data/local/tmp/swapfile
swapon /data/local/tmp/swapfile
```

---

### Termux se cierra solo

**Solución:**
```bash
# Activar wake lock
termux-wake-lock

# Ejecutar en segundo plano
nohup node index.js > output.log 2>&1 &

# Para ver el proceso
ps aux | grep node

# Para ver logs
tail -f output.log
```

---

### Permisos denegados

**Solución:**
```bash
# Dar permisos de almacenamiento
termux-setup-storage

# Dar permisos de ejecución
chmod +x install.sh
chmod +x index.js

# Si hay errores de escritura
chmod -R 755 .
```

---

## ⚠️ BLOQUEOS DE WHATSAPP

### Señales de advertencia:
- Mensajes no se envían
- "Esta cuenta no puede usar WhatsApp"
- QR no funciona
- Desconexiones frecuentes

### Prevención:

1. **Usar número secundario**
- NUNCA uses tu número principal
- Consigue una SIM prepago

2. **Evitar spam:**
```javascript
// Agregar delay entre mensajes
async function sendWithDelay(sock, jid, content) {
  await helpers.sleep(2000); // 2 segundos
  return await sock.sendMessage(jid, content);
}
```

3. **Limitar comandos por usuario:**
```javascript
const userCooldowns = new Map();

// En el handler de comandos
const userId = helpers.getSender(message);
const now = Date.now();

if (userCooldowns.has(userId)) {
  const lastUse = userCooldowns.get(userId);
  if (now - lastUse < 5000) { // 5 segundos
    return await sock.sendMessage(chatId, {
      text: '⏳ Espera un poco antes de usar otro comando.'
    });
  }
}

userCooldowns.set(userId, now);
```

4. **Monitorear uso:**
```javascript
// Logger de comandos con contador
let commandCount = 0;

setInterval(() => {
  logger.info(`Comandos ejecutados en la última hora: ${commandCount}`);
  commandCount = 0;
}, 3600000);
```

---

### Si recibes un ban:

**Ban temporal (24-48 horas):**
1. Espera el tiempo indicado
2. No intentes escanear el QR
3. Reduce el uso del bot

**Ban permanente:**
1. El número ya no puede usar WhatsApp
2. Necesitarás otro número
3. Aprende de los errores

---

## 🔍 DEBUGGING

### Ver logs detallados:

```javascript
// En index.js, cambiar nivel de log de pino
const sock = makeWASocket({
  logger: pino({ level: 'trace' }), // Cambia 'silent' a 'trace'
  // ...
});
```

### Agregar console.log estratégicos:

```javascript
async execute(sock, message, args) {
  console.log('=== DEBUG ===');
  console.log('Message:', JSON.stringify(message, null, 2));
  console.log('Args:', args);
  console.log('=============');
  
  // tu código
}
```

### Guardar logs en archivo:

```bash
# Linux/Mac/Termux
node index.js > bot.log 2>&1

# Ver logs en tiempo real
tail -f bot.log
```

---

## 🆘 ÚLTIMO RECURSO

Si nada funciona:

1. **Reinstalación limpia:**
```bash
# Eliminar todo
rm -rf node_modules package-lock.json auth_info_baileys

# Reinstalar
npm install --legacy-peer-deps

# Iniciar
npm start
```

2. **Verificar versiones:**
```bash
node --version  # Debe ser v16+
npm --version
ffmpeg -version
```

3. **Probar código mínimo:**
Crea `test.js`:
```javascript
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function test() {
  const { state } = await useMultiFileAuthState('test_auth');
  const sock = makeWASocket({ auth: state });
  console.log('Conexión establecida!');
}

test();
```

```bash
node test.js
```

---

## 📞 OBTENER AYUDA

Si el problema persiste:

1. **Documenta el error:**
   - Copia el mensaje de error completo
   - Anota qué estabas haciendo
   - Versión de Node.js: `node --version`

2. **Busca en línea:**
   - Google el error exacto
   - Stack Overflow
   - GitHub Issues de Baileys

3. **Comunidad:**
   - Grupos de WhatsApp de bots
   - Discord de desarrolladores
   - Foros de Node.js

4. **Recursos:**
   - https://github.com/WhiskeySockets/Baileys
   - https://nodejs.org/docs
   - https://stackoverflow.com

---

## ✅ CHECKLIST DE PROBLEMAS

Antes de pedir ayuda, verifica:

- [ ] Node.js instalado (v16+)
- [ ] FFmpeg instalado
- [ ] `npm install` ejecutado sin errores
- [ ] config.js editado correctamente
- [ ] Internet funcionando
- [ ] No hay firewall bloqueando
- [ ] Código QR escaneado correctamente
- [ ] No hay errores en rojo en consola
- [ ] Archivos en la carpeta correcta

---

¡Con esta guía deberías poder resolver el 99% de los problemas! 🎉
