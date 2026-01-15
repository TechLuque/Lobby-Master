/**
 * VERCEL SERVERLESS FUNCTION - POST /api/validate-email
 * Proxy seguro para AppScripts
 * 
 * Variables de entorno en Vercel Dashboard:
 * - APPSCRIPT_CODIGO
 * - APPSCRIPT_MAQUINA
 * - APPSCRIPT_MAESTRIA
 */

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check (GET)
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'OK',
      message: 'API /api/validate-email funcionando',
      timestamp: new Date().toISOString(),
      variables: {
        APPSCRIPT_CODIGO: process.env.APPSCRIPT_CODIGO ? '✅ Configurada' : '❌ NO configurada',
        APPSCRIPT_MAQUINA: process.env.APPSCRIPT_MAQUINA ? '✅ Configurada' : '❌ NO configurada',
        APPSCRIPT_MAESTRIA: process.env.APPSCRIPT_MAESTRIA ? '✅ Configurada' : '❌ NO configurada'
      }
    });
  }

  // Validar email (POST)
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      console.log(`[DEBUG] Email recibido: ${email}`);
      console.log(`[DEBUG] APPSCRIPT_CODIGO: ${process.env.APPSCRIPT_CODIGO ? 'Existe' : 'No existe'}`);
      console.log(`[DEBUG] APPSCRIPT_MAQUINA: ${process.env.APPSCRIPT_MAQUINA ? 'Existe' : 'No existe'}`);
      console.log(`[DEBUG] APPSCRIPT_MAESTRIA: ${process.env.APPSCRIPT_MAESTRIA ? 'Existe' : 'No existe'}`);

      if (!email) {
        return res.status(400).json({ 
          hasAccess: false, 
          error: 'Email es requerido' 
        });
      }

      // URLs de AppScript desde variables de entorno de Vercel
      const appScripts = [
        process.env.APPSCRIPT_CODIGO,
        process.env.APPSCRIPT_MAQUINA,
        process.env.APPSCRIPT_MAESTRIA
      ];

      // Validar que las variables están configuradas
      if (appScripts.some(url => !url)) {
        console.error('❌ ERROR: Variables de entorno APPSCRIPT_* no configuradas en Vercel');
        return res.status(500).json({ 
          hasAccess: false, 
          error: 'Variables de entorno no configuradas en Vercel Dashboard',
          debug: {
            APPSCRIPT_CODIGO: process.env.APPSCRIPT_CODIGO ? 'OK' : 'FALTA',
            APPSCRIPT_MAQUINA: process.env.APPSCRIPT_MAQUINA ? 'OK' : 'FALTA',
            APPSCRIPT_MAESTRIA: process.env.APPSCRIPT_MAESTRIA ? 'OK' : 'FALTA'
          }
        });
      }

      console.log('[DEBUG] Iniciando validación contra 3 AppScripts...');

      // Validar contra los 3 AppScripts en paralelo
      const results = await Promise.all(
        appScripts.map((url, index) => {
          console.log(`[DEBUG] Validando AppScript ${index + 1}...`);
          return validateWithAppScript(url, email);
        })
      );

      console.log('[DEBUG] Resultados:', results);

      // Procesar resultados
      const accessibleServers = results.map((r, index) => {
        if (r && r.ok) {
          console.log(`[DEBUG] AppScript ${index + 1}: Acceso permitido`);
          return {
            ok: r.ok,
            join_url: r.join_url,
            whatsapp: r.whatsapp
          };
        }
        console.log(`[DEBUG] AppScript ${index + 1}: Acceso denegado o error`);
        return null;
      });

      const hasAccess = accessibleServers.some(s => s !== null);
      const whatsapp = results.find(r => r && r.whatsapp)?.whatsapp || null;

      return res.status(200).json({
        hasAccess,
        accessibleServers,
        whatsapp,
        error: hasAccess ? null : 'Email no autorizado en ningún servidor'
      });

    } catch (error) {
      console.error('❌ Error en /api/validate-email:', error.message);
      console.error(error);
      return res.status(500).json({ 
        hasAccess: false, 
        error: 'Error en el servidor: ' + error.message
      });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

/**
 * Valida email en un AppScript específico
 */
async function validateWithAppScript(appScriptUrl, email) {
  try {
    console.log(`[DEBUG] Conectando a: ${appScriptUrl.substring(0, 50)}...`);
    
    const params = new URLSearchParams();
    params.append('email', email);

    const response = await fetch(appScriptUrl, {
      method: 'POST',
      body: params,
      timeout: 10000
    });

    console.log(`[DEBUG] Respuesta del AppScript: Status ${response.status}`);

    if (!response.ok) {
      console.log(`[DEBUG] Response no OK: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`[DEBUG] Datos del AppScript:`, data);
    return data;
  } catch (error) {
    console.error(`[DEBUG] Error conectando a AppScript:`, error.message);
    return null;
  }
}
