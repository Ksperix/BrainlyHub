/* ==========================================
   BRAINLYHUB - CORE APPLICATION LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicjalizacja motywu, koloru akcentu i danych użytkownika
  loadGlobalPreferences();

  // 2. Inicjalizacja modułów interfejsu
  initSidebar();
  initHeaderDropdowns();
  initFaviconSwitcher();
});

/**
 * Wczytuje i nakłada motyw, kolor akcentu oraz dane profilu z localStorage na KAŻDEJ podstronie
 */
function loadGlobalPreferences() {
  const savedTheme = localStorage.getItem('app_theme') || 'light';
  const savedAccent = localStorage.getItem('app_accent') || '#1e3a8a';
  const savedName = localStorage.getItem('user_name') || 'Student Account';

  // Nakładanie motywu Ciemny/Jasny
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  // Nakładanie koloru akcentu
  document.documentElement.style.setProperty('--primary', savedAccent);

  // Aktualizacja danych użytkownika w nagłówku
  const nameElement = document.getElementById('header-user-name');
  const avatarElement = document.getElementById('header-avatar');
  if (nameElement) nameElement.textContent = savedName;
  if (avatarElement) avatarElement.textContent = savedName.charAt(0).toUpperCase();
}

/**
 * Obsługa zwijania/rozwijania paska bocznego (Sidebar)
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
 * Obsługa menu rozwijanych w nagłówku (Powiadomienia i Profil)
 */
function initHeaderDropdowns() {
  const btnNotif = document.getElementById('btn-notifications');
  const dropdownNotif = document.getElementById('dropdown-notifications');
  const btnProfile = document.getElementById('btn-user-profile');
  const dropdownProfile = document.getElementById('dropdown-profile');
  const notifBadge = document.getElementById('notif-badge');
  const btnClearNotifs = document.getElementById('btn-clear-notifs');
  const notifList = document.getElementById('notif-list');

  const hasVisitedBefore = localStorage.getItem('has_visited_before');
  const isWelcomeRead = localStorage.getItem('notif_welcome_read') === 'true';

  if (!hasVisitedBefore) {
    localStorage.setItem('has_visited_before', 'true');
    renderWelcomeNotification(notifList, notifBadge);
  } else if (!isWelcomeRead) {
    renderWelcomeNotification(notifList, notifBadge);
  } else {
    hideWelcomeNotification(notifList, notifBadge);
  }

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

  if (btnClearNotifs) {
    btnClearNotifs.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('notif_welcome_read', 'true');
      hideWelcomeNotification(notifList, notifBadge);
    });
  }

  document.addEventListener('click', () => {
    dropdownNotif?.classList.remove('show');
    dropdownProfile?.classList.remove('show');
  });
}

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
 * Zmienia ikonę favicon na odcienie szarości przy zmianie aktywnej karty przeglądarki
 */
function initFaviconSwitcher() {
  const favicon = document.getElementById('favicon');
  if (!favicon) return;

  const originalSrc = favicon.href;
  let grayscaleSrc = null;

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = originalSrc;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }

    ctx.putImageData(imgData, 0, 0);
    grayscaleSrc = canvas.toDataURL('image/png');
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (grayscaleSrc) favicon.href = grayscaleSrc;
    } else {
      favicon.href = originalSrc;
    }
  });
}
