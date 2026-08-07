/* ==========================================
   BRAINLYHUB - CORE APP INITIALIZATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndLayoutState();
  initSidebarToggle();
  initHeaderDropdowns();
  
  // Włączenie płynnych animacji dopiero po wyrenderowaniu stanu początkowego (brak spływającej animacji przy Ctrl+Shift+R)
  setTimeout(() => {
    document.body.classList.remove('preload-no-transition');
  }, 100);
});

/**
 * Wczytywanie ustawień z localStorage i natychmiastowe aplikowanie
 */
function initThemeAndLayoutState() {
  const savedTheme = localStorage.getItem('app_theme');
  const savedAccent = localStorage.getItem('app_accent');
  const isCompact = localStorage.getItem('compact_ui') === 'true';
  const isSidebarCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';

  // Motyw
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  // Kolor akcentu
  if (savedAccent) {
    document.documentElement.style.setProperty('--primary', savedAccent);
  }

  // Kompaktowy układ
  if (isCompact) {
    document.body.classList.add('compact-density');
  }

  // Stan sidebara
  const sidebar = document.getElementById('sidebar');
  if (sidebar && isSidebarCollapsed) {
    sidebar.classList.add('collapsed');
  }

  // Nagłówek profilu
  const savedName = localStorage.getItem('user_name');
  const savedRole = localStorage.getItem('user_role');
  if (savedName) {
    const nameEl = document.getElementById('header-user-name');
    const avatarEl = document.getElementById('header-avatar');
    if (nameEl) nameEl.textContent = savedName;
    if (avatarEl) avatarEl.textContent = savedName.charAt(0).toUpperCase();
  }
  if (savedRole) {
    const roleEl = document.getElementById('header-user-role');
    if (roleEl) roleEl.textContent = savedRole;
  }
}

/**
 * Przełącznik zwijania sidebara
 */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('btn-toggle-sidebar');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebar_collapsed', isCollapsed);
    });
  }
}

/**
 * Obsługa menu rozwijanych (Profile, Powiadomienia)
 */
function initHeaderDropdowns() {
  const notifBtn = document.getElementById('btn-notifications');
  const notifDropdown = document.getElementById('dropdown-notifications');
  
  const profileBtn = document.getElementById('btn-user-profile');
  const profileDropdown = document.getElementById('dropdown-profile');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (profileDropdown) profileDropdown.classList.remove('show');
      notifDropdown.classList.toggle('show');

      const badge = document.getElementById('notif-badge');
      if (badge) badge.style.display = 'none';
    });
  }

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (notifDropdown) notifDropdown.classList.remove('show');
      profileDropdown.classList.toggle('show');
    });
  }

  // Zamknij przy kliknięciu poza obszar
  document.addEventListener('click', (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBtn) {
      notifDropdown.classList.remove('show');
    }
    if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileBtn) {
      profileDropdown.classList.remove('show');
    }
  });

  const clearNotifsBtn = document.getElementById('btn-clear-notifs');
  if (clearNotifsBtn) {
    clearNotifsBtn.addEventListener('click', () => {
      const notifList = document.getElementById('notif-list');
      if (notifList) notifList.innerHTML = '';
    });
  }
}
