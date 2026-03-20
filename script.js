// === SCROLL PROGRESS BAR ===

const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);

function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// === INTERSECTION OBSERVER (scroll reveal) ===
// Re-checked after each page transition so newly-visible elements animate in.

function observeRevealElements() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => {
      if (!el.classList.contains('visible')) {
        revealObserver.observe(el);
      }
    });
}

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

observeRevealElements();

// === NAV: hide on scroll down, show on scroll up ===

const navEl = document.getElementById('nav');
let lastY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;

  navEl.classList.toggle('nav--scrolled', currentY > 10);

  // Never hide nav while the drawer is open
  if (currentY > lastY && currentY > 80 && !navEl.classList.contains('nav--open')) {
    navEl.classList.add('nav--hidden');
  } else {
    navEl.classList.remove('nav--hidden');
  }

  lastY = currentY;
}, { passive: true });

// === HAMBURGER MENU ===

const navToggle = document.querySelector('.nav-toggle');

function closeDrawer() {
  navEl.classList.remove('nav--open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navEl.classList.toggle('nav--open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close on any nav link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// Close on outside click
document.addEventListener('click', e => {
  if (navEl.classList.contains('nav--open') && !navEl.contains(e.target)) {
    closeDrawer();
  }
});

// === PAGE TRANSITIONS ===
// Fade out → instant scroll → re-observe reveals → fade in

document.querySelectorAll('#nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    // 1. Fade out
    document.body.classList.add('page-fade');

    setTimeout(() => {
      // 2. Scroll instantly (offset for fixed nav)
      const offset = target.getBoundingClientRect().top + window.scrollY - navEl.offsetHeight;
      window.scrollTo({ top: offset, behavior: 'instant' });

      // 3. Re-observe any reveals that are now in viewport
      observeRevealElements();

      // 4. Fade back in — double rAF ensures scroll paint has committed
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.remove('page-fade');
        });
      });
    }, 300);
  });
});
