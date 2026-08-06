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
        <!-- Notifications Dropdown Container -->
        <div class="dropdown-container">
          <button class="action-icon-btn" title="Notifications" id="btn-notifications">
            <img src="assets/Notifications.png" alt="Notifications" class="nav-icon" />
            <span class="notification-badge" id="notif-badge"></span>
          </button>
          
          <div class="header-dropdown" id="dropdown-notifications">
            <div class="dropdown-header">
              <span>Notifications</span>
              <small style="color: var(--text-muted); cursor: pointer;" id="btn-clear-notifs">Clear</small>
            </div>
            <div id="notif-list" style="display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto;">
              <div class="dropdown-item" style="font-size: 0.8rem; color: var(--text-muted);">
                Welcome to BrainlyHub! Explore tasks and resources freely.
              </div>
            </div>
          </div>
        </div>

        <!-- User Profile Dropdown Container -->
        <div class="dropdown-container">
          <button class="action-icon-btn" title="User Profile" id="btn-user-profile">
            <img src="assets/User profile.png" alt="Profile" class="nav-icon" />
          </button>

          <div class="header-dropdown" id="dropdown-profile">
            <div class="dropdown-header">
              <span>Student Account</span>
            </div>
            <a class="dropdown-item nav-item" data-target="profile">
              <img src="assets/User profile.png" style="width: 16px; height: 16px;" /> My Profile
            </a>
            <a class="dropdown-item nav-item" data-target="settings">
              <img src="assets/Settings.png" style="width: 16px; height: 16px;" /> Settings
            </a>
          </div>
        </div>
      </div>
    </header>
  `;
}
