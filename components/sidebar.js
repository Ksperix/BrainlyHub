/* ==========================================
   BRAINLYHUB - COMPONENT: SIDEBAR (NAV & FOOTER)
   ========================================== */

export function renderSidebar() {
  return `
    <aside class="sidebar" id="sidebar">
      <!-- Sidebar Header (Logo + Toggle Button) -->
      <div class="sidebar-header">
        <div class="brand-container">
          <img src="assets/Brainly Hub.png" alt="Brainly Hub" class="brand-logo" />
          <span class="brand-title">BrainlyHub</span>
        </div>
        <button class="btn-toggle-sidebar" id="btn-toggle-sidebar" title="Collapse / Expand Navigation">
          <img src="assets/Folder.png" alt="Toggle Menu" class="nav-icon" />
        </button>
      </div>

      <!-- Main Navigation List -->
      <ul class="nav-list">
        <li>
          <a class="nav-item active" data-target="home">
            <img src="assets/Home star.png" alt="Home" class="nav-icon" />
            <span class="nav-label">Home</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="tasks">
            <img src="assets/Tasks.png" alt="Tasks" class="nav-icon" />
            <span class="nav-label">Task Search</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="past-exams">
            <img src="assets/Past exams.png" alt="Past Exams" class="nav-icon" />
            <span class="nav-label">Past Exams</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="topics">
            <img src="assets/Topic.png" alt="Topics" class="nav-icon" />
            <span class="nav-label">Categories / Topics</span>
          </a>
        </li>

        <!-- Separator for Subjects -->
        <li style="margin: 8px 0; border-top: 1px solid var(--border-color);"></li>

        <li>
          <a class="nav-item" data-target="math">
            <img src="assets/Mathematics.png" alt="Mathematics" class="nav-icon" />
            <span class="nav-label">Mathematics</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="chemistry">
            <img src="assets/Chemistry.png" alt="Chemistry" class="nav-icon" />
            <span class="nav-label">Chemistry</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="physics">
            <img src="assets/Physics.png" alt="Physics" class="nav-icon" />
            <span class="nav-label">Physics</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="informatics">
            <img src="assets/Computer science.png" alt="Computer Science" class="nav-icon" />
            <span class="nav-label">Computer Science</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="biology">
            <img src="assets/Biology.png" alt="Biology" class="nav-icon" />
            <span class="nav-label">Biology</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="history">
            <img src="assets/History.png" alt="History" class="nav-icon" />
            <span class="nav-label">History</span>
          </a>
        </li>
      </ul>

      <!-- Bottom Section (Sidebar Footer) -->
      <div class="sidebar-footer">
        <a class="nav-item" data-target="ask">
          <img src="assets/Ask.png" alt="Help" class="nav-icon" />
          <span class="nav-label">Ask a Question</span>
        </a>
        <a class="nav-item" data-target="settings">
          <img src="assets/Settings.png" alt="Settings" class="nav-icon" />
          <span class="nav-label">Settings</span>
        </a>
      </div>
    </aside>
  `;
}
