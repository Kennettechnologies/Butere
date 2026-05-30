/* Butere County Hospital - Main JS file */

document.addEventListener('DOMContentLoaded', function() {
  
  // Theme Switching
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('data-bs-theme', currentTheme); // sync Bootstrap
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', function() {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.setAttribute('data-bs-theme', newTheme); // sync Bootstrap
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  // =============================================
  // SITE SEARCH — full client-side implementation
  // =============================================

  // Static content index — all searchable items on the site
  const SEARCH_INDEX = [
    // Pages
    { title: 'Home',                    desc: 'Butere County Hospital homepage and overview',                           url: 'index.html',        icon: 'fa-house',            cat: 'Page' },
    { title: 'About Us',                desc: 'Hospital history, mission, vision, core values, and leadership',        url: 'about.html',        icon: 'fa-circle-info',      cat: 'Page' },
    { title: 'Services',                desc: 'All medical services offered at Butere County Hospital',                url: 'services.html',     icon: 'fa-briefcase-medical',cat: 'Page' },
    { title: 'Departments',             desc: 'All hospital departments, wards, and clinical units',                   url: 'departments.html',  icon: 'fa-hospital',         cat: 'Page' },
    { title: 'Our Doctors',             desc: 'Meet our qualified medical practitioners and specialists',              url: 'doctors.html',      icon: 'fa-user-doctor',      cat: 'Page' },
    { title: 'News & Events',           desc: 'Latest hospital news, health campaigns, and upcoming events',           url: 'news.html',         icon: 'fa-newspaper',        cat: 'Page' },
    { title: 'Gallery',                 desc: 'Photos of our hospital facilities, staff, and events',                  url: 'gallery.html',      icon: 'fa-images',           cat: 'Page' },
    { title: 'Contact Us',              desc: 'Get in touch — location, phone numbers, email, and map',               url: 'contact.html',      icon: 'fa-envelope',         cat: 'Page' },
    { title: 'Book Appointment',        desc: 'Schedule a consultation with our specialist doctors online',            url: 'appointments.html', icon: 'fa-calendar-check',   cat: 'Page' },
    { title: 'Patient FAQs',            desc: 'Answers to common questions about services, fees, and coverage',        url: 'faq.html',          icon: 'fa-circle-question',  cat: 'Page' },
    { title: 'Careers & Attachments',   desc: 'Job openings, student internships, and clinical attachments',           url: 'careers.html',      icon: 'fa-briefcase',        cat: 'Page' },
    // Departments
    { title: 'Outpatient (OPD)',        desc: 'General consultations, triage, and routine outpatient care',            url: 'departments.html',  icon: 'fa-stethoscope',      cat: 'Department' },
    { title: 'Maternity & Theatre',     desc: 'Antenatal clinics, safe delivery, postnatal care, and surgery',         url: 'departments.html',  icon: 'fa-baby',             cat: 'Department' },
    { title: 'Pediatrics Ward',         desc: 'Inpatient care for children, neonates, and immunisation',               url: 'departments.html',  icon: 'fa-child',            cat: 'Department' },
    { title: 'Medical Laboratory',      desc: 'Blood tests, hematology, PCR, serology, and rapid diagnostics',         url: 'departments.html',  icon: 'fa-flask',            cat: 'Department' },
    { title: 'Pharmacy',                desc: 'Medication dispensing, SHA-covered drugs, and counseling',              url: 'departments.html',  icon: 'fa-pills',            cat: 'Department' },
    { title: 'Radiology & X-Ray',       desc: 'X-ray imaging, ultrasound, and diagnostic radiology services',          url: 'departments.html',  icon: 'fa-x-ray',            cat: 'Department' },
    { title: 'Dental Clinic',           desc: 'Dental checkups, fillings, extractions, and oral health care',          url: 'departments.html',  icon: 'fa-tooth',            cat: 'Department' },
    { title: 'Comprehensive Care (CCC)','desc': 'HIV/AIDS management, ARV therapy, VCT, and TB care',                  url: 'departments.html',  icon: 'fa-ribbon',           cat: 'Department' },
    // Services
    { title: 'Emergency Services',      desc: '24-hour emergency care, trauma response, and critical care',            url: 'services.html',     icon: 'fa-truck-medical',    cat: 'Service' },
    { title: 'SHA Insurance',           desc: 'Social Health Authority card accepted for all services',                url: 'services.html',     icon: 'fa-id-card',          cat: 'Service' },
    { title: 'Vaccination & Immunisation','desc':'Child and adult immunisation, polio, measles, and HPV vaccines',     url: 'services.html',     icon: 'fa-syringe',          cat: 'Service' },
    { title: 'Family Planning',         desc: 'Contraception counseling, implants, IUDs, and family planning',         url: 'services.html',     icon: 'fa-heart-pulse',      cat: 'Service' },
    { title: 'Linda Mama',              desc: 'Free maternity care under the Linda Mama / SHA program',                url: 'services.html',     icon: 'fa-baby-carriage',    cat: 'Service' },
    { title: 'Mental Health',           desc: 'Psychological support, counseling, and mental wellness',                url: 'services.html',     icon: 'fa-brain',            cat: 'Service' },
    // Careers
    { title: 'Nursing Attachment',      desc: 'Clinical rotation for diploma and degree nursing students',             url: 'careers.html',      icon: 'fa-user-nurse',       cat: 'Career' },
    { title: 'ICT Student Attachment',  desc: 'IT attachment in hospital systems and health informatics',              url: 'careers.html',      icon: 'fa-laptop-medical',   cat: 'Career' },
    { title: 'Medical Lab Internship',  desc: 'Six-month internship for Medical Laboratory Science graduates',         url: 'careers.html',      icon: 'fa-flask',            cat: 'Career' },
    { title: 'Community Health Volunteer','desc':'Volunteer in vaccination campaigns, sanitation, and outreach',       url: 'careers.html',      icon: 'fa-hands-helping',    cat: 'Career' },
  ];

  const searchToggle  = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose   = document.getElementById('search-close');
  const searchInput   = document.getElementById('site-search-input');

  // Inject results container once
  let searchResults = null;
  if (searchOverlay) {
    const inner = searchOverlay.querySelector('.search-overlay-inner');
    searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.id = 'search-results';
    searchOverlay.querySelector('.search-overlay-inner').insertAdjacentElement('afterend', searchResults);
  }

  // Perform search and render results
  function doSearch(query) {
    if (!searchResults) return;
    query = query.trim().toLowerCase();

    if (!query) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('has-results');
      return;
    }

    const tokens = query.split(/\s+/);
    const matches = SEARCH_INDEX.filter(item => {
      const haystack = (item.title + ' ' + item.desc + ' ' + item.cat).toLowerCase();
      return tokens.every(t => haystack.includes(t));
    }).slice(0, 8); // cap at 8 results

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-no-results"><i class="fa-solid fa-magnifying-glass-minus"></i> No results for "<strong>${query}</strong>"</div>`;
      searchResults.classList.add('has-results');
      return;
    }

    searchResults.innerHTML = matches.map((item, i) => `
      <a href="${item.url}" class="search-result-item" data-index="${i}" tabindex="0">
        <div class="search-result-icon"><i class="fa-solid ${item.icon}"></i></div>
        <div class="search-result-body">
          <div class="search-result-title">${item.title}</div>
          <div class="search-result-desc">${item.desc}</div>
        </div>
        <span class="search-result-cat">${item.cat}</span>
      </a>
    `).join('');
    searchResults.classList.add('has-results');
  }

  // Keyboard navigation within results
  let selectedIdx = -1;
  function navigateResults(dir) {
    if (!searchResults) return;
    const items = searchResults.querySelectorAll('.search-result-item');
    if (!items.length) return;
    items[selectedIdx]?.classList.remove('focused');
    selectedIdx = (selectedIdx + dir + items.length) % items.length;
    items[selectedIdx].classList.add('focused');
    items[selectedIdx].scrollIntoView({ block: 'nearest' });
  }

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    selectedIdx = -1;
    setTimeout(() => searchInput && searchInput.focus(), 100);
  }
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
    if (searchInput) searchInput.value = '';
    if (searchResults) { searchResults.innerHTML = ''; searchResults.classList.remove('has-results'); }
    selectedIdx = -1;
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose)  searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
  }
  if (searchInput) {
    searchInput.addEventListener('input', () => { selectedIdx = -1; doSearch(searchInput.value); });
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown')  { e.preventDefault(); navigateResults(1); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); navigateResults(-1); }
      if (e.key === 'Enter') {
        const focused = searchResults && searchResults.querySelector('.search-result-item.focused');
        if (focused) { closeSearch(); window.location.href = focused.getAttribute('href'); }
        else {
          const first = searchResults && searchResults.querySelector('.search-result-item');
          if (first) { closeSearch(); window.location.href = first.getAttribute('href'); }
        }
      }
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSearch();
  });

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
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
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

  // Custom Search Fields (page-level filter, e.g. doctors/gallery)
  const pageSearchInput = document.getElementById('search-input');
  if (pageSearchInput && itemsToFilter.length > 0) {
    pageSearchInput.addEventListener('keyup', function() {
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
        .catch(_ => {
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
        .catch(_ => {
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
