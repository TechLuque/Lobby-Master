// Configuración - 3 Apps Scripts diferentes
const APPS_SCRIPTS = [
  'https://script.google.com/macros/s/AKfycbyPjTaAQEWpI-uAVsEGKVtCklKcxNVa4H6tz5kVGaoUynvbwNOCN8owY243E7Ksgk5w/exec',  /*codigo*/
  'https://script.google.com/macros/s/AKfycbztxJqZlrHcDNksOZLkJoIYWr1fG9h_3iIFNFpGNW5I_nFLv0ra1jV_-7gOua0VSlCl/exec',  /*maquina*/
  'https://script.google.com/macros/s/AKfycbwpG_3bPvdvDNA25TgyYC6GBs0KZgNdfPG7cZvGV2p3rdgAWjtKls5l_QSvV21lbZuE/exec'   /*maestria*/
];
const REDIRECT_PAGE = '../lobby/lobby.html';

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim().toLowerCase();
  const errorDiv = document.getElementById('errorMessage');
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  if (!email) {
    showError(errorDiv, 'Por favor ingresa un email.');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando...';
  
  try {
    // Validar contra los 3 Apps Scripts en paralelo
    const results = await Promise.all(
      APPS_SCRIPTS.map(url => validateEmailInServer(url, email))
    );
    
    // Guardar los resultados manteniendo los índices originales
    // accessibleServers[0] = resultado del Apps Script 1 (código)
    // accessibleServers[1] = resultado del Apps Script 2 (máquina)
    // accessibleServers[2] = resultado del Apps Script 3 (maestría)
    const accessibleServers = results.map(r => (r && r.ok) ? r : null);
    
    // Verificar si al menos 1 tiene acceso
    const hasAccess = accessibleServers.some(s => s !== null);
    
    if (hasAccess) {
      // Si al menos 1 Apps Script valida el email, permitir acceso
      localStorage.setItem('userEmail', email);
      localStorage.setItem('accessibleServers', JSON.stringify(accessibleServers));
      
      // Guardar whatsapp del primer servidor que respondió
      const firstValidServer = accessibleServers.find(s => s !== null);
      if (firstValidServer && firstValidServer.whatsapp) {
        localStorage.setItem('whatsapp', firstValidServer.whatsapp);
      }
      
      hideError(errorDiv);
      window.location.href = REDIRECT_PAGE;
    } else {
      // Si ninguno valida, mostrar error
      showError(errorDiv, 'Email no autorizado en ningún servidor.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'INGRESAR<span class="arrow">→</span>';
    }
  } catch (error) {
    showError(errorDiv, 'Error conectando con los servidores.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'INGRESAR<span class="arrow">→</span>';
    console.error('Error:', error);
  }
}

/**
 * Valida email en un Apps Script específico
 */
async function validateEmailInServer(appScriptUrl, email) {
  try {
    const params = new URLSearchParams();
    params.append('email', email);
    
    const response = await fetch(appScriptUrl, {
      method: 'POST',
      body: params
    });
    
    const data = await response.json();
    return data; // Retorna { ok: true/false, error?: string }
  } catch (error) {
    console.error('Error en servidor ' + appScriptUrl, error);
    return null; // Si hay error, retorna null
  }
}

function showError(element, message) {
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

function hideError(element) {
  if (element) {
    element.textContent = '';
    element.style.display = 'none';
  }
}