/* ==========================================
   BRAINLYHUB - CORE APP INITIALIZATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndLayoutState();
  initSidebarToggle();
  initHeaderDropdowns();
  initContactRedirectModal();

  requestAnimationFrame(() => {
    document.documentElement.classList.remove('preload-collapsed');
    document.body.classList.remove('preload-no-transition');
  });
});

function initThemeAndLayoutState() {
  const savedTheme = localStorage.getItem('app_theme');
  const savedAccent = localStorage.getItem('app_accent');
  const isCompact = localStorage.getItem('compact_ui') === 'true';
  const isSidebarCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  if (savedAccent) {
    document.documentElement.style.setProperty('--primary', savedAccent);
  }

  if (isCompact) {
    document.body.classList.add('compact-density');
  }

  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    if (isSidebarCollapsed) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }
  }

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
  
  renderNotificationsUI();
}

function initSidebarToggle() {
  const toggleBtn = document.getElementById('btn-toggle-sidebar');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebar_collapsed', isCollapsed);
    });
  }
}

function renderNotificationsUI() {
  const notifList = document.getElementById('notif-list');
  if (!notifList) return;

  if (notifList.children.length === 0) {
    notifList.innerHTML = `<div class="notif-empty-state">No recent notifications</div>`;
  }
}

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
      if (notifList) {
        notifList.innerHTML = `<div class="notif-empty-state">No recent notifications</div>`;
      }
    });
  }
}

function initContactRedirectModal() {
  const contactLinks = document.querySelectorAll('a[href*="forms.gle"]');
  const modal = document.getElementById('modal-contact-redirect');
  const cancelBtn = document.getElementById('btn-cancel-contact-redirect');
  const timerElement = document.getElementById('contact-countdown-timer');
  const proceedLink = document.getElementById('contact-redirect-link');

  if (!modal) return;

  let countdownInterval = null;
  const targetUrl = 'https://forms.gle/o1daXvtw4zim5kDd7';

  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
      let seconds = 5;
      if (timerElement) timerElement.textContent = seconds;

      clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        seconds--;
        if (timerElement) timerElement.textContent = seconds;

        if (seconds <= 0) {
          clearInterval(countdownInterval);
          window.location.href = targetUrl;
        }
      }, 1000);
    });
  });

  const stopRedirect = () => {
    clearInterval(countdownInterval);
    modal.style.display = 'none';
  };

  if (cancelBtn) cancelBtn.addEventListener('click', stopRedirect);
  if (proceedLink) {
    proceedLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(countdownInterval);
      window.location.href = targetUrl;
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) stopRedirect();
  });
}
