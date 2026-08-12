/* ==========================================
   BRAINLYHUB - GLOBAL HEADER COMPONENT
   ========================================== */

function renderGlobalHeader() {
  const headerContainer = document.getElementById('global-header');
  if (!headerContainer) return;

  headerContainer.className = 'top-bar';
  headerContainer.innerHTML = `
    <div class="top-bar-brand">
      <a href="index.html" class="brand-link">
        <img src="assets/Brainly Hub.png" alt="BrainlyHub" class="brand-logo" />
        <span class="brand-title">BrainlyHub</span>
      </a>
    </div>

    <div class="top-bar-actions">
      <!-- Favorites Button -->
      <div class="dropdown-container">
        <button class="action-icon-btn" title="Favorites" id="btn-favorites">
          <img src="assets/Heart.png" alt="Favorites" class="nav-icon" />
        </button>
      </div>

      <!-- Notifications Dropdown -->
      <div class="dropdown-container">
        <button class="action-icon-btn" title="Notifications" id="btn-notifications">
          <img src="assets/Notifications.png" alt="Notifications" class="nav-icon" />
          <span class="notification-badge" id="notif-badge" style="display: none;"></span>
        </button>
        
        <div class="header-dropdown" id="dropdown-notifications">
          <div class="dropdown-header">
            <span>Notifications</span>
            <small id="btn-clear-notifs" style="cursor: pointer; color: var(--text-muted);">Clear All</small>
          </div>
          <div id="notif-list" class="notif-scroll-container">
            <div class="notif-empty-state">No recent notifications</div>
          </div>
          <a href="settings.html#notifications" class="dropdown-footer-link">
            <img src="assets/Settings.png" style="width: 14px; height: 14px;" alt="Settings" />
            Notification Settings
          </a>
        </div>
      </div>

      <!-- User Profile Dropdown -->
      <div class="dropdown-container">
        <button class="action-icon-btn" title="User Profile" id="btn-user-profile">
          <img src="assets/User profile.png" alt="Profile" class="nav-icon" />
        </button>

        <div class="header-dropdown profile-dropdown-panel" id="dropdown-profile">
          <div class="user-profile-header">
            <div class="profile-avatar" id="header-avatar">S</div>
            <div class="profile-info">
              <span class="profile-name" id="header-user-name">Student Account</span>
              <span class="profile-role" id="header-user-role">High School Member</span>
            </div>
          </div>

          <!-- Account & Preferences Section -->
          <div class="profile-tools-section">
            <span class="profile-tools-title">Account & Preferences</span>
            <a href="settings.html" class="profile-btn-card">
              <div class="profile-btn-icon">
                <img src="assets/Settings.png" alt="Settings" />
              </div>
              <div class="profile-btn-info">
                <span class="profile-btn-title">Account Settings</span>
                <span class="profile-btn-desc">Manage preferences</span>
              </div>
            </a>
          </div>

          <!-- Community & Extensions Section -->
          <div class="profile-tools-section">
            <span class="profile-tools-title">Community & Extensions</span>

            <a href="#" class="profile-btn-card" id="btn-install-app-header">
              <div class="profile-btn-icon">
                <img src="assets/Download.png" alt="Install" />
              </div>
              <div class="profile-btn-info">
                <span class="profile-btn-title">Install App</span>
                <span class="profile-btn-desc">Get Desktop Client</span>
              </div>
            </a>

            <a href="https://dsc.gg/brainlyhq" target="_blank" rel="noopener" class="profile-btn-card">
              <div class="profile-btn-icon">
                <img src="assets/Brainly.png" alt="Discord" />
              </div>
              <div class="profile-btn-info">
                <span class="profile-btn-title">Discord Server</span>
                <span class="profile-btn-desc">Join BrainlyHQ</span>
              </div>
            </a>

            <a href="https://chromewebstore.google.com/detail/brainly-creatives/pgfbplkcnljoadikklfopgpdmehjhbic" target="_blank" rel="noopener" class="profile-btn-card">
              <div class="profile-btn-icon">
                <img src="assets/Code.png" alt="Extension" />
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
  `;

  initHeaderDropdownEvents();
}

function initHeaderDropdownEvents() {
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
}

// Wywołanie automatyczne
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderGlobalHeader);
} else {
  renderGlobalHeader();
}
