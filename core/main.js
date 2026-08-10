/* ==========================================
   BRAINLYHUB - CORE APP INITIALIZATION & ENGINE
   ========================================== */

// Demo dataset simulating mock bundles before Supabase hookup
const mockBundlesDataset = [
  { id: 1, title: 'Funkcja liniowa — Zadania maturalne', market: 'PL', difficulty: 'matura', subject: 'matematyka', tasksCount: 35, updated: '2026-08-01' },
  { id: 2, title: 'Funkcja kwadratowa — Wzory i pochodne', market: 'PL', difficulty: 'srednia', subject: 'matematyka', tasksCount: 42, updated: '2026-08-05' },
  { id: 3, title: 'Reakcje redoks i bilans elektronowy', market: 'PL', difficulty: 'srednia', subject: 'chemia', tasksCount: 18, updated: '2026-07-28' },
  { id: 4, title: 'Linear Functions & Slopes', market: 'US', difficulty: 'srednia', subject: 'Mathematics', tasksCount: 50, updated: '2026-08-08' },
  { id: 5, title: 'Egzamin Ósmoklasisty — Algebra', market: 'PL', difficulty: 'podstawowa', subject: 'matematyka', tasksCount: 65, updated: '2026-08-09' },
  { id: 6, title: 'Ecuații de gradul II', market: 'RO', difficulty: 'srednia', subject: 'Matematică', tasksCount: 24, updated: '2026-08-02' }
];

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndLayoutState();
  initSidebarToggle();
  initHeaderDropdowns();
  initContactRedirectModal();
  loadUserProfileFromStorage();

  initInteractiveGridCanvas();
  initSearchEngine();

  requestAnimationFrame(() => {
    document.documentElement.classList.remove('preload-collapsed');
    document.body.classList.remove('preload-no-transition');
  });
});

function initThemeAndLayoutState() {
  const savedTheme = localStorage.getItem('app_theme');
  const savedAccent = localStorage.getItem('app_accent');
  const isCompact = localStorage.getItem('compact_ui') === 'true';
  const isSidebarCollapsed = localStorage.getItem('sidebar_collapsed') !== 'false';

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

function loadUserProfileFromStorage() {
  const nameEl = document.getElementById('header-user-name');
  const roleEl = document.getElementById('header-user-role');
  const avatarEl = document.getElementById('header-avatar');

  const savedName = localStorage.getItem('user_name') || 'Student Account';
  const savedRole = localStorage.getItem('user_role') || 'High School Member';
  const savedAvatar = localStorage.getItem('user_avatar');

  if (nameEl) nameEl.textContent = savedName;
  if (roleEl) roleEl.textContent = savedRole;

  if (avatarEl) {
    if (savedAvatar && savedAvatar.startsWith('http')) {
      avatarEl.innerHTML = `<img src="${savedAvatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />`;
    } else {
      avatarEl.textContent = savedName.charAt(0).toUpperCase();
    }
  }
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

/* ==========================================
   INTERACTIVE CANVAS DOT GRID BACKGROUND
   ========================================== */

function initInteractiveGridCanvas() {
  const canvas = document.getElementById('hero-grid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouseX = -1000;
  let mouseY = -1000;

  const spacing = 28;
  const baseRadius = 1.5;

  function resizeCanvas() {
    const parent = canvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  function renderGrid() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.body.classList.contains('dark-theme');
    const defaultDotColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)';
    const activeDotColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#1e3a8a';

    for (let x = spacing / 2; x < width; x += spacing) {
      for (let y = spacing / 2; y < height; y += spacing) {
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        let radius = baseRadius;
        let color = defaultDotColor;

        if (dist < maxDist) {
          const factor = 1 - dist / maxDist;
          radius = baseRadius + factor * 3.5;
          color = activeDotColor;
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    requestAnimationFrame(renderGrid);
  }

  renderGrid();
}

/* ==========================================
   SEARCH ENGINE & FILTERING LOGIC
   ========================================== */

function initSearchEngine() {
  const searchInput = document.getElementById('main-search-input');
  const marketSelect = document.getElementById('filter-market');
  const difficultySelect = document.getElementById('filter-difficulty');
  const subjectSelect = document.getElementById('filter-subject-select');
  const customSubjectWrapper = document.getElementById('custom-subject-wrapper');
  const customSubjectInput = document.getElementById('custom-subject-input');

  if (!searchInput) return;

  // Toggle custom subject input when "Inne" is selected
  subjectSelect.addEventListener('change', () => {
    if (subjectSelect.value === 'inne') {
      customSubjectWrapper.style.display = 'block';
    } else {
      customSubjectWrapper.style.display = 'none';
    }
    executeSearch();
  });

  [searchInput, customSubjectInput].forEach(el => {
    if (el) el.addEventListener('input', executeSearch);
  });

  [marketSelect, difficultySelect].forEach(el => {
    if (el) el.addEventListener('change', executeSearch);
  });

  executeSearch();
}

function executeSearch() {
  const query = document.getElementById('main-search-input').value.toLowerCase().trim();
  const selectedMarket = document.getElementById('filter-market').value;
  const selectedDifficulty = document.getElementById('filter-difficulty').value;
  const selectedSubject = document.getElementById('filter-subject-select').value;
  const customSubjectVal = document.getElementById('custom-subject-input').value.toLowerCase().trim();

  const filtered = mockBundlesDataset.filter(bundle => {
    // Partial query matching on title
    const matchesQuery = query === '' || bundle.title.toLowerCase().includes(query);

    // Market filter
    const matchesMarket = selectedMarket === 'all' || bundle.market === selectedMarket;

    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'all' || bundle.difficulty === selectedDifficulty;

    // Subject filter
    let matchesSubject = true;
    if (selectedSubject === 'inne') {
      matchesSubject = customSubjectVal === '' || bundle.subject.toLowerCase().includes(customSubjectVal);
    } else if (selectedSubject !== 'all') {
      matchesSubject = bundle.subject.toLowerCase() === selectedSubject;
    }

    return matchesQuery && matchesMarket && matchesDifficulty && matchesSubject;
  });

  renderSearchResults(filtered);
}

function renderSearchResults(results) {
  const container = document.getElementById('bundles-results-grid');
  const countTitle = document.getElementById('results-count-title');
  if (!container) return;

  if (countTitle) {
    countTitle.textContent = `Wyniki Wyszukiwania (${results.length})`;
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div class="no-results-card">
        <p>Brak paczek spełniających podane kryteria wyszukiwania.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(bundle => `
    <div class="bundle-card">
      <div class="bundle-card-header">
        <span class="bundle-badge market-badge">${bundle.market}</span>
        <span class="bundle-badge difficulty-badge">${bundle.difficulty}</span>
      </div>
      <h3 class="bundle-title">${bundle.title}</h3>
      <div class="bundle-details">
        <span>Przedmiot: <strong>${bundle.subject}</strong></span>
        <span>Liczba zadań: <strong>${bundle.tasksCount}</strong></span>
      </div>
      <div class="bundle-footer">
        <button class="btn-proceed" style="padding: 6px 12px; font-size: 0.8rem;" onclick="alert('Otwieranie paczki ID: ${bundle.id}')">
          Otwórz Paczkę
        </button>
      </div>
    </div>
  `).join('');
}
