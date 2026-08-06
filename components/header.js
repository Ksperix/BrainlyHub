/* ==========================================
   BRAINLYHUB - COMPONENT: HEADER
   ========================================== */

export function renderHeader() {
  return `
    <header class="top-bar">
      <div class="top-bar-actions">
        <!-- Notifications Dropdown Container -->
        <div class="dropdown-container">
          <button class="action-icon-btn" title="Notifications" id="btn-notifications">
            <img src="assets/Notifications.png" alt="Notifications" class="nav-icon" />
            <span class="notification-badge" id="notif-badge" style="display: none;"></span>
          </button>
          
          <div class="header-dropdown" id="dropdown-notifications">
            <div class="dropdown-header">
              <span>Notifications</span>
              <small style="color: var(--text-muted); cursor: pointer;" id="btn-clear-notifs">Clear All</small>
            </div>
            
            <div id="notif-list" class="notif-scroll-container"></div>

            <a href="settings.html#notifications" class="dropdown-footer-link">
              <img src="assets/Settings.png" style="width: 14px; height: 14px;" alt="Settings" />
              Notification Settings
            </a>
          </div>
        </div>

        <!-- User Profile Dropdown Container -->
        <div class="dropdown-container">
          <button class="action-icon-btn" title="User Profile" id="btn-user-profile">
            <img src="assets/User profile.png" alt="Profile" class="nav-icon" />
          </button>

          <div class="header-dropdown profile-dropdown-panel" id="dropdown-profile">
            <!-- Wizytówka użytkownika na samej górze -->
            <div class="user-profile-header">
              <div class="profile-avatar" id="header-avatar">S</div>
              <div class="profile-info">
                <span class="profile-name" id="header-user-name">Student Account</span>
                <span class="profile-role">High School Member</span>
              </div>
            </div>

            <!-- Główny przycisk: Account Settings -->
            <a href="settings.html" class="profile-btn-card primary-card">
              <div class="profile-btn-icon">
                <img src="assets/Settings.png" alt="Settings" style="width: 22px; height: 22px;" />
              </div>
              <div class="profile-btn-info">
                <span class="profile-btn-title">Account Settings</span>
              </div>
            </a>

            <div style="border-top: 1px solid var(--border-color); margin: 2px 0;"></div>

            <!-- Bloczki społecznościowe i rozszerzeń -->
            <div class="profile-tools-section">
              <span class="profile-tools-title">Community & Extensions</span>

              <a href="https://dsc.gg/brainlyhq" target="_blank" rel="noopener" class="profile-btn-card secondary-card">
                <div class="profile-btn-icon">
                  <img src="assets/Brainly.png" alt="Discord" style="width: 22px; height: 22px;" />
                </div>
                <div class="profile-btn-info">
                  <span class="profile-btn-title">Discord Server</span>
                  <span class="profile-btn-desc">Join BrainlyHQ</span>
                </div>
              </a>

              <a href="https://chromewebstore.google.com/detail/brainly-creatives/pgfbplkcnljoadikklfopgpdmehjhbic?hl=pl&utm_source=ext_sidebar" target="_blank" rel="noopener" class="profile-btn-card secondary-card">
                <div class="profile-btn-icon">
                  <img src="assets/Code.png" alt="Extension" style="width: 22px; height: 22px;" />
                </div>
                <div class="profile-btn-info">
                  <span class="profile-btn-title">Brainly Creatives</span>
                  <span class="profile-btn-desc">Chrome Extension</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}
