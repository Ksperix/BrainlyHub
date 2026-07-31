/* ==========================================
   BRAINLYHUB - COMPONENT: HEADER
   ========================================== */

export function renderHeader(title = 'Home') {
  return `
    <header class="top-bar">
      <div class="top-bar-left">
        <h2 class="top-bar-title" id="top-bar-title">${title}</h2>
      </div>

      <div class="top-bar-actions">
        <!-- Notifications Button -->
        <button class="action-icon-btn" title="Notifications" id="btn-notifications">
          <img src="assets/Notifications.png" alt="Notifications" class="nav-icon" />
        </button>

        <!-- Settings Button -->
        <button class="action-icon-btn" title="Settings" id="btn-settings">
          <img src="assets/Settings.png" alt="Settings" class="nav-icon" />
        </button>

        <!-- User Profile Button -->
        <button class="action-icon-btn" title="Profile" id="btn-user-profile">
          <img src="assets/User profile.png" alt="Profile" class="nav-icon" />
        </button>
      </div>
    </header>
  `;
}
