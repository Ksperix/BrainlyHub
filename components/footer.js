/* ==========================================
   BRAINLYHUB - COMPONENT: FOOTER
   ========================================== */

export function renderFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="app-footer" style="
      margin-top: 40px;
      padding: 24px 0 12px 0;
      border-top: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 16px;
      color: var(--text-muted);
      font-size: 0.875rem;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      ">
        <!-- Left Side -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="assets/Brainly Hub.png" alt="BrainlyHub" style="width: 20px; height: 20px;" />
          <span style="font-weight: 600; color: var(--primary);">BrainlyHub</span>
          <span>&copy; ${currentYear} — All rights reserved.</span>
        </div>

        <!-- Right Side -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSene6zRah8jUBrBNIwbSdTEdr0Wa-9xSyEbInpBYptGAwmu3Q/viewform" target="_blank" rel="noopener" class="footer-link" style="
            display: flex; 
            align-items: center; 
            gap: 6px; 
            color: var(--text-muted); 
            text-decoration: none;
            transition: color 0.2s;
          ">
            <img src="assets/Bug.png" alt="Report Bug" style="width: 16px; height: 16px;" />
            <span>Report Bug</span>
          </a>

          <a href="#help" class="footer-link" style="
            display: flex; 
            align-items: center; 
            gap: 6px; 
            color: var(--text-muted); 
            text-decoration: none;
            transition: color 0.2s;
          ">
            <img src="assets/Question mark.png" alt="Help" style="width: 16px; height: 16px;" />
            <span>Help</span>
          </a>
        </div>
      </div>

      <div style="text-align: center; font-size: 0.75rem; opacity: 0.7; margin-top: 8px;">
        BrainlyHub is an independent educational platform for easy task navigation and academic resource access.
      </div>
    </footer>
  `;
}
