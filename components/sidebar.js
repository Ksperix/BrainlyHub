/* ==========================================
   BRAINLYHUB - COMPONENT: SIDEBAR (NAV & FOOTER)
   ========================================== */

export function renderSidebar() {
  return `
    <aside class="sidebar" id="sidebar">
      <!-- Nagłówek Sidebaru (Logo + Przycisk zwijania) -->
      <div class="sidebar-header">
        <div class="brand-container">
          <img src="assets/Brainly Hub.png" alt="Brainly Hub" class="brand-logo" />
          <span class="brand-title">BrainlyHub</span>
        </div>
        <button class="btn-toggle-sidebar" id="btn-toggle-sidebar" title="Zwiń / Rozwiń nawigację">
          <img src="assets/Folder.png" alt="Toggle Menu" class="nav-icon" />
        </button>
      </div>

      <!-- Główna lista nawigacyjna -->
      <ul class="nav-list">
        <li>
          <a class="nav-item active" data-target="home">
            <img src="assets/Home star.png" alt="Strona Główna" class="nav-icon" />
            <span class="nav-label">Strona Główna</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="tasks">
            <img src="assets/Tasks.png" alt="Zadania" class="nav-icon" />
            <span class="nav-label">Wyszukiwarka Zadań</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="past-exams">
            <img src="assets/Past exams.png" alt="Arkusz Egzaminacyjny" class="nav-icon" />
            <span class="nav-label">Arkusze / Egzaminy</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="topics">
            <img src="assets/Topic.png" alt="Tematy" class="nav-icon" />
            <span class="nav-label">Kategorie / Tematy</span>
          </a>
        </li>

        <!-- Separator dla przedmiotów -->
        <li style="margin: 8px 0; border-top: 1px solid var(--border-color);"></li>

        <li>
          <a class="nav-item" data-target="math">
            <img src="assets/Mathematics.png" alt="Matematyka" class="nav-icon" />
            <span class="nav-label">Matematyka</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="chemistry">
            <img src="assets/Chemistry.png" alt="Chemia" class="nav-icon" />
            <span class="nav-label">Chemia</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="physics">
            <img src="assets/Physics.png" alt="Fizyka" class="nav-icon" />
            <span class="nav-label">Fizyka</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="informatics">
            <img src="assets/Computer science.png" alt="Informatyka" class="nav-icon" />
            <span class="nav-label">Informatyka</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="biology">
            <img src="assets/Biology.png" alt="Biologia" class="nav-icon" />
            <span class="nav-label">Biologia</span>
          </a>
        </li>
        <li>
          <a class="nav-item" data-target="history">
            <img src="assets/History.png" alt="Historia" class="nav-icon" />
            <span class="nav-label">Historia</span>
          </a>
        </li>
      </ul>

      <!-- Sekcja Dolna (Footer w Sidebarze) -->
      <div class="sidebar-footer">
        <a class="nav-item" data-target="ask">
          <img src="assets/Ask.png" alt="Pomoc" class="nav-icon" />
          <span class="nav-label">Zadaj Pytanie</span>
        </a>
        <a class="nav-item" data-target="settings">
          <img src="assets/Settings.png" alt="Ustawienia" class="nav-icon" />
          <span class="nav-label">Ustawienia</span>
        </a>
      </div>
    </aside>
  `;
}
