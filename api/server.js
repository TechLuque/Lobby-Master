/**
 * API BACKEND - Proxy seguro para AppScripts
 * Mantiene las URLs de AppScript ocultas (variable de entorno)
 * Los clientes solo ven peticiones a este servidor, NO a AppScript
 * 
 * Instalación:
 * npm install express dotenv cors
 * 
 * Uso:
 * node api/server.js
 */

require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// URLs de AppScripts desde variables de entorno (NUNCA visibles en el cliente)
const APP_SCRIPTS = {
  codigo: process.env.APPSCRIPT_CODIGO,
  maquina: process.env.APPSCRIPT_MAQUINA,
  maestria: process.env.APPSCRIPT_MAESTRIA
};

// Validar que las variables están configuradas
if (!APP_SCRIPTS.codigo || !APP_SCRIPTS.maquina || !APP_SCRIPTS.maestria) {
  console.error('ERROR: Las variables de entorno APPSCRIPT_* no están configuradas.');
  console.error('Copia .env.example a .env.local y completa los valores.');
  process.exit(1);
}

/**
 * Endpoint: POST /api/validate-email
 * Valida un email contra los 3 AppScripts de forma segura
 * El cliente NO ve las URLs de AppScript
 */
app.post('/api/validate-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        hasAccess: false, 
        error: 'Email es requerido' 
      });
    }
    
    // Llamar a los 3 AppScripts en paralelo (desde el servidor, no desde el cliente)
    const results = await Promise.all([
      validateWithAppScript(APP_SCRIPTS.codigo, email),
      validateWithAppScript(APP_SCRIPTS.maquina, email),
      validateWithAppScript(APP_SCRIPTS.maestria, email)
    ]);
    
    // Procesar resultados
    const accessibleServers = results.map(r => 
      (r && r.ok) ? {
        ok: r.ok,
        join_url: r.join_url,
        whatsapp: r.whatsapp
      } : null
    );
    
    const hasAccess = accessibleServers.some(s => s !== null);
    const whatsapp = results.find(r => r && r.whatsapp)?.whatsapp || null;
    
    res.json({
      hasAccess,
      accessibleServers,
      whatsapp,
      error: hasAccess ? null : 'Email no autorizado'
    });
    
  } catch (error) {
    console.error('Error en /api/validate-email:', error);
    res.status(500).json({ 
      hasAccess: false, 
      error: 'Error en el servidor' 
    });
  }
});

/**
 * Valida email en un AppScript específico
 * Las respuestas del AppScript pasan por este servidor
 */
async function validateWithAppScript(appScriptUrl, email) {
  try {
    const params = new URLSearchParams();
    params.append('email', email);
    
    const response = await fetch(appScriptUrl, {
      method: 'POST',
      body: params
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error conectando a AppScript ${appScriptUrl}:`, error);
    return null;
  }
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * 404 - Rutas no encontradas
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API Backend corriendo en http://localhost:${PORT}`);
  console.log(`📝 Endpoint: POST http://localhost:${PORT}/api/validate-email`);
  console.log(`✅ Health: GET http://localhost:${PORT}/api/health`);
  console.log(`\n⚠️  Las URLs de AppScript están protegidas en variables de entorno`);
  console.log(`   y NO se exponen al cliente ni en el inspector de redes.`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
