/* ==========================================
   BRAINLYHUB - CORE ENGINE & SUPABASE CONNECTOR
   ========================================== */

// Supabase Configuration (Replace credentials with your live values)
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

let supabaseClient = null;

if (window.supabase) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Supabase initialization waiting for valid credentials.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndLayoutState();
  initSidebarToggle();
  initHeaderDropdowns();
  initContactRedirectModal();
  loadUserProfileFromStorage();

  initSearchEngine();
  fetchLiveDatabaseStats();

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
   SUPABASE LIVE DATABASE STATS & SEARCH
   ========================================== */

async function fetchLiveDatabaseStats() {
  const tasksEl = document.getElementById('stat-tasks');
  const solutionsEl = document.getElementById('stat-solutions');
  const marketsEl = document.getElementById('stat-markets');
  const subjectsEl = document.getElementById('stat-subjects');

  if (!supabaseClient) {
    // Graceful fallback display if Supabase client is not configured yet
    if (tasksEl) tasksEl.textContent = '0';
    if (solutionsEl) solutionsEl.textContent = '0';
    if (marketsEl) marketsEl.textContent = '5';
    if (subjectsEl) subjectsEl.textContent = '8';
    return;
  }

  try {
    const { count: tasksCount } = await supabaseClient.from('tasks').select('*', { count: 'exact', head: true });
    const { count: solutionsCount } = await supabaseClient.from('solutions').select('*', { count: 'exact', head: true });

    if (tasksEl) tasksEl.textContent = tasksCount !== null ? tasksCount.toLocaleString() : '0';
    if (solutionsEl) solutionsEl.textContent = solutionsCount !== null ? solutionsCount.toLocaleString() : '0';
    if (marketsEl) marketsEl.textContent = '12';
    if (subjectsEl) subjectsEl.textContent = '16';
  } catch (err) {
    console.error('Failed to query Supabase live stats:', err);
  }
}

function initSearchEngine() {
  const searchInput = document.getElementById('main-search-input');
  const searchBtn = document.getElementById('btn-execute-search');
  const aiToggle = document.getElementById('toggle-ai-mode');
  const hintBanner = document.getElementById('search-hint-banner');
  const subjectSelect = document.getElementById('filter-subject-select');
  const customSubjectWrapper = document.getElementById('custom-subject-wrapper');

  if (!searchInput) return;

  if (subjectSelect) {
    subjectSelect.addEventListener('change', () => {
      if (subjectSelect.value === 'custom') {
        customSubjectWrapper.style.display = 'block';
      } else {
        customSubjectWrapper.style.display = 'none';
      }
      performSearch();
    });
  }

  if (aiToggle) {
    aiToggle.addEventListener('change', () => {
      if (aiToggle.checked) {
        hintBanner.classList.add('ai-active');
        hintBanner.innerHTML = '<span><strong>AI Vector Mode Active</strong> — Natural language semantics enabled</span>';
      } else {
        hintBanner.classList.remove('ai-active');
        hintBanner.innerHTML = '<span>Standard Query Search Active — Exact string and tag matching</span>';
      }
      performSearch();
    });
  }

  if (searchBtn) searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  performSearch();
}

async function performSearch() {
  const query = document.getElementById('main-search-input').value.trim();
  const isAiMode = document.getElementById('toggle-ai-mode')?.checked || false;
  const selectedMarket = document.getElementById('filter-market').value;
  const selectedDifficulty = document.getElementById('filter-difficulty').value;
  const selectedSubject = document.getElementById('filter-subject-select').value;
  const customSubject = document.getElementById('custom-subject-input')?.value.trim();

  const container = document.getElementById('bundles-results-grid');
  const countTitle = document.getElementById('results-count-title');

  if (!container) return;

  container.innerHTML = `
    <div class="search-loading-card">
      <div class="spinner"></div>
      <p>Searching Supabase database ${isAiMode ? 'using AI Embeddings...' : '...'}</p>
    </div>
  `;

  if (!supabaseClient) {
    setTimeout(() => {
      renderSearchResults([], query, isAiMode);
    }, 400);
    return;
  }

  try {
    let dbQuery = supabaseClient.from('tasks').select('*');

    if (query !== '') {
      if (isAiMode) {
        // Example Supabase Edge Function or RPC vector search call
        const { data, error } = await supabaseClient.rpc('match_tasks_ai', { query_text: query, match_threshold: 0.7 });
        if (!error && data) {
          renderSearchResults(data, query, isAiMode);
          return;
        }
      } else {
        dbQuery = dbQuery.ilike('title', `%${query}%`);
      }
    }

    if (selectedMarket !== 'all') dbQuery = dbQuery.eq('market', selectedMarket);
    if (selectedDifficulty !== 'all') dbQuery = dbQuery.eq('difficulty', selectedDifficulty);
    
    if (selectedSubject === 'custom' && customSubject !== '') {
      dbQuery = dbQuery.ilike('subject', `%${customSubject}%`);
    } else if (selectedSubject !== 'all') {
      dbQuery = dbQuery.eq('subject', selectedSubject);
    }

    const { data, error } = await dbQuery.limit(20);

    if (error) throw error;
    renderSearchResults(data || [], query, isAiMode);

  } catch (err) {
    console.error('Supabase query error:', err);
    renderSearchResults([], query, isAiMode);
  }
}

function renderSearchResults(results, query, isAiMode) {
  const container = document.getElementById('bundles-results-grid');
  const countTitle = document.getElementById('results-count-title');
  if (!container) return;

  if (countTitle) {
    countTitle.textContent = `Search Results (${results.length})`;
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div class="no-results-card">
        <h3>No database items found</h3>
        <p>${query ? `No records matched your search "${query}".` : 'The database currently contains no items for these filter selections.'}</p>
        <span class="no-results-hint">${isAiMode ? 'Try broadening your AI semantic prompt.' : 'Try adjusting your subject or market filters.'}</span>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(item => `
    <div class="bundle-card">
      <div class="bundle-card-header">
        <span class="bundle-badge market-badge">${item.market || 'GLOBAL'}</span>
        <span class="bundle-badge difficulty-badge">${item.difficulty || 'GENERAL'}</span>
      </div>
      <h3 class="bundle-title">${item.title || 'Untitled Database Task'}</h3>
      <div class="bundle-details">
        <span>Subject: <strong>${item.subject || 'Uncategorized'}</strong></span>
        <span>ID: <strong>${item.id}</strong></span>
      </div>
      <div class="bundle-footer">
        <button class="btn-proceed" style="padding: 6px 12px; font-size: 0.8rem;" onclick="alert('Viewing task details ID: ${item.id}')">
          View Details
        </button>
      </div>
    </div>
  `).join('');
}
