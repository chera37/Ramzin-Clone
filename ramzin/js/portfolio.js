// Portfolio page: run features after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Filter buttons: show items by category
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button style
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Show/hide items by category
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === '*' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Load more: simple demo state
  const loadMoreBtn = document.querySelector('.load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      this.textContent = 'Loading...';
      this.disabled = true;
      setTimeout(() => {
        this.textContent = 'No More Projects';
        this.style.opacity = '0.5';
      }, 1500);
    });
  }
  
  // Image hover: slight zoom
  portfolioItems.forEach(item => {
    const image = item.querySelector('.portfolio-image img');
    item.addEventListener('mouseenter', function() {
      if (image) image.style.transform = 'scale(1.05)';
    });
    item.addEventListener('mouseleave', function() {
      if (image) image.style.transform = 'scale(1)';
    });
  });
  
  // Stats: animate numbers when visible
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        const finalNumber = statNumber.textContent;
        const hasPlus = finalNumber.includes('+');
        const hasM = finalNumber.includes('M');
        const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
        
        // Run count-up once
        animateNumber(statNumber, 0, numericValue, 2000, hasPlus, hasM);
        observer.unobserve(statNumber);
      }
    });
  }, observerOptions);
  
  // Watch all stat elements in this section
  const statNumbers = document.querySelectorAll('.portfolio-stats-section .stat-number');
  statNumbers.forEach(stat => observer.observe(stat));
  
  // Count-up helper
  function animateNumber(element, start, end, duration, hasPlus = false, hasM = false) {
    const startTime = performance.now();
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Simple easing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      
      let displayValue = current.toString();
      if (hasM && current > 0) displayValue += 'M';
      if (hasPlus && current > 0) displayValue += '+';
      element.textContent = displayValue;
      
      if (progress < 1) requestAnimationFrame(updateNumber);
    }
    requestAnimationFrame(updateNumber);
  }
  
  // Card click: placeholder action (use modal or route later)
  portfolioItems.forEach(item => {
    const portfolioLink = item.querySelector('.portfolio-link');
    if (portfolioLink) {
      portfolioLink.addEventListener('click', function(e) {
        e.preventDefault();
        const projectTitle = item.querySelector('.portfolio-info h4').textContent;
        alert(`Opening project details for: ${projectTitle}`);
      });
    }
  });
  
  // Smooth scroll for in-page links
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Testimonials slider: arrows, dots, autoplay
  const testimonialsSlider = document.getElementById('testimonialsSlider');
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const testimonialsLeft = document.getElementById('testimonialsLeft');
  const testimonialsRight = document.getElementById('testimonialsRight');
  const testimonialsDots = document.getElementById('testimonialsDots');
  
  if (testimonialsSlider && testimonialsTrack) {
    const testimonialCards = testimonialsTrack.querySelectorAll('.testimonial-card');
    const totalCards = testimonialCards.length;
    const cardsPerView = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
    const totalSlides = Math.ceil(totalCards / cardsPerView);
    let currentSlide = 0;
    
    // Build dots based on slide count
    if (testimonialsDots) {
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        testimonialsDots.appendChild(dot);
      }
    }
    
    // Apply translate for current slide
    function updateSlider() {
      const cardWidth = testimonialCards[0].offsetWidth;
      const gap = 30;
      const translateX = -currentSlide * (cardWidth + gap) * cardsPerView;
      testimonialsTrack.style.transform = `translateX(${translateX}px)`;
      
      // Sync dots
      const dots = testimonialsDots?.querySelectorAll('.testimonial-dot');
      if (dots) {
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
        });
      }
    }
    
    // Jump to slide
    function goToSlide(slide) {
      currentSlide = Math.max(0, Math.min(slide, totalSlides - 1));
      updateSlider();
    }
    
    // Prev/next controls
    function prevSlide() {
      currentSlide = currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1;
      updateSlider();
    }
    function nextSlide() {
      currentSlide = currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1;
      updateSlider();
    }
    
    // Wire controls
    if (testimonialsLeft) testimonialsLeft.addEventListener('click', prevSlide);
    if (testimonialsRight) testimonialsRight.addEventListener('click', nextSlide);
    
    // Autoplay with pause on hover
    let autoPlayInterval = setInterval(nextSlide, 5000);
    testimonialsSlider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    testimonialsSlider.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    });
    
    // Recalc on resize
    window.addEventListener('resize', () => updateSlider());
    
    // Init
    updateSlider();
  }
});

// Small CSS helper for smooth card transitions
const style = document.createElement('style');
style.textContent = `
  .portfolio-item {
    transition: opacity 0.3s ease, transform 0.3s ease, display 0.3s ease;
  }
  .portfolio-item[style*="display: none"] {
    display: none !important;
  }
`;
document.head.appendChild(style);
