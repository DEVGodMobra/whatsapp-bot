# 📱 CÓMO DESCARGAR Y USAR EL BOT - SUPER SIMPLE

## 🎯 ELIGE TU OPCIÓN:

---

## 📱 OPCIÓN A: EN TU CELULAR ANDROID (CON TERMUX)

### PASO 1: DESCARGAR EL PROYECTO ⬇️

1. **En esta conversación de Claude:**
   - Busca el archivo `whatsapp-bot-completo.zip` (51KB)
   - Tócalo para descargar
   - Se guardará en tu carpeta "Descargas"

2. **Descomprimir:**
   - Abre la app "Archivos" o "Mis Archivos"
   - Ve a "Descargas"
   - Toca `whatsapp-bot-completo.zip`
   - Toca "Extraer" o "Descomprimir"
   - ✅ Listo, ahora tienes la carpeta `whatsapp-bot`

---

### PASO 2: INSTALAR TERMUX 📲

1. **NO uses Google Play** (está desactualizado)

2. **Descarga desde F-Droid:**
   - Opción fácil: Ve a este link desde tu celular:
     ```
     https://f-droid.org/repo/com.termux_118.apk
     ```
   - Descarga e instala

3. **Abre Termux** (verás pantalla negra)

---

### PASO 3: CONFIGURAR TERMUX ⚙️

**Copia estos comandos UNO POR UNO:**

```bash
pkg update && pkg upgrade -y
```
⏳ Espera 2-5 minutos. Presiona `Y` si pregunta.

```bash
pkg install nodejs -y
```
⏳ Espera 5-10 minutos

```bash
pkg install ffmpeg -y
```
⏳ Espera 3-5 minutos

```bash
termux-setup-storage
```
📱 Acepta el permiso

---

### PASO 4: MOVER EL PROYECTO 📂

```bash
cd storage/downloads
```

```bash
ls
```
Deberías ver carpetas. Busca "whatsapp-bot"

```bash
cd whatsapp-bot
```

Si te dice "no existe":
```bash
pkg install unzip -y
unzip whatsapp-bot-completo.zip -d whatsapp-bot
cd whatsapp-bot
```

---

### PASO 5: EDITAR TU NÚMERO 📝

```bash
nano config.js
```

Busca esta línea:
```
owner: '593XXXXXXXXX@s.whatsapp.net',
```

**Cámbiala por TU número:**
- Ejemplo Colombia: `'573001234567@s.whatsapp.net',`
- Ejemplo México: `'525512345678@s.whatsapp.net',`

**Guardar:**
1. `CTRL + X`
2. `Y`
3. `Enter`

---

### PASO 6: INSTALAR 📦

```bash
npm install
```
⏳ Espera 3-10 minutos

Si hay errores:
```bash
npm install --legacy-peer-deps
```

---

### PASO 7: INICIAR 🚀

```bash
node index.js
```

**Aparecerá un código QR** ▓▓▓▓▓

---

### PASO 8: ESCANEAR QR 📱

1. Abre WhatsApp
2. Menú (⋮) → "Dispositivos vinculados"
3. "Vincular un dispositivo"
4. Escanea el QR de Termux
5. ✅ ¡Conectado!

---

### PASO 9: PROBAR 🎮

Envíate: `!menu`

El bot debe responder.

---

### PASO 10: MANTENER ACTIVO ⚡

**Para que no se apague:**

Nueva sesión de Termux:
```bash
termux-wake-lock
```

O ejecutar en segundo plano:
```bash
nohup node index.js > output.log 2>&1 &
```

---

## 💻 OPCIÓN B: EN TU COMPUTADORA (WINDOWS/MAC/LINUX)

### PASO 1: DESCARGAR

1. Descarga `whatsapp-bot-completo.zip` de esta conversación
2. Guárdalo en tu Escritorio
3. Descomprime (clic derecho → Extraer)

---

### PASO 2: INSTALAR NODE.JS

**Windows:**
1. Ve a: https://nodejs.org/
2. Descarga "LTS" (versión recomendada)
3. Instala (siguiente, siguiente, siguiente)
4. Reinicia tu PC

**Mac:**
```bash
brew install node
```

**Linux:**
```bash
sudo apt install nodejs npm -y
```

---

### PASO 3: INSTALAR FFMPEG

**Windows:**
1. https://www.gyan.dev/ffmpeg/builds/
2. Descarga "ffmpeg-release-essentials.zip"
3. Extrae a `C:\ffmpeg`
4. Agrega al PATH: Busca "variables de entorno" → Edita Path → Agrega `C:\ffmpeg\bin`

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg -y
```

---

### PASO 4: ABRIR TERMINAL

**Windows:**
- `Windows + R`
- Escribe: `cmd`
- Enter

**Mac:**
- `Command + Espacio`
- Escribe: "Terminal"

**Linux:**
- `Ctrl + Alt + T`

---

### PASO 5: IR A LA CARPETA

```bash
cd Desktop/whatsapp-bot
```

(O donde hayas descomprimido)

---

### PASO 6: EDITAR CONFIG

Abre `config.js` con Notepad o TextEdit

Cambia:
```javascript
owner: '573001234567@s.whatsapp.net',
```

Por TU número con código de país.

---

### PASO 7: INSTALAR

```bash
npm install
```

---

### PASO 8: INICIAR

```bash
npm start
```

Aparecerá el QR.

---

### PASO 9: ESCANEAR

WhatsApp → Dispositivos vinculados → Escanear QR

---

### PASO 10: PROBAR

Envía: `!menu`

---

## ⚡ RESUMEN ULTRA RÁPIDO

### Android:
1. Descarga ZIP → Descomprime
2. Instala Termux desde F-Droid
3. `pkg update && pkg upgrade -y`
4. `pkg install nodejs ffmpeg -y`
5. `cd storage/downloads/whatsapp-bot`
6. Edita `config.js` con tu número
7. `npm install`
8. `node index.js`
9. Escanea QR
10. ¡Listo!

### Computadora:
1. Descarga ZIP → Descomprime
2. Instala Node.js + FFmpeg
3. Abre terminal
4. `cd Desktop/whatsapp-bot`
5. Edita `config.js`
6. `npm install`
7. `npm start`
8. Escanea QR
9. ¡Listo!

---

## ❓ DUDAS FRECUENTES

**¿Cuánto tarda?**
- Android: 20-30 minutos
- PC: 10-15 minutos

**¿Necesito saber programar?**
No, solo sigue los pasos.

**¿Es gratis?**
Sí, completamente.

**¿Me pueden banear?**
Sí, si haces spam. Usa número secundario.

**¿Funciona 24/7?**
Sí, si dejas el celular/PC encendido.

---

## 🆘 SI ALGO FALLA

Lee: `TROUBLESHOOTING.md`

O reinicia desde el principio.

---

¡ESO ES TODO! 🎉

Cualquier duda, revisa los archivos .md incluidos.
