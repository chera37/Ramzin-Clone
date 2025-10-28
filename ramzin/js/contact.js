// Handles all contact page interactions
document.addEventListener('DOMContentLoaded', function() {

  // Form submission setup
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Collect form inputs
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const message = formData.get('message');

      // Basic input validation
      if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }

      // Disable button while sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'SENDING...';
      submitBtn.disabled = true;

      // Simulated sending (can replace with backend request)
      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        sendToWhatsApp(name, email, phone, message);
      }, 2000);
    });
  }

  // Check if email looks valid
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Simple toast-like notifications
  function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      padding: 16px 24px; border-radius: 8px;
      color: white; font-weight: 600;
      z-index: 9999; max-width: 400px;
      opacity: 0; transform: translateX(100%);
      transition: all 0.3s ease;
    `;

    notification.style.backgroundColor =
      type === 'success' ? '#28a745' :
      type === 'error' ? '#dc3545' :
      '#007bff';

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Open prefilled WhatsApp message
  function sendToWhatsApp(name, email, phone, message) {
    const whatsappNumber = '971504069380';
    const encodedMessage = encodeURIComponent(
      `New Contact Form Submission:\n\n` +
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nMessage: ${message}\n\nSent from Ramzin Building Contracting website`
    );
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    setTimeout(() => {
      if (confirm('Would you like to send this message via WhatsApp as well?')) {
        window.open(whatsappURL, '_blank');
      }
    }, 1000);
  }

  // Input focus effects
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
    input.addEventListener('blur', () => {
      if (!input.value) input.parentElement.classList.remove('focused');
    });
    if (input.value) input.parentElement.classList.add('focused');
  });

  // Smooth scroll for in-page links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Prevent map from blocking page scroll on mobile
  const mapContainer = document.querySelector('.map-container iframe');
  if (mapContainer) {
    mapContainer.addEventListener('touchstart', () => mapContainer.style.pointerEvents = 'auto');
    document.addEventListener('touchstart', e => {
      if (!mapContainer.contains(e.target)) mapContainer.style.pointerEvents = 'none';
    });
  }

  // Track phone link clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => console.log('Phone clicked:', link.href));
  });

  // Track email link clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => console.log('Email clicked:', link.href));
  });

  // Auto expand textarea height
  const textarea = document.querySelector('#message');
  if (textarea) {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  }
});

// Add custom styles for input focus/validation
const style = document.createElement('style');
style.textContent = `
  .form-group.focused input,
  .form-group.focused textarea {
    border-color: var(--accent);
    background: rgba(255,255,255,0.08);
  }
  .contact-form { position: relative; }
  .form-group { position: relative; }
  .form-group input:valid,
  .form-group textarea:valid { border-color: rgba(40, 167, 69, 0.5); }
  .form-group input:invalid:not(:placeholder-shown),
  .form-group textarea:invalid:not(:placeholder-shown) {
    border-color: rgba(220, 53, 69, 0.5);
  }
  .map-container iframe { pointer-events: none; }
  .map-container:hover iframe { pointer-events: auto; }
  @media (max-width: 768px) {
    .map-container iframe { pointer-events: auto; }
  }
`;
document.head.appendChild(style);
