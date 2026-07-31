/* ==========================================
   BRAINLYHUB - CORE APPLICATION LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initNavigation();
});

/**
 * Handles sidebar behavior (Gemini-style Toggle)
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('btn-toggle-sidebar');

  if (!sidebar || !toggleBtn) return;

  // Retrieve saved sidebar state from localStorage
  const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
  }

  // Toggle collapsed state on click
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const collapsedState = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar_collapsed', collapsedState);
  });
}

/**
 * Handles active navigation item highlights and routing transitions
 */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Remove active class from all items
      navItems.forEach(el => el.classList.remove('active'));

      // Add active class to the clicked item
      item.classList.add('active');

      // If the item points to a specific view/target
      const pageTarget = item.getAttribute('data-target');
      if (pageTarget) {
        loadPage(pageTarget);
      }
    });
  });
}

/**
 * Dynamically loads page contents inside the main content area
 * @param {string} pageName Name of the page target to load
 */
function loadPage(pageName) {
  const contentBody = document.getElementById('content-body');
  const topBarTitle = document.getElementById('top-bar-title');

  if (!contentBody) return;

  // Update top bar title
  if (topBarTitle) {
    topBarTitle.textContent = formatPageTitle(pageName);
  }

  // Dispatch custom event for page view change
  window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: pageName } }));
}

/**
 * Helper function to format page titles in English
 */
function formatPageTitle(str) {
  if (!str) return 'Home';

  // Map exact data-target keys to readable titles
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
    'ask': 'Ask a Question',
    'settings': 'Settings'
  };

  return titleMap[str] || (str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' '));
}
