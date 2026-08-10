/* ==========================================
   BRAINLYHUB - CORE APP INITIALIZATION
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndLayoutState();
  initSidebarToggle();
  initHeaderDropdowns();
  initContactRedirectModal();
  checkAuthSession();

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

  renderNotificationsUI();
}

/* ==========================================
   BRAINLYHUB - GOOGLE AUTHENTICATION SYSTEM
   ========================================== */

function handleGoogleLogin(response) {
  if (!response || !response.credential) return;

  try {
    const payload = parseJwt(response.credential);
    const name = payload.name || payload.given_name || 'Google User';
    const email = payload.email || '';
    const picture = payload.picture || '';

    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_avatar', picture);
    localStorage.setItem('is_logged_in', 'true');

    applyUserProfileUI(name, email, picture);
  } catch (err) {
    console.error('Failed to process Google login:', err);
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

function applyUserProfileUI(name, email, picture) {
  const nameEl = document.getElementById('header-user-name');
  const roleEl = document.getElementById('header-user-role');
  const avatarEl = document.getElementById('header-avatar');
  const signinBtn = document.querySelector('.g_id_signin');
  const logoutBtn = document.getElementById('btn-google-logout');

  if (nameEl) nameEl.textContent = name;
  if (roleEl) roleEl.textContent = email || 'Google Account';

  if (avatarEl) {
    if (picture) {
      avatarEl.innerHTML = `<img src="${picture}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />`;
    } else {
      avatarEl.textContent = name.charAt(0).toUpperCase();
    }
  }

  if (signinBtn) signinBtn.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'block';
}

function handleGoogleLogout() {
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_avatar');
  localStorage.removeItem('is_logged_in');

  const nameEl = document.getElementById('header-user-name');
  const roleEl = document.getElementById('header-user-role');
  const avatarEl = document.getElementById('header-avatar');
  const signinBtn = document.querySelector('.g_id_signin');
  const logoutBtn = document.getElementById('btn-google-logout');

  if (nameEl) nameEl.textContent = 'Student Account';
  if (roleEl) roleEl.textContent = 'High School Member';
  if (avatarEl) avatarEl.textContent = 'S';

  if (signinBtn) signinBtn.style.display = 'block';
  if (logoutBtn) logoutBtn.style.display = 'none';
}

function checkAuthSession() {
  if (localStorage.getItem('is_logged_in') === 'true') {
    const name = localStorage.getItem('user_name') || 'Student Account';
    const email = localStorage.getItem('user_email') || '';
    const picture = localStorage.getItem('user_avatar') || '';
    applyUserProfileUI(name, email, picture);
  } else {
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
}

/* ==========================================
   LAYOUT & INTERACTION CONTROLLERS
   ========================================== */

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
