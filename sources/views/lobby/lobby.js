const SERVER_TO_LOBBY = {
  0: 1, // Apps Script 1 → Sala 1
  1: 2, // Apps Script 2 → Sala 2
  2: 3  // Apps Script 3 → Sala 3
};

let accessibleLobbies = [];
let whatsappNumber = '573176484451';

/**
 * Acceder a una sala específica
 */
function accessLobby(lobbyNumber) {
  console.log('🔍 accessLobby llamado con:', lobbyNumber);
  
  const userEmail = localStorage.getItem('userEmail');
  console.log('📧 Email desde localStorage:', userEmail);
  console.log('📋 Salas accesibles:', accessibleLobbies);
  
  if (!userEmail) {
    console.warn('⚠️ No hay usuario, redirigiendo a login');
    window.location.href = '../login/login.html';
    return;
  }
  
  try {
    // Verificar si tiene acceso
    if (!accessibleLobbies.includes(lobbyNumber)) {
      console.warn('❌ Sin acceso a sala:', lobbyNumber);
      showAccessDeniedModal();
      return;
    }
    
    const lobbyPages = {
      1: '../codigo/codigo.html',
      2: '../maquina/maquina.html',
      3: '../maestria/maestria.html'
    };
    
    console.log('✅ Redirigiendo a:', lobbyPages[lobbyNumber]);
    
    localStorage.setItem('currentLobby', lobbyNumber);
    localStorage.setItem('currentLobbyAccess', new Date().toISOString());
    
    window.location.href = lobbyPages[lobbyNumber];
    
  } catch (error) {
    console.error('💥 Error accediendo a sala:', error);
    alert('Error al acceder a la sala');
  }
}

/**
 * Mostrar modal de acceso denegado
 */
function showAccessDeniedModal() {
  const modal = document.getElementById('noAccessModal');
  if (modal) {
    modal.style.display = 'flex';
    console.log('📱 Modal de acceso denegado mostrado');
  }
}

/**
 * Cerrar modal de acceso denegado
 */
function closeNoAccessModal() {
  const modal = document.getElementById('noAccessModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Inicializar event listeners (compatible con webflow)
 */
function initializeButtons() {
  console.log('🚀 Inicializando botones...');
  
  const buttons = document.querySelectorAll('.access-btn');
  console.log('🔘 Botones encontrados:', buttons.length);
  
  buttons.forEach((button, index) => {
    const lobbyNum = button.getAttribute('data-lobby');
    console.log(`Botón ${index}: data-lobby=${lobbyNum}`);
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('👆 Click en botón con lobby:', lobbyNum);
      accessLobby(parseInt(lobbyNum));
    });
  });
}

/**
 * Inicializar la página
 */
function initializeLobby() {
  console.log('🎬 Inicializando Lobby...');
  
  const userEmail = localStorage.getItem('userEmail');
  const accessibleServersJSON = localStorage.getItem('accessibleServers');
  
  console.log('📊 Estado localStorage:', {
    userEmail: userEmail ? '✓' : '✗',
    accessibleServers: accessibleServersJSON ? '✓' : '✗'
  });
  
  if (!userEmail || !accessibleServersJSON) {
    console.warn('⚠️ Usuario no autenticado, redirigiendo...');
    // Comentar para testing
    // window.location.href = '../login/login.html';
    // return;
  }
  
  try {
    const accessibleServers = JSON.parse(accessibleServersJSON || '[]');
    console.log('🔐 Servidores accesibles:', accessibleServers);
    
    accessibleLobbies = accessibleServers
      .map((server, index) => server !== null ? SERVER_TO_LOBBY[index] : null)
      .filter(x => x !== null);
    
    console.log('✅ Salas accesibles mapeadas:', accessibleLobbies);
    
    const savedWhatsapp = localStorage.getItem('whatsapp');
    if (savedWhatsapp) {
      whatsappNumber = savedWhatsapp.replace(/[^0-9+]/g, '');
      const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
      if (modalWhatsappBtn) {
        modalWhatsappBtn.href = 'https://wa.me/' + whatsappNumber + '?text=Necesito%20ayuda%20para%20entrar%20a%20una%20sesi%C3%B3n';
      }
    }
    
  } catch (error) {
    console.error('💥 Error procesando datos:', error);
  }
  
  // Inicializar botones después de que webflow renderice
  initializeButtons();
}

// Ejecutar cuando DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLobby);
} else {
  initializeLobby();
}

// También ejecutar después de un pequeño delay para asegurar que webflow terminó
setTimeout(initializeLobby, 500);