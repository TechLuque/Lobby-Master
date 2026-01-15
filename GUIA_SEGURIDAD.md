# 🔒 Guía de Seguridad - Protección de URLs AppScript

## 📋 Problema Identificado

Las URLs de AppScript estaban **hardcodeadas en el código cliente** (JavaScript en el navegador), lo que significa:

```
❌ ANTES (Inseguro):
┌─────────────┐
│   Navegador │  
│  (cliente)  │ ← Las URLs están visibles en inspeccionar → Red
└──────┬──────┘
       │ Petición directa a:
       └──> https://script.google.com/macros/s/[URL]/exec
              (ANYONE puede ver esto y usarlo)
```

## ✅ Solución Implementada

Ahora usas un **servidor backend que actúa como proxy**:

```
✅ AHORA (Seguro):
┌─────────────┐
│   Navegador │  
│  (cliente)  │ ← Solo ve peticiones a TU DOMINIO
└──────┬──────┘
       │ Petición a:
       └──> https://tudominio.com/api/validate-email (SEGURO)
            │
            └──> Server Backend (tiene variables de entorno)
                 │
                 └──> AppScript (URLs nunca se exponen)
```

## 🚀 Configuración Local

### 1. Crear archivo `.env.local` (NUNCA committear)

```bash
# Copia el contenido de .env.example a .env.local
cp .env.example .env.local
```

Edita `.env.local` y agrega tus URLs de AppScript:

```
APPSCRIPT_CODIGO=https://script.google.com/macros/s/AKfycbyPjTaAQEWpI-uAVsEGKVtCklKcxNVa4H6tz5kVGaoUynvbwNOCN8owY243E7Ksgk5w/exec
APPSCRIPT_MAQUINA=https://script.google.com/macros/s/AKfycbztxJqZlrHcDNksOZLkJoIYWr1fG9h_3iIFNFpGNW5I_nFLv0ra1jV_-7gOua0VSlCl/exec
APPSCRIPT_MAESTRIA=https://script.google.com/macros/s/AKfycbyeNP0uCOCDp6gTsCRI3Dvk0WlAIueoPzm7_B9f-bdbgRQd4XdjTfcnMJPKqyZ5oEfc/exec
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar servidor en desarrollo

```bash
npm run dev
# o
node api/server.js
```

El servidor corre en: `http://localhost:3000`

### 4. Probar el endpoint

```bash
curl -X POST http://localhost:3000/api/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@example.com"}'
```

## 🔐 Configuración en Vercel (Producción)

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Crear `vercel.json` (ya debe existir)

Asegúrate que apunta correctamente al servidor:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/server.js" }
  ]
}
```

### 3. Agregar variables de entorno en Vercel Dashboard

**Accede a:** https://vercel.com/dashboard

1. Selecciona tu proyecto
2. Ve a **Settings → Environment Variables**
3. Agrega estas variables:

```
APPSCRIPT_CODIGO = https://script.google.com/macros/s/[TU_ID_1]/exec
APPSCRIPT_MAQUINA = https://script.google.com/macros/s/[TU_ID_2]/exec
APPSCRIPT_MAESTRIA = https://script.google.com/macros/s/[TU_ID_3]/exec
```

4. **Deploy:** 
```bash
vercel --prod
```

### 4. Verificar variables de entorno en Vercel

⚠️ **Importante:** En el Dashboard de Vercel no verás el valor completo de las variables (por seguridad). Solo verás que están configuradas.

## 📝 Cambios en el Código

### Antes (Inseguro)
```javascript
// ❌ URL visible en el navegador
const APPS_SCRIPTS = [
  'https://script.google.com/macros/s/AKfycbyPjTaAQEWpI.../exec',
  'https://script.google.com/macros/s/AKfycbztxJqZlrHcD.../exec',
  'https://script.google.com/macros/s/AKfycbyeNP0uCOCDp.../exec'
];

// Cliente hace petición directa al AppScript
fetch(APPS_SCRIPTS[0], { method: 'POST', body: ... })
```

### Después (Seguro)
```javascript
// ✅ URL del servidor (backend), no del AppScript
const API_BASE_URL = 'https://tudominio.com/api';

// Cliente hace petición al server, el server valida con AppScript
fetch(`${API_BASE_URL}/validate-email`, { 
  method: 'POST', 
  body: JSON.stringify({ email })
})
```

## 🔍 Verificación de Seguridad

### 1. Abre DevTools (F12) en el navegador
### 2. Ve a Tab "Red" (Network)
### 3. Intenta login

**ANTES (Inseguro):**
```
Request URL: https://script.google.com/macros/s/AKfycbyPjTa.../exec
```

**AHORA (Seguro):**
```
Request URL: https://tudominio.com/api/validate-email
```

✅ Las URLs de AppScript NO aparecen en el inspector.

## 📂 Estructura de Archivos

```
Zoom/
├── .env.example          ← Plantilla de variables
├── .env.local            ← (NO COMMITTEAR) Tus URLs reales
├── .gitignore            ← Ignora .env.local
├── package.json          ← Dependencias Node.js
├── api/
│   └── server.js         ← Backend Express (proxy seguro)
├── sources/
│   ├── components/
│   │   └── configuracion/
│   │       └── conf.js   ← (ACTUALIZADO) Sin URLs hardcodeadas
│   └── views/
│       └── login/
│           └── login.js  ← (ACTUALIZADO) Usa validateEmailWithBackend()
└── vercel.json           ← Configuración Vercel
```

## 🛡️ Mejores Prácticas

1. **NUNCA** commits `.env` o `.env.local`
2. **SIEMPRE** usa `.env.example` para documentar qué variables necesita el proyecto
3. **En Vercel:** Usa el Dashboard para agregar variables (no en el código)
4. **En desarrollo:** Copia `.env.example` a `.env.local` y completa los valores
5. **Rotación de URLs:** Si una URL se expone, puedes cambiarla en una única variable de entorno
6. **Logs:** Nunca loguees variables sensibles

## 🚨 Si se expone una URL de AppScript

1. **Inmediatamente:** Deactiva el AppScript
2. **Crea uno nuevo** o regenera la URL
3. **Actualiza la variable** en Vercel y en `.env.local`
4. **Re-deploy:** `vercel --prod`

## 📞 Soporte

- Documentación Express: https://expressjs.com/
- Documentación Vercel: https://vercel.com/docs
- Variables de entorno dotenv: https://github.com/motdotla/dotenv

## ✅ Checklist Final

- [ ] `.env.local` creado con tus URLs de AppScript
- [ ] `npm install` ejecutado
- [ ] `npm run dev` funciona en localhost:3000
- [ ] Login funciona con backend local
- [ ] Variables de entorno agregadas en Vercel Dashboard
- [ ] `vercel --prod` desplegado
- [ ] Verificaste que URLs AppScript NO aparecen en DevTools
- [ ] `.env.local` está en `.gitignore`
