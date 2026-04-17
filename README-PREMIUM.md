# 🤖 BOT DE WHATSAPP PREMIUM - GUÍA COMPLETA

## 📋 ÍNDICE
1. [Configuración de YouTube API](#youtube-api)
2. [Archivos Nuevos](#archivos-nuevos)
3. [Comandos Disponibles](#comandos)
4. [Deployment a Railway](#deployment)
5. [Próximos Pasos](#proximos-pasos)

---

## 🎵 1. CONFIGURACIÓN DE YOUTUBE API {#youtube-api}

### ¿Por qué necesitas esto?
Para que el comando `!music` funcione con **descarga real** de audio, necesitas una API key de YouTube Data API v3.

### Paso 1: Crear Proyecto en Google Cloud

1. Ve a: https://console.cloud.google.com/
2. Inicia sesión con tu cuenta de Google
3. Click en el selector de proyectos (arriba izquierda)
4. Click en **"Nuevo Proyecto"**
5. Nombre: `WhatsApp Bot Music`
6. Click **"Crear"**

### Paso 2: Habilitar YouTube Data API v3

1. En el menú lateral → **"APIs y servicios"** → **"Biblioteca"**
2. Busca: `YouTube Data API v3`
3. Click en el resultado
4. Click **"Habilitar"**

### Paso 3: Crear API Key

1. Ve a: **"APIs y servicios"** → **"Credenciales"**
2. Click **"+ Crear credenciales"** → **"Clave de API"**
3. Se generará tu API Key
4. **CÓPIALA** (algo como: `AIzaSyDv...`)

### Paso 4: Configurar en Railway

1. Ve a tu proyecto en Railway
2. Click en **"Variables"**
3. Click **"+ New Variable"**
4. Variable name: `YOUTUBE_API_KEY`
5. Variable value: `<pega tu API key aquí>`
6. Click **"Add"**

### Paso 5: Redeploy

1. En Railway → **"Deployments"**
2. Click en los 3 puntos del último deployment
3. Click **"Redeploy"**

---

## 📂 2. ARCHIVOS NUEVOS {#archivos-nuevos}

### Archivos que debes descargar y reemplazar:

1. **config.js** - Configuración actualizada con YouTube API
2. **commands/music.js** - Comando de música PREMIUM (NUEVO)
3. **commands/menu-new.js** - Sistema de menú paginado (NUEVO)
4. **commands/8ball.js** - Bola mágica 8 (NUEVO)
5. **commands/moneda.js** - Lanzar moneda (NUEVO)

### Estructura de carpetas:

```
whatsapp-bot/
├── commands/
│   ├── music.js ⭐ NUEVO - Descarga música
│   ├── menu-new.js ⭐ NUEVO - Menú paginado
│   ├── 8ball.js ⭐ NUEVO - Bola mágica
│   ├── moneda.js ⭐ NUEVO - Lanzar moneda
│   ├── sticker.js ✅ ACTUALIZADO
│   ├── tts.js ✅ ACTUALIZADO
│   ├── (otros comandos existentes)
├── config.js ✅ ACTUALIZADO
├── index.js
├── package.json
└── nixpacks.toml
```

---

## 🎮 3. COMANDOS DISPONIBLES {#comandos}

### 🎵 MÚSICA (PREMIUM)

```
!music <canción>
!music despacito
!music bad bunny - chambea
```

**Características:**
- ✅ Busca en YouTube automáticamente
- ✅ Muestra thumbnail/carátula
- ✅ Muestra título, canal, duración, vistas
- ✅ Envía enlace de YouTube
- ✅ **Descarga y envía el audio MP3**
- ✅ Sistema de fallback si falla

**Límites:**
- API gratuita: 10,000 búsquedas/día
- Descarga: ~100 canciones/mes (Cobalt API gratuita)

---

### 📱 MENÚ PAGINADO

```
!menu           - Menú principal con índice
!menu 1         - Juegos y Diversión
!menu 2         - RPG y Economía
!menu 6         - Descargas
!menu 14        - VIP Premium
```

**14 Páginas Totales:**
1. Juegos y Diversión (15 comandos)
2. RPG y Economía (15 comandos)
3. Personajes y Colección
4. Pizzería
5. Inversiones
6. **Descargas** (música, videos, etc.)
7. Manejo de Grupos
8. Utilidades
9. Ideas y Opiniones
10. Anuncios y Recompensas
11. Descargas y Media
12. Moderación Avanzada
13. Sistema
14. VIP Premium

---

### 🎮 JUEGOS NUEVOS

```
!8ball <pregunta>     - Bola mágica 8
!8ball ¿Tendré suerte hoy?

!moneda               - Lanzar moneda (cara/cruz)
!dado                 - Lanzar dado (1-6)
!meme                 - Meme aleatorio
!frase                - Frase motivacional
!verdad               - Pregunta de verdad
!reto                 - Reto aleatorio
```

---

### 🎨 UTILIDADES

```
!sticker              - Crear sticker (mejorado)
!tts <texto>          - Texto a voz (arreglado)
```

---

## 🚀 4. DEPLOYMENT A RAILWAY {#deployment}

### Opción A: Actualización Normal (Recomendada)

```bash
# 1. Descargar los archivos nuevos de arriba
# 2. Reemplazar en tu carpeta local

# 3. Git add
git add .

# 4. Git commit
git commit -m "Agregar sistema premium: música, menú paginado y juegos"

# 5. Git push
git push origin main
```

### Opción B: Deployment Manual en Railway

1. Ve a Railway
2. **Settings** → **Deploy**
3. Click **"Redeploy"**

---

## 📊 5. PRÓXIMOS PASOS {#proximos-pasos}

### FASE 1: IMPLEMENTADO ✅

- ✅ Comando `!music` con descarga real
- ✅ Sistema de menú paginado (14 páginas)
- ✅ Comandos de juegos básicos
- ✅ Comandos `!sticker` y `!tts` arreglados

### FASE 2: EN DESARROLLO 🚧

**Comandos pendientes (top prioridad):**

1. **RPG y Economía:**
   - !balance - Ver dinero
   - !daily - Recompensa diaria
   - !work - Trabajar y ganar
   - !shop - Tienda virtual
   - !inv - Inventario

2. **Descargas:**
   - !ytmp3 <link> - YouTube a MP3
   - !tiktok <link> - Descargar TikTok
   - !instagram <link> - Descargar Instagram

3. **Grupos:**
   - !add <número> - Agregar miembro
   - !kick @usuario - Expulsar
   - !welcome on/off - Bienvenidas
   - !antilink on/off - Anti enlaces

4. **Utilidades:**
   - !translate <texto> - Traductor
   - !clima <ciudad> - Clima
   - !calc <operación> - Calculadora

### FASE 3: AVANZADO 🎯

- Sistema de base de datos (economía persistente)
- Sistema VIP con permisos
- Más juegos interactivos
- Sistema de niveles y XP

---

## 🎯 TESTING

### Comandos para probar AHORA:

```
# 1. Menú
!menu

# 2. Música (necesita API key configurada)
!music despacito

# 3. Juegos
!8ball ¿Funcionará el bot?
!moneda
!dado

# 4. Utilidades
!sticker (responder a una imagen)
!tts Hola mundo
```

---

## ❓ TROUBLESHOOTING

### Error: "TU_API_KEY_AQUI"
- **Solución:** No configuraste la YouTube API key en Railway
- Ve a la sección [YouTube API](#youtube-api) arriba

### Error: "No pude descargar el audio"
- **Causa:** Cobalt API puede estar caída temporalmente
- **Solución:** El bot automáticamente envía solo el enlace
- Intenta de nuevo en 5 minutos

### Sticker no funciona
- Verifica que la imagen sea JPG o PNG
- Máximo 1MB de tamaño
- No GIFs animados

---

## 📞 SOPORTE

**Creador:** DEVGodMobra  
**WhatsApp Bot:** +573223138326  
**GitHub:** https://github.com/DEVGodMobra/whatsapp-bot

---

## 🎉 ¡LISTO!

Tu bot ahora tiene:
- ✅ Sistema de menú profesional
- ✅ Descarga de música con preview
- ✅ 20+ comandos funcionales
- ✅ Base para 100+ comandos

**¡Disfruta tu bot premium!** 🚀
