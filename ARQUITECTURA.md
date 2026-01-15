# 🏗️ Diagrama de Arquitectura - Sistema Seguro

## Comparación: Antes vs Después

### ❌ ARQUITECTURA ANTERIOR (INSEGURA)

```
┌─────────────────────────────────────────────────────────┐
│                     NAVEGADOR CLIENTE                    │
│  (Cualquier persona puede inspeccionar)                  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ JavaScript - login.js                              │ │
│  │                                                    │ │
│  │ const APPS_SCRIPTS = [                            │ │
│  │   'https://script.google.com/...AKfycbyPjT..',   │ │  ← ❌ URL EXPUESTA
│  │   'https://script.google.com/...AKfycbztxJq..',   │ │  ← ❌ URL EXPUESTA  
│  │   'https://script.google.com/...AKfycbyeNP0..',   │ │  ← ❌ URL EXPUESTA
│  │ ]                                                 │ │
│  │                                                    │ │
│  │ fetch(APPS_SCRIPTS[0], { POST email })          │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ Petición visible en DevTools (F12)
                       │ Method: POST
                       │ URL: https://script.google.com/macros/s/AKfycby.../exec
                       │ Body: { email: "usuario@example.com" }
                       │
                       │ ⚠️ RIESGO: Cualquiera puede:
                       │    • Ver la URL completa
                       │    • Copiar la URL y usarla
                       │    • Acceder a los datos sin autorización
                       │    • Enviar spam/requests masivos
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Google AppScript            │
        │  (Valida email)              │
        │  Retorna: { ok, join_url }   │
        └──────────────────────────────┘
```

---

### ✅ ARQUITECTURA NUEVA (SEGURA)

```
┌─────────────────────────────────────────────────────────┐
│                     NAVEGADOR CLIENTE                    │
│  (Inspector NO muestra URLs de AppScript)               │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ JavaScript - login.js                              │ │
│  │                                                    │ │
│  │ const API_BASE_URL = 'https://tudominio.com/api'│ │
│  │                                                    │ │
│  │ fetch(`${API_BASE_URL}/validate-email`, {        │ │
│  │   method: 'POST',                                │ │
│  │   body: { email: 'usuario@example.com' }         │ │
│  │ })                                                │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ ✅ Petición segura
                       │ URL: https://tudominio.com/api/validate-email
                       │ (URLs de AppScript NO se exponen)
                       │
                       ▼
    ┌──────────────────────────────────────────────┐
    │  SERVIDOR BACKEND (API - Node.js + Express) │
    │  Corriendo en: https://tudominio.com        │
    │                                              │
    │  Endpoint: POST /api/validate-email         │
    │                                              │
    │  ┌──────────────────────────────────────┐   │
    │  │ require('dotenv').config()           │   │
    │  │                                      │   │
    │  │ const APP_SCRIPTS = {                │   │
    │  │   codigo: process.env.APPSCRIPT_CODIGO  │  ← Variables de entorno
    │  │   maquina: process.env.APPSCRIPT_MAQUINA│ ← (Nunca visibles)
    │  │   maestria: process.env.APPSCRIPT_...  │   ← (Solo en servidor)
    │  │ }                                    │   │
    │  └──────────────────────────────────────┘   │
    │                                              │
    │  Valida email contra 3 AppScripts           │
    │  Retorna datos al cliente                    │
    └──────────────────────────────────────────────┘
                       │
     ┌─────────────────┼─────────────────┐
     │                 │                 │
     ▼                 ▼                 ▼
  AppScript 1      AppScript 2      AppScript 3
  (Código)         (Máquina)        (Maestría)
  
  ✅ URLs están PROTEGIDAS en variables de entorno
     del servidor, NUNCA en el cliente
```

---

## 🔒 Flujo de Seguridad Detallado

```
┌─────────────────────────────────────────────────────────────────┐
│                      FLUJO DE LOGIN SEGURO                       │
└─────────────────────────────────────────────────────────────────┘

1. USUARIO INGRESA EMAIL
   ┌──────────────────────┐
   │ Usuario@example.com  │
   └──────────┬───────────┘
              │
              ▼
2. CLIENTE ENVÍA PETICIÓN (SEGURA)
   ┌────────────────────────────────────────────────────┐
   │ POST /api/validate-email                           │
   │ Body: { email: "usuario@example.com" }             │
   │                                                    │
   │ ✅ En DevTools se ve esto (URL segura)            │
   │ ❌ NO se ve URL de AppScript                       │
   └────────────────────────────┬──────────────────────┘
                                │
                                ▼
3. SERVIDOR RECIBE PETICIÓN
   ┌────────────────────────────────────────────────────┐
   │ api/server.js - POST /api/validate-email handler   │
   │                                                    │
   │ // Lee variables de entorno (NUNCA expuestas)      │
   │ const appScriptUrl = process.env.APPSCRIPT_CODIGO  │
   └────────────────────────────┬──────────────────────┘
                                │
                                ▼
4. SERVIDOR VALIDA CON AppScripts (INTERNO)
   ┌────────────────────────────────────────────────────┐
   │ El servidor hace petición interna a AppScripts     │
   │ Esta petición NO es visible al cliente             │
   │                                                    │
   │ fetch(appScriptUrl, {                              │
   │   method: 'POST',                                  │
   │   body: { email: "usuario@example.com" }           │
   │ })                                                 │
   │                                                    │
   │ ✅ Esta petición es segura (servidor a servidor)  │
   └────────────────────────────┬──────────────────────┘
                                │
                                ▼
5. AppScripts RESPONDEN
   ┌────────────────────────────────────────────────────┐
   │ AppScript 1: { ok: true, join_url: "...", ... }   │
   │ AppScript 2: { ok: false }                         │
   │ AppScript 3: { ok: true, join_url: "...", ... }   │
   └────────────────────────────┬──────────────────────┘
                                │
                                ▼
6. SERVIDOR PROCESA RESPUESTAS
   ┌────────────────────────────────────────────────────┐
   │ app/server.js: Procesa resultados                  │
   │                                                    │
   │ const accessibleServers = [                        │
   │   { ok: true, ... },  // Usuario puede acceder     │
   │   null,               // Sin acceso                │
   │   { ok: true, ... }   // Usuario puede acceder     │
   │ ]                                                  │
   │                                                    │
   │ Retorna al cliente (SIN URLs de AppScript)         │
   └────────────────────────────┬──────────────────────┘
                                │
                                ▼
7. CLIENTE RECIBE RESPUESTA SEGURA
   ┌────────────────────────────────────────────────────┐
   │ {                                                  │
   │   hasAccess: true,                                 │
   │   accessibleServers: [ {...}, null, {...} ],      │
   │   whatsapp: "573176484451"                         │
   │ }                                                  │
   │                                                    │
   │ ✅ Solo datos, NO URLs de AppScript                │
   └────────────────────────────┬──────────────────────┘
                                │
                                ▼
8. USUARIO AUTENTICADO
   ┌────────────────────────────────────────────────────┐
   │ localStorage.setItem('accessibleServers', ...)    │
   │ window.location.href = '/lobby.html'              │
   │                                                    │
   │ ✅ ACCESO OTORGADO DE FORMA SEGURA                │
   └────────────────────────────────────────────────────┘
```

---

## 📊 Comparación de Seguridad

| Aspecto | Antes ❌ | Después ✅ |
|---------|----------|-----------|
| **URLs de AppScript** | Visibles en JavaScript | En variables de entorno |
| **En Inspector de Red** | SI (anyone puede verlas) | NO (solo API del dominio) |
| **Acceso a URLs** | Directo desde navegador | Solo desde servidor |
| **Protección de datos** | No | SI (servidor valida) |
| **Rotación de URLs** | Requiere cambiar código | Solo variable de entorno |
| **Rate limiting** | No (cualquiera puede spam) | SI (en servidor) |
| **Auditoría** | No | SI (logs en servidor) |

---

## 🔐 Variables de Entorno - Flujo

```
┌──────────────────────────┐
│  .env.example (Público)  │
│  - Documentación         │
│  - Estructura            │
│  - Sin valores reales    │
└────────────┬─────────────┘
             │ Copiar (sin valores)
             │
             ▼
┌──────────────────────────────────┐
│  .env.local (Local - Privado)    │
│  .gitignore                      │
│  - URLs REALES de AppScript      │
│  - NUNCA committear              │
│  - Solo en tu computadora        │
└────────────┬─────────────────────┘
             │ Local development
             │
             ▼
┌──────────────────────────────────┐
│  Vercel Environment Variables    │
│  (Dashboard)                     │
│  - URLs REALES de AppScript      │
│  - Configuradas en Vercel        │
│  - NO en el código                │
│  - Cifradas por Vercel           │
└────────────┬─────────────────────┘
             │ Production
             │
             ▼
┌──────────────────────────────────┐
│  process.env (En servidor)       │
│  - Node.js carga las variables   │
│  - Disponibles solo en servidor  │
│  - Nunca en cliente JavaScript   │
└──────────────────────────────────┘
```

---

## ⚡ Ventajas de Esta Arquitectura

### 1. **Seguridad** 🔒
- URLs nunca se exponen en el cliente
- Variables de entorno del servidor
- Datos sensibles protegidos

### 2. **Escalabilidad** 📈
- Backend puede agregar lógica
- Rate limiting
- Caching
- Autenticación adicional

### 3. **Mantenimiento** 🔧
- Cambiar URLs es trivial (una variable)
- No requiere redeploy del cliente
- Fácil A/B testing

### 4. **Auditoría** 📋
- Logs en servidor
- Registro de accesos
- Seguridad mejorada

### 5. **Protección contra abuso** 🛡️
- Rate limiting en servidor
- Validación robusta
- Bloqueo de IPs maliciosas

---

## 🚀 Próximos Pasos Recomendados

1. **Rate Limiting**
   ```javascript
   npm install express-rate-limit
   ```

2. **Logging**
   ```javascript
   npm install winston
   ```

3. **CORS mejorado**
   ```javascript
   // Permitir solo tu dominio
   cors({ origin: 'https://tudominio.com' })
   ```

4. **HTTPS obligatorio**
   ```javascript
   // Redirigir HTTP a HTTPS
   ```

---

**Diagrama actualizado:** Enero 2026
