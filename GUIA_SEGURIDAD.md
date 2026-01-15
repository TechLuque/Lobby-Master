# 🔒 Guía de Seguridad - Sistema Protegido con Vercel

## ✅ Solución: Variables de Entorno en Vercel

Las URLs de AppScript están **protegidas en variables de entorno de Vercel** (no en el código).

```
┌─────────────────┐
│   Navegador     │  
│   (Cliente)     │ ← Las URLs de AppScript NO son visibles
└────────┬────────┘
         │ Petición a: /api/validate-email
         │
         ▼
┌──────────────────────────────────────┐
│   Vercel Serverless Function         │
│   (api/server.js)                    │
│                                      │
│   Lee variables de entorno:          │
│   - APPSCRIPT_CODIGO                 │
│   - APPSCRIPT_MAQUINA                │
│   - APPSCRIPT_MAESTRIA               │
│   (Nunca expuestas al cliente)       │
└────────┬─────────────────────────────┘
         │ Valida con AppScripts
         │ (Interno, seguro)
         │
         ▼
    ┌─────────────┐
    │  AppScript  │
    │  (Google)   │
    └─────────────┘
```

## 🚀 Pasos para Vercel

### 1. Verificar que tienes repositorio Git

```bash
git status
# Debe estar conectado a tu repositorio
```

### 2. Asegúrate que el código está en GitHub/GitLab

```bash
git add .
git commit -m "Agregar serverless functions con seguridad"
git push origin main
```

### 3. Ir a Vercel Dashboard

https://vercel.com/dashboard

### 4. Conectar repositorio y crear proyecto

1. **"Add New"** → **"Project"**
2. Selecciona tu repositorio
3. Click **"Import"**
4. Vercel detecta automáticamente la estructura

### 5. Agregar Variables de Entorno

1. En **Settings** → **Environment Variables**
2. Agrega 3 variables:

```
APPSCRIPT_CODIGO = https://script.google.com/macros/s/AKfycbyPjTa.../exec
APPSCRIPT_MAQUINA = https://script.google.com/macros/s/AKfycbztxJq.../exec
APPSCRIPT_MAESTRIA = https://script.google.com/macros/s/AKfycbyeNP0.../exec
```

3. Click **"Save"**

### 6. Deploy

```bash
# Vercel automáticamente despliega cuando haces git push
git push origin main

# O manualmente:
# Vercel Dashboard → "Deployments" → "Deploy Now"
```

## 🔍 Verificar que está seguro

### 1. Abre el sitio en Vercel
```
https://tu-proyecto.vercel.app
```

### 2. Abre DevTools (F12) → Tab "Network"

### 3. Intenta login

### 4. Observa las peticiones:
- ✅ Ves peticiones a: `/api/validate-email`
- ❌ NO ves peticiones a: `script.google.com`

## 📝 Estructura de Archivos

```
Proyecto/
├── api/
│   └── server.js           ← Serverless function (Vercel maneja esto)
├── sources/
│   ├── components/
│   │   └── configuracion/
│   │       └── conf.js     ← Apunta a /api/validate-email
│   └── views/
│       └── login/
│           └── login.js    ← Usa validateEmailWithBackend()
├── .env.example            ← Solo documentación
├── .gitignore              ← Ignora variables sensibles
├── package.json            ← Sin dependencias locales
└── vercel.json             ← Config de Vercel
```

## ✨ Ventajas

1. **Sin servidor local** - Todo en la nube
2. **URLs protegidas** - Solo en Vercel, no en el código
3. **Auto-deploy** - Git push = automático en Vercel
4. **Escalable** - Vercel maneja el tráfico
5. **Seguro** - Variables cifradas por Vercel

## 🛑 Si una URL se expone

1. Regenera la URL en AppScript
2. Ve a Vercel Dashboard
3. Actualiza la variable de entorno
4. **Ya está** - Automáticamente en la próxima solicitud

## ❓ Preguntas Frecuentes

**¿Necesito ejecutar algo localmente?**
No, todo se ejecuta en Vercel.

**¿Cómo se actualizan las variables?**
En Vercel Dashboard → Settings → Environment Variables

**¿Es gratis?**
Sí, Vercel tiene plan gratuito con serverless functions.

**¿Las URLs están seguras?**
Sí, están en variables de entorno de Vercel, nunca en el código.

**¿Dónde se ven los logs?**
Vercel Dashboard → Proyecto → Deployments → Logs

---

**Sistema seguro implementado.** ✅

