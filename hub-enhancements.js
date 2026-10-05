/* Ankovex Hub — lightweight shared UX enhancements */
(() => {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('navLinks');

  if (burger && menu) {
    burger.setAttribute('aria-controls', 'navLinks');
    burger.setAttribute('aria-expanded', String(menu.classList.contains('open')));

    // The page scripts own the toggle animation; this layer keeps it accessible.
    const syncMenu = () => {
      const open = menu.classList.contains('open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    };
    burger.addEventListener('click', () => setTimeout(syncMenu, 0));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setTimeout(syncMenu, 0);
    });
    document.addEventListener('click', (event) => {
      if (menu.classList.contains('open') && !menu.contains(event.target) && !burger.contains(event.target)) {
        menu.classList.remove('open');
        burger.classList.remove('open');
        syncMenu();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        burger.classList.remove('open');
        syncMenu();
        burger.focus();
      }
    });
  }

  // One shortcut works on every page: Cmd/Ctrl + K, or / when not typing.
  const search = document.querySelector('.search-box input, .search-wrapper input');
  if (search) {
    document.addEventListener('keydown', (event) => {
      const target = event.target;
      const typing = target && (target.matches('input, textarea, select') || target.isContentEditable);
      if ((event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        search.focus();
        search.select();
      }
    });
  }

  // Placeholder actions now communicate instead of silently doing nothing.
  let toastTimer;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  document.querySelectorAll('a[href="#"].btn-dl, a[href="#"].card-link').forEach((link) => {
    link.addEventListener('click', () => {
      toast.textContent = `${link.textContent.trim().replace(/\s+/g, ' ')} links are being prepared for this collection.`;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
    });
  });

  // Avoid stale hard-coded years as the static site is reused in future seasons.
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = year; });
})();
