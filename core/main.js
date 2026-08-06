/* ==========================================
   BRAINLYHUB - CORE APPLICATION LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initHeaderDropdowns();
  loadUserProfile();
});

/**
 * Obsługa zwijania paska bocznego (Sidebar)
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
 * Obsługa powiadomień (Welcome logic) oraz menu rozwijanych
 */
function initHeaderDropdowns() {
  const btnNotif = document.getElementById('btn-notifications');
  const dropdownNotif = document.getElementById('dropdown-notifications');
  const btnProfile = document.getElementById('btn-user-profile');
  const dropdownProfile = document.getElementById('dropdown-profile');
  const notifBadge = document.getElementById('notif-badge');
  const btnClearNotifs = document.getElementById('btn-clear-notifs');
  const notifList = document.getElementById('notif-list');

  // Sprawdzenie, czy to pierwsza wizyta użytkownika w historii
  const hasVisitedBefore = localStorage.getItem('has_visited_before');
  const isWelcomeRead = localStorage.getItem('notif_welcome_read') === 'true';

  if (!hasVisitedBefore) {
    // Pierwsza wizyta w historii - dodajemy flagę pierwszej wizyty
    localStorage.setItem('has_visited_before', 'true');
    renderWelcomeNotification(notifList, notifBadge);
  } else if (!isWelcomeRead) {
    // Kolejne przejście między podstronami, ale użytkownik jeszcze nie wyczyścił powitania
    renderWelcomeNotification(notifList, notifBadge);
  } else {
    // Użytkownik jest powracający i wyczyścił powiadomienie - ukrywamy kropkę i powiadomienia
    hideWelcomeNotification(notifList, notifBadge);
  }

  // Otwieranie / zamykanie powiadomień
  if (btnNotif && dropdownNotif) {
    btnNotif.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownProfile?.classList.remove('show');
      dropdownNotif.classList.toggle('show');
    });

    dropdownNotif.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Otwieranie / zamykanie profilu
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

  // Czyszczenie powiadomień przez przycisk Clear All
  if (btnClearNotifs) {
    btnClearNotifs.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('notif_welcome_read', 'true');
      hideWelcomeNotification(notifList, notifBadge);
    });
  }

  // Zamykanie menu rozwijanych po kliknięciu poza nimi
  document.addEventListener('click', () => {
    dropdownNotif?.classList.remove('show');
    dropdownProfile?.classList.remove('show');
  });
}

/**
 * Renderuje kartę powitalną oraz czerwoną kropkę
 */
function renderWelcomeNotification(container, badge) {
  if (badge) badge.style.display = 'block';
  if (container) {
    container.innerHTML = `
      <div class="notification-card">
        <div class="notif-icon-wrapper">
          <img src="assets/Home star.png" style="width: 16px; height: 16px;" alt="Star" />
        </div>
        <div class="notif-content">
          <span class="notif-title">Welcome to BrainlyHub!</span>
          <span class="notif-desc">Your ultimate academic repository. Select a subject to explore tasks.</span>
          <span class="notif-time">First visit</span>
        </div>
      </div>
    `;
  }
}

/**
 * Ukrywa czerwoną kropkę i czyści listę
 */
function hideWelcomeNotification(container, badge) {
  if (badge) badge.style.display = 'none';
  if (container) {
    container.innerHTML = `
      <div style="font-size: 0.8rem; color: var(--text-muted); padding: 12px; text-align: center;">
        No new notifications.
      </div>
    `;
  }
}

/**
 * Wczytywanie profilu użytkownika
 */
function loadUserProfile() {
  const nameElement = document.getElementById('header-user-name');
  const avatarElement = document.getElementById('header-avatar');
  
  const savedName = localStorage.getItem('user_name') || 'Student Account';
  if (nameElement) nameElement.textContent = savedName;
  if (avatarElement) avatarElement.textContent = savedName.charAt(0).toUpperCase();
}
