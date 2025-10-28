// Hero slider: setup elements and state
const slider = document.getElementById('heroSlider');
const slides = slider.querySelectorAll('.slide');
const dots = document.getElementById('heroDots');
let current = 0;

// Create dots for each slide
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.addEventListener('click', () => showSlide(i));
  dots.appendChild(dot);
});

// Show a specific slide by index
function showSlide(i) {
  slides[current].classList.remove('active');
  current = (i + slides.length) % slides.length;
  slides[current].classList.add('active');
  updateDots();
}

// Update dot styles to match active slide
function updateDots() {
  [...dots.children].forEach((d, i) => {
    d.style.background = i === current ? 'var(--accent)' : 'rgba(255,255,255,0.3)';
  });
}

// Arrow controls for previous/next
document.querySelector('.hero-arrow.left').addEventListener('click', () => showSlide(current - 1));
document.querySelector('.hero-arrow.right').addEventListener('click', () => showSlide(current + 1));

// Auto-advance the hero every 6s
setInterval(() => showSlide(current + 1), 6000);

/* === Portfolio Gallery (click dots to switch images) === */
const portfolioItems = document.querySelectorAll('.portfolio-item');
const portfolioDots = document.querySelectorAll('.portfolio-dot');

portfolioDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    // Reset active states
    portfolioItems.forEach(item => item.classList.remove('active'));
    portfolioDots.forEach(d => d.classList.remove('active'));
    // Activate chosen item and dot
    portfolioItems[index].classList.add('active');
    dot.classList.add('active');
  });
});

/* === Stats counter (animate when in view) === */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Simple easing for a smoother count
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  // Animate numbers from 0 to target
  function animateCount(el, to, { duration = 1200 } = {}) {
    if (el.dataset.animated === 'true') return; // run once
    el.dataset.animated = 'true';

    const suffix = el.dataset.suffix || '';
    const from = 0;
    const start = performance.now();

    if (prefersReduced) {
      el.textContent = `${to}${suffix}`;
      return;
    }

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        // Snap to final value
        el.textContent = `${to}${suffix}`;
      }
    }
    requestAnimationFrame(frame);
  }

  // Observe stats section once
  const section = document.querySelector('.stats-section');
  if (!section) return;

  const numbers = section.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      numbers.forEach(el => {
        const to = parseInt(el.dataset.target, 10);
        if (!Number.isFinite(to)) return;
        animateCount(el, to, { duration: 1400 });
      });

      obs.unobserve(section); // only trigger once
    });
  }, { threshold: 0.25 });

  observer.observe(section);
})();

/* === Testimonials slider (auto and responsive) === */
const testimonialsSlider = document.getElementById('testimonialsSlider');
const testimonialsTrack = testimonialsSlider?.querySelector('.testimonials-track');
const testimonialCards = testimonialsSlider?.querySelectorAll('.testimonial-card');

if (testimonialsSlider && testimonialCards.length > 0) {
  let currentSlide = 0;
  const totalTestimonials = testimonialCards.length;
  const cardsPerSlide = window.innerWidth > 768 ? 3 : 1;
  const totalSlides = Math.ceil(totalTestimonials / cardsPerSlide);

  // Move track by slide width
  function goToSlide(slideIndex) {
    currentSlide = slideIndex % totalSlides;
    const slideWidth = 100; // 100% per slide
    const translateX = -currentSlide * slideWidth;
    testimonialsTrack.style.transform = `translateX(${translateX}%)`;
  }

  // Init first slide
  goToSlide(0);

  // Auto-play every 5s
  setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);

  // Re-calc on resize
  window.addEventListener('resize', () => {
    goToSlide(0);
  });
}
