// Brightfield School — shared front-end behaviour (demo only, no backend)

document.addEventListener('DOMContentLoaded', () => {
  // ---- Login: role tile picker ----
  const tiles = document.querySelectorAll('.role-tile');
  const goBtn = document.getElementById('loginSubmit');
  const roleDestinations = {
    admin: 'admin-dashboard.html',
    teacher: 'teacher-dashboard.html',
    student: 'student-dashboard.html',
    parent: 'parent-dashboard.html'
  };
  let selectedRole = 'admin';

  if (tiles.length) {
    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        tiles.forEach(t => t.classList.remove('active'));
        tile.classList.add('active');
        selectedRole = tile.dataset.role;
        const color = getComputedStyle(document.documentElement)
          .getPropertyValue(`--${selectedRole}`).trim();
        const tint = getComputedStyle(document.documentElement)
          .getPropertyValue(`--${selectedRole}-t`).trim();
        tile.style.setProperty('--tile-color', color);
        tile.style.setProperty('--tile-tint', tint);
        document.documentElement.style.setProperty('--role', color);
        document.documentElement.style.setProperty('--role-tint', tint);
      });
    });
  }

  if (goBtn) {
    goBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = roleDestinations[selectedRole] || 'admin-dashboard.html';
    });
  }

  // ---- Animate bar-chart bars in from 0 ----
  document.querySelectorAll('.bar-chart .bar > i').forEach(bar => {
    const target = bar.style.height;
    bar.style.height = '0%';
    requestAnimationFrame(() => {
      setTimeout(() => { bar.style.transition = 'height .7s ease'; bar.style.height = target; }, 60);
    });
  });

  // ---- Simple client-side table search (data-search-target) ----
  document.querySelectorAll('[data-search]').forEach(input => {
    input.addEventListener('input', () => {
      const term = input.value.toLowerCase();
      const tableId = input.getAttribute('data-search');
      const rows = document.querySelectorAll(`#${tableId} tbody tr`);
      rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  });

  // ---- Shared inner pages: apply role from ?role= query param ----
  const body = document.body;
  if (body.classList.contains('role-aware')) {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role') || 'admin';
    ['admin', 'teacher', 'student', 'parent'].forEach(r => body.classList.remove(`role-${r}`));
    body.classList.add(`role-${role}`);

    // show/hide nav items scoped to certain roles
    document.querySelectorAll('[data-roles]').forEach(el => {
      const allowed = el.getAttribute('data-roles').split(',');
      el.style.display = allowed.includes(role) ? '' : 'none';
    });

    // update role switch pills
    document.querySelectorAll('.role-switch a').forEach(a => {
      a.classList.toggle('active', a.dataset.role === role);
    });

    // highlight active nav link among the ones visible for this role
    const currentFile = window.location.pathname.split('/').pop();
    document.querySelectorAll('.side-nav a[data-roles]').forEach(a => {
      a.classList.remove('active');
      if (a.style.display !== 'none' && a.getAttribute('href').split('?')[0] === currentFile) {
        a.classList.add('active');
      }
    });

    // update sidebar identity block if present
    const sideRole = document.querySelector('[data-side-role]');
    const sideAvatar = document.querySelector('[data-side-avatar]');
    const sideName = document.querySelector('[data-side-name]');
    const names = {
      admin: ['ADMIN ACCESS', 'R', 'Rosa Odenu'],
      teacher: ['TEACHER ACCESS', 'M', 'Mr. D. Kwame'],
      student: ['STUDENT ACCESS', 'A', 'Anaya Fitzgerald'],
      parent: ['PARENT ACCESS', 'N', 'Ngozi Fitzgerald']
    };
    if (sideRole && names[role]) {
      sideRole.textContent = names[role][0];
      if (sideAvatar) sideAvatar.textContent = names[role][1];
      if (sideName) sideName.textContent = names[role][2];
    }
  }

  // ---- Mobile sidebar toggle ----
  const menuBtn = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.app-sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
});
