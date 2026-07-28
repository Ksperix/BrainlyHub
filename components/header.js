/* ==========================================
   BRAINLYHUB - COMPONENT: HEADER
   ========================================== */

export function renderHeader(title = 'Główna') {
  return `
    <header class="top-bar">
      <div class="top-bar-left">
        <h2 class="top-bar-title" id="top-bar-title">${title}</h2>
      </div>

      <div class="top-bar-actions">
        <!-- Przycisk powiadomień -->
        <button class="action-icon-btn" title="Powiadomienia" id="btn-notifications">
          <img src="assets/Notifications.png" alt="Powiadomienia" class="nav-icon" />
        </button>

        <!-- Przycisk ustawień -->
        <button class="action-icon-btn" title="Ustawienia" id="btn-settings">
          <img src="assets/Settings.png" alt="Ustawienia" class="nav-icon" />
        </button>

        <!-- Profil użytkownika -->
        <button class="action-icon-btn" title="Profil" id="btn-user-profile">
          <img src="assets/User profile.png" alt="Profil" class="nav-icon" />
        </button>
      </div>
    </header>
  `;
}
