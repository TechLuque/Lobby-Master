/**
 * CONFIGURACIÓN DE APLICACIÓN
 * Las URLs de AppScript se cargan desde un servidor backend (API) en lugar de estar hardcodeadas
 * Esto previene la exposición de URLs sensibles en el inspector de redes del navegador
 */

// URL base del API Backend (cambia según el entorno)
// En producción en Vercel: https://tu-dominio.vercel.app/api
// En desarrollo local: http://localhost:3000/api
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : `${window.location.protocol}//${window.location.hostname}/api`;

/**
 * Valida email contra los 3 AppScripts (ahora a través del backend)
 * @param {string} email - Email a validar
 * @returns {Promise} Respuesta del servidor
 */
async function validateEmailWithBackend(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/validate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error validando email:', error);
    throw error;
  }
}

const REDIRECT_PAGE = '../lobby/lobby.html';
