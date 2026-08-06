/* ==========================================
   BRAINLYHUB - CORE APPLICATION LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initHeaderDropdowns();
  loadUserProfile();
});

/**
 * Handles sidebar collapse logic
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('btn-toggle-sidebar');

  if (!sidebar || !toggleBtn) return;

  const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.add('is-animating');
    sidebar.classList.toggle('collapsed');
    
    const collapsedState = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar_collapsed', collapsedState);

    setTimeout(() => {
      sidebar.classList.remove('is-animating');
    }, 250);
  });
}

/**
 * Handles header dropdown menus (Notifications & Profile)
 */
function initHeaderDropdowns() {
  const btnNotif = document.getElementById('btn-notifications');
  const dropdownNotif = document.getElementById('dropdown-notifications');
  const btnProfile = document.getElementById('btn-user-profile');
  const dropdownProfile = document.getElementById('dropdown-profile');
  const notifBadge = document.getElementById('notif-badge');
  const btnClearNotifs = document.getElementById('btn-clear-notifs');
  const notifList = document.getElementById('notif-list');

  // Sprawdzanie wyczyszczenia powiadomień
  const isNotifCleared = localStorage.getItem('notifs_cleared') === 'true';
  if (isNotifCleared && notifBadge) {
    notifBadge.style.display = 'none';
    if (notifList) {
      notifList.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); padding: 8px; text-align: center;">No new notifications.</div>`;
    }
  }

  // Toggle powiadomień
  if (btnNotif && dropdownNotif) {
    btnNotif.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownProfile?.classList.remove('show');
      dropdownNotif.classList.toggle('show');
    });
    
    // Zapobiegaj zamykaniu menu po kliknięciu w jego wnętrze
    dropdownNotif.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Toggle profilu
  if (btnProfile && dropdownProfile) {
    btnProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownNotif?.classList.remove('show');
      dropdownProfile.classList.toggle('show');
    });

    dropdownProfile.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Czyszczenie powiadomień
  if (btnClearNotifs) {
    btnClearNotifs.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('notifs_cleared', 'true');
      if (notifBadge) notifBadge.style.display = 'none';
      if (notifList) {
        notifList.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); padding: 8px; text-align: center;">No new notifications.</div>`;
      }
    });
  }

  // Zamykanie menu po kliknięciu gdziekolwiek na stronie
  document.addEventListener('click', () => {
    dropdownNotif?.classList.remove('show');
    dropdownProfile?.classList.remove('show');
  });
}

/**
 * Wczytywanie profilu z localStorage
 */
function loadUserProfile() {
  const nameElement = document.getElementById('header-user-name');
  const avatarElement = document.getElementById('header-avatar');
  
  const savedName = localStorage.getItem('user_name') || 'Student Account';
  if (nameElement) nameElement.textContent = savedName;
  if (avatarElement) avatarElement.textContent = savedName.charAt(0).toUpperCase();
}
