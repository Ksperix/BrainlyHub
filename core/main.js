/* ==========================================
   BRAINLYHUB - CORE APPLICATION LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initNavigation();
  initHeaderDropdowns();
});

/**
 * Handles sidebar behavior without scrollbar glitches
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
    // Dodaj klasę pomocniczą na czas trwania animacji CSS
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
 * Handles header dropdown menus (Notifications & Profile) with LocalStorage support
 */
function initHeaderDropdowns() {
  const btnNotif = document.getElementById('btn-notifications');
  const dropdownNotif = document.getElementById('dropdown-notifications');
  const btnProfile = document.getElementById('btn-user-profile');
  const dropdownProfile = document.getElementById('dropdown-profile');
  const notifBadge = document.getElementById('notif-badge');
  const btnClearNotifs = document.getElementById('btn-clear-notifs');
  const notifList = document.getElementById('notif-list');

  // Load notification state
  const isNotifCleared = localStorage.getItem('notifs_cleared') === 'true';
  if (isNotifCleared && notifBadge) {
    notifBadge.style.display = 'none';
    if (notifList) {
      notifList.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); padding: 4px;">No new notifications.</div>`;
    }
  }

  if (btnNotif && dropdownNotif) {
    btnNotif.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownProfile?.classList.remove('show');
      dropdownNotif.classList.toggle('show');
    });
  }

  if (btnProfile && dropdownProfile) {
    btnProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownNotif?.classList.remove('show');
      dropdownProfile.classList.toggle('show');
    });
  }

  // Clear notifications
  if (btnClearNotifs) {
    btnClearNotifs.addEventListener('click', () => {
      localStorage.setItem('notifs_cleared', 'true');
      if (notifBadge) notifBadge.style.display = 'none';
      if (notifList) {
        notifList.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); padding: 4px;">No new notifications.</div>`;
      }
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    dropdownNotif?.classList.remove('show');
    dropdownProfile?.classList.remove('show');
  });
}

/**
 * Handles active navigation item highlights
 */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const pageTarget = item.getAttribute('data-target');
      if (pageTarget) {
        navItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        loadPage(pageTarget);
      }
    });
  });
}

/**
 * Dynamically loads page contents inside the main content area
 */
function loadPage(pageName) {
  const contentBody = document.getElementById('content-body');
  const topBarTitle = document.getElementById('top-bar-title');

  if (!contentBody) return;

  if (topBarTitle) {
    topBarTitle.textContent = formatPageTitle(pageName);
  }

  window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: pageName } }));
}

/**
 * Helper function to format page titles in English
 */
function formatPageTitle(str) {
  if (!str) return 'Home';

  const titleMap = {
    'home': 'Home',
    'tasks': 'Task Search',
    'past-exams': 'Past Exams',
    'topics': 'Categories & Topics',
    'math': 'Mathematics',
    'chemistry': 'Chemistry',
    'physics': 'Physics',
    'informatics': 'Computer Science',
    'biology': 'Biology',
    'history': 'History',
    'profile': 'My Profile',
    'settings': 'Settings'
  };

  return titleMap[str] || (str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' '));
}
