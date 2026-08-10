/* ==========================================
   BRAINLYHUB - SHARED CORE MAIN CONTROLLER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Layout & Features
  initSidebarToggle();
  initHeaderDropdowns();
  initThemeAndAccent();
  initContactRedirectModal();
  initGlobalSearchAndStats();
});

/* ------------------------------------------
   1. SIDEBAR NAVIGATION TOGGLE
   ------------------------------------------ */
function initSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const btnToggle = document.getElementById('btn-toggle-sidebar');

  if (!sidebar || !btnToggle) return;

  // Restore state from LocalStorage
  const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
  } else {
    sidebar.classList.remove('collapsed');
  }

  // Remove preload class after initialization
  document.documentElement.classList.remove('preload-collapsed');
  document.body.classList.remove('preload-no-transition');

  btnToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const newCollapsedState = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar_collapsed', newCollapsedState);
  });
}

/* ------------------------------------------
   2. HEADER DROPDOWNS (Notifications & Profile)
   ------------------------------------------ */
function initHeaderDropdowns() {
  const btnNotifs = document.getElementById('btn-notifications');
  const dropdownNotifs = document.getElementById('dropdown-notifications');

  const btnProfile = document.getElementById('btn-user-profile');
  const dropdownProfile = document.getElementById('dropdown-profile');

  function closeAllDropdowns() {
    if (dropdownNotifs) dropdownNotifs.classList.remove('show');
    if (dropdownProfile) dropdownProfile.classList.remove('show');
  }

  if (btnNotifs && dropdownNotifs) {
    btnNotifs.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = dropdownNotifs.classList.contains('show');
      closeAllDropdowns();
      if (!isShowing) dropdownNotifs.classList.add('show');
    });
  }

  if (btnProfile && dropdownProfile) {
    btnProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShowing = dropdownProfile.classList.contains('show');
      closeAllDropdowns();
      if (!isShowing) dropdownProfile.classList.add('show');
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-dropdown') && !e.target.closest('.action-icon-btn')) {
      closeAllDropdowns();
    }
  });

  // Render header profile details from LocalStorage
  renderHeaderProfile();
  renderNotificationsList();
}

function renderHeaderProfile() {
  const savedProfile = JSON.parse(localStorage.getItem('user_profile_data') || '{}');
  const nameEl = document.getElementById('header-user-name');
  const roleEl = document.getElementById('header-user-role');
  const avatarEl = document.getElementById('header-avatar');

  if (nameEl && savedProfile.name) nameEl.textContent = savedProfile.name;
  if (roleEl && savedProfile.role) roleEl.textContent = savedProfile.role;
  if (avatarEl && savedProfile.name) avatarEl.textContent = savedProfile.name.charAt(0).toUpperCase();
}

function renderNotificationsList() {
  const notifListEl = document.getElementById('notif-list');
  const notifBadgeEl = document.getElementById('notif-badge');
  const btnClear = document.getElementById('btn-clear-notifs');

  if (!notifListEl) return;

  const notifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');

  if (notifs.length === 0) {
    notifListEl.innerHTML = '<div class="notif-empty-state">No recent notifications</div>';
    if (notifBadgeEl) notifBadgeEl.style.display = 'none';
    return;
  }

  if (notifBadgeEl) notifBadgeEl.style.display = 'block';

  notifListEl.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-icon-box">
        <img src="assets/${n.icon || 'Notifications.png'}" alt="Icon" />
      </div>
      <div class="notif-details">
        <span class="notif-title">${n.title}</span>
        <span class="notif-desc">${n.desc}</span>
        <span class="notif-time">${n.time}</span>
      </div>
    </div>
  `).join('');

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      localStorage.setItem('app_notifications', JSON.stringify([]));
      renderNotificationsList();
    });
  }
}

/* ------------------------------------------
   3. THEME & ACCENT COLOR CONTROLLER
   ------------------------------------------ */
function initThemeAndAccent() {
  const savedTheme = localStorage.getItem('app_theme') || 'light';
  const savedAccent = localStorage.getItem('app_accent_color') || '#1e3a8a';
  const savedCompact = localStorage.getItem('app_compact_ui') === 'true';

  applyTheme(savedTheme);
  applyAccentColor(savedAccent);
  applyCompactDensity(savedCompact);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  localStorage.setItem('app_theme', theme);
}

function applyAccentColor(color) {
  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--primary-hover', color);
  localStorage.setItem('app_accent_color', color);
}

function applyCompactDensity(isCompact) {
  if (isCompact) {
    document.body.classList.add('compact-density');
  } else {
    document.body.classList.remove('compact-density');
  }
  localStorage.setItem('app_compact_ui', isCompact);
}

/* ------------------------------------------
   4. EXTERNAL SUPPORT CONTACT REDIRECT MODAL
   ------------------------------------------ */
function initContactRedirectModal() {
  const modal = document.getElementById('modal-contact-redirect');
  const cancelBtn = document.getElementById('btn-cancel-contact-redirect');
  const countdownEl = document.getElementById('contact-countdown-timer');
  const redirectLink = document.getElementById('contact-redirect-link');
  
  if (!modal) return;

  let timerInterval = null;

  document.querySelectorAll('a[href*="forms.gle"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = link.getAttribute('href');
      if (redirectLink) redirectLink.setAttribute('href', targetUrl);
      
      modal.style.display = 'flex';
      let secondsLeft = 5;
      if (countdownEl) countdownEl.textContent = secondsLeft;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        secondsLeft--;
        if (countdownEl) countdownEl.textContent = secondsLeft;
        if (secondsLeft <= 0) {
          clearInterval(timerInterval);
          window.open(targetUrl, '_blank');
          modal.style.display = 'none';
        }
      }, 1000);
    });
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      modal.style.display = 'none';
    });
  }
}

/* ------------------------------------------
   5. SEARCH PAGE & AI MODE TOGGLE LOGIC
   ------------------------------------------ */
function initGlobalSearchAndStats() {
  const toggleAi = document.getElementById('toggle-ai-mode');
  const hintBanner = document.getElementById('search-hint-banner');
  const searchInput = document.getElementById('main-search-input');
  const executeBtn = document.getElementById('btn-execute-search');

  if (!searchInput) return; // Not on home search page

  // DEFAULT TO FALSE / DISABLED
  let isAiMode = false;
  if (toggleAi) {
    toggleAi.checked = false;
    toggleAi.addEventListener('change', () => {
      isAiMode = toggleAi.checked;
      updateSearchHint(isAiMode);
    });
  }

  function updateSearchHint(aiState) {
    if (!hintBanner) return;
    if (aiState) {
      hintBanner.classList.add('ai-active');
      hintBanner.querySelector('span').textContent = 'AI Semantic Search Active — Meaning and contextual relevance matching';
    } else {
      hintBanner.classList.remove('ai-active');
      hintBanner.querySelector('span').textContent = 'Standard Query Search Active — Exact string and tag matching';
    }
  }

  updateSearchHint(false);

  if (executeBtn) {
    executeBtn.addEventListener('click', executeSearch);
  }

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeSearch();
  });

  function executeSearch() {
    const query = searchInput.value.trim();
    const resultsContainer = document.getElementById('bundles-results-grid');
    if (!resultsContainer) return;

    if (!query) {
      resultsContainer.innerHTML = '<div class="no-results-card">Please enter a search query.</div>';
      return;
    }

    resultsContainer.innerHTML = `
      <div class="search-loading-card">
        <div class="spinner"></div>
        <span>${isAiMode ? 'Processing AI Semantic Analysis...' : 'Executing Direct Database Lookup...'}</span>
      </div>
    `;

    setTimeout(() => {
      resultsContainer.innerHTML = `
        <div class="bundle-card">
          <div class="bundle-card-header">
            <span class="bundle-badge market-badge">PL</span>
            <span class="bundle-badge difficulty-badge">High School</span>
          </div>
          <span class="bundle-title">Sample Result for: ${query}</span>
          <div class="bundle-details">
            <span>Category: Mathematics</span>
            <span>Matches: ${isAiMode ? 'Semantic Context (98% match)' : 'Exact Keyword'}</span>
          </div>
        </div>
      `;
    }, 600);
  }
}
