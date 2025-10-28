const mobileToggle = document.getElementById('mobileToggle');
const mainNav = document.getElementById('mainNav');

if (mobileToggle && mainNav) {
  // Toggle slide-out menu
  mobileToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    // Lock page scroll when menu is open
    document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('active') &&
        !mobileToggle.contains(e.target) &&
        !mainNav.contains(e.target)) {
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close after choosing a link
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}
