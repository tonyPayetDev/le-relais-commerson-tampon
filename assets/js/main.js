/**
 * Le Relais Commerson - Restaurant au Tampon
 * Scripts principaux - Interactivité et animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(253, 248, 243, 0.98)';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = 'var(--shadow-md)';
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        navLinks.style.display = 'none';
      }
    });
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          mobileMenuBtn.click();
        }
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Menu tabs functionality
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      menuTabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');

      const category = tab.dataset.category;

      // Filter menu items
      menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Gallery lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay span')?.textContent || '';
      
      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close">&times;</button>
          <img src="${img.src}" alt="${img.alt}">
          ${caption ? `<p class="lightbox-caption">${caption}</p>` : ''}
        </div>
      `;
      
      // Add lightbox styles
      lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 2rem;
        cursor: pointer;
      `;
      
      const lightboxContent = lightbox.querySelector('.lightbox-content');
      lightboxContent.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        cursor: default;
      `;
      
      const lightboxImg = lightbox.querySelector('img');
      lightboxImg.style.cssText = `
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 8px;
      `;
      
      const lightboxClose = lightbox.querySelector('.lightbox-close');
      lightboxClose.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2.5rem;
        cursor: pointer;
        line-height: 1;
      `;
      
      const lightboxCaption = lightbox.querySelector('.lightbox-caption');
      if (lightboxCaption) {
        lightboxCaption.style.cssText = `
          color: white;
          text-align: center;
          margin-top: 1rem;
          font-size: 1.1rem;
        `;
      }
      
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      // Close lightbox
      const closeLightbox = () => {
        lightbox.remove();
        document.body.style.overflow = '';
      };
      
      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
      });
    });
  });

  // Form validation (if forms exist)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--color-accent)';
        } else {
          field.style.borderColor = '';
        }
      });
      
      if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Merci pour votre message ! Nous vous contacterons bientôt.';
        successMsg.style.cssText = `
          background: var(--color-success);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
        `;
        
        form.appendChild(successMsg);
        form.reset();
        
        setTimeout(() => {
          successMsg.remove();
        }, 5000);
      }
    });
  });

  // Lazy loading for images
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px'
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));

  // Counter animation for stats
  const counters = document.querySelectorAll('.counter');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));

  // Active navigation link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Phone number click tracking (optional analytics)
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      console.log('Phone call initiated');
      // Here you could add analytics tracking
    });
  });

  // Newsletter subscription (if exists)
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      if (email) {
        const successMsg = document.createElement('p');
        successMsg.textContent = 'Merci de votre inscription !';
        successMsg.style.color = 'var(--color-success)';
        successMsg.style.marginTop = '0.5rem';
        
        newsletterForm.appendChild(successMsg);
        newsletterForm.reset();
        
        setTimeout(() => {
          successMsg.remove();
        }, 3000);
      }
    });
  }
});

// Preload critical images
const preloadImages = [
  'assets/images/hero-bg.jpg'
];

preloadImages.forEach(src => {
  const img = new Image();
  img.src = src;
});
