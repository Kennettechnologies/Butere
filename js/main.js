/* Butere County Hospital - Main JS file */

document.addEventListener('DOMContentLoaded', function() {
  
  // Theme Switching
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', function() {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    }
  }

  // Sticky Navbar Scroll Effect
  const navbar = document.querySelector('.main-navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button display
    const scrollTopBtn = document.querySelector('.btn-scroll-top');
    if (scrollTopBtn) {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }
  });

  // Scroll to Top action
  const scrollTopBtn = document.querySelector('.btn-scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active Navbar links based on URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-navbar .nav-link');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Animated Counters
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const speed = 100; // lower is faster
          const targetNum = parseInt(target.getAttribute('data-target'));
          
          let count = 0;
          const updateCount = () => {
            const increment = Math.ceil(targetNum / speed);
            if (count < targetNum) {
              count += increment;
              if (count > targetNum) count = targetNum;
              target.innerText = count + (target.getAttribute('data-suffix') || '');
              setTimeout(updateCount, 15);
            } else {
              target.innerText = targetNum + (target.getAttribute('data-suffix') || '');
            }
          };
          updateCount();
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // Filter Systems (Gallery, Departments, Doctors)
  const filterBtns = document.querySelectorAll('.gallery-filter-btn, .filter-btn');
  const itemsToFilter = document.querySelectorAll('.filterable-item');

  if (filterBtns.length > 0 && itemsToFilter.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // active state toggler
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        itemsToFilter.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
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
  }

  // Custom Search Fields
  const searchInput = document.getElementById('search-input');
  if (searchInput && itemsToFilter.length > 0) {
    searchInput.addEventListener('keyup', function() {
      const query = this.value.toLowerCase().trim();

      itemsToFilter.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  }

  // Lightbox Image Viewer for Gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const title = this.querySelector('h4') ? this.querySelector('h4').innerText : '';
        const category = this.querySelector('span') ? this.querySelector('span').innerText : '';
        
        lightboxImg.src = img.src;
        lightboxCaption.innerText = title ? `${title} - ${category}` : category;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // prevent scrolling
      });
    });

    lightboxClose.addEventListener('click', function() {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    // Close when clicking outside of image
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Appointment & Contact Forms Handler (Formspree AJAX Integration)
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      const fields = appointmentForm.querySelectorAll('[required]');
      fields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Booking...';

        fetch('https://formspree.io/f/mwvzzbzk', {
          method: 'POST',
          body: new FormData(appointmentForm),
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (response.ok) {
            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('appointmentSuccessModal'));
            successModal.show();
            appointmentForm.reset();
          } else {
            alert('Oops! There was a problem submitting your request. Please try again.');
          }
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          alert('Oops! There was a problem submitting your request. Please check your connection and try again.');
        });
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let isValid = true;
      const fields = contactForm.querySelectorAll('[required]');
      fields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        fetch('https://formspree.io/f/mwvzzbzk', {
          method: 'POST',
          body: new FormData(contactForm),
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (response.ok) {
            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('contactSuccessModal'));
            successModal.show();
            contactForm.reset();
          } else {
            alert('Oops! There was a problem sending your message. Please try again.');
          }
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          alert('Oops! There was a problem sending your message. Please check your connection and try again.');
        });
      }
    });
  }

  // Event Countdown Clock (e.g. Health campaign countdown)
  const countdownDateEl = document.getElementById('countdown-date');
  if (countdownDateEl) {
    // Set target date (e.g. 30 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 15);

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        document.querySelector('.countdown-digits').innerHTML = '<h4>Campaign is underway!</h4>';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById('days').innerText = String(days).padStart(2, '0');
      document.getElementById('hours').innerText = String(hours).padStart(2, '0');
      document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
      document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // FAQ Page Category Accordion Filter
  const faqCategories = document.querySelectorAll('.faq-cat-btn');
  if (faqCategories.length > 0) {
    faqCategories.forEach(btn => {
      btn.addEventListener('click', function() {
        faqCategories.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const cat = this.getAttribute('data-faq-cat');
        const accordions = document.querySelectorAll('.faq-accordion-group');
        
        accordions.forEach(acc => {
          if (cat === 'all' || acc.getAttribute('data-faq-group') === cat) {
            acc.style.display = 'block';
          } else {
            acc.style.display = 'none';
          }
        });
      });
    });
  }

  // Department Modal Details Dynamic Injection
  const deptModals = document.querySelectorAll('.dept-detail-modal');
  // Just standard bootstrap modal triggers are handled natively by bootstrap,
  // but let's make sure modals have accessibility features.
});
