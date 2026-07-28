/* ==========================================
   BRAINLYHUB - CORE APPLICATION LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initNavigation();
});

/**
 * Obsługa bocznego paska nawigacyjnego (Gemini-style Toggle)
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('btn-toggle-sidebar');

  if (!sidebar || !toggleBtn) return;

  // Odczytanie zapisanego stanu paska z localStorage
  const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
  }

  // Przełączanie stanu zwinięcia/rozwinięcia
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const collapsedState = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebar_collapsed', collapsedState);
  });
}

/**
 * Obsługa aktywnego podświetlenia elementów nawigacji i płynnego przełączania
 */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Usuń klasę active ze wszystkich elementów
      navItems.forEach(el => el.classList.remove('active'));

      // Dodaj klasę active do klikniętego elementu
      item.classList.add('active');

      // Jeśli link prowadzi do podstrony/sekcji
      const pageTarget = item.getAttribute('data-target');
      if (pageTarget) {
        loadPage(pageTarget);
      }
    });
  });
}

/**
 * Dynamiczne ładowanie podstron/komponentów w obszarze roboczym
 * @param {string} pageName Nazwa podstrony do załadowania
 */
function loadPage(pageName) {
  const contentBody = document.getElementById('content-body');
  const topBarTitle = document.getElementById('top-bar-title');

  if (!contentBody) return;

  // Aktualizacja nagłówka górnego
  if (topBarTitle) {
    topBarTitle.textContent = formatPageTitle(pageName);
  }

  // Wyemitowanie zdarzenia o zmianie strony (przydatne dla komponentów)
  window.dispatchEvent(new CustomEvent('pageChanged', { detail: { page: pageName } }));
}

/**
 * Pomocnicza funkcja formatująca tytuł podstrony
 */
function formatPageTitle(str) {
  if (!str) return 'Główna';
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}
