document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animation (Intersection Observer)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .benefit-card, .about-image').forEach(el => {
    // Initial state before observer
    if (!el.classList.contains('hero')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
      observer.observe(el);
    }
  });

  // Custom Fade-In Logic for Observer
  const style = document.createElement('style');
  style.innerHTML = `
    .fade-in-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // Update Observer callback to use the new class
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .benefit-card, .about-image').forEach(el => {
    if (!el.classList.contains('hero')) {
      revealObserver.observe(el);
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  const toggleMenu = () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMenu);
    // Accessibility: Enter key support
    mobileToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') toggleMenu();
    });
  }

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Custom Smooth Scroll for Nav Links (Zen Experience)
  const smoothScrollTo = (targetSelector, duration) => {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const targetPosition = target.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const easeInOutQuart = (t) => {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const scrollAmount = startPosition + distance * easeInOutQuart(progress);
      window.scrollTo(0, scrollAmount);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      smoothScrollTo(href, 2000); // 2 seconds for a slow, zen transition
    });
  });

  // Back to Top Logic
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      smoothScrollTo('#header', 2000); // 2 seconds for a slow, zen return to top
    });
  }

  // --- Ambient Music Player Logic ---
  const musicToggle = document.getElementById('music-toggle');
  const ambientAudio = document.getElementById('ambient-audio');
  
  if (musicToggle && ambientAudio) {
    const musicIcon = musicToggle.querySelector('.music-icon');
    const musicText = musicToggle.querySelector('.music-text');
    let isPlaying = false;

    const toggleMusic = () => {
      if (isPlaying) {
        ambientAudio.pause();
        musicToggle.classList.remove('playing');
      } else {
        // Simple volume ramp for smoother experience
        ambientAudio.volume = 0;
        ambientAudio.play().then(() => {
          let vol = 0;
          const interval = setInterval(() => {
            if (vol < 0.5) {
              vol += 0.05;
              ambientAudio.volume = vol;
            } else {
              clearInterval(interval);
            }
          }, 100);
        }).catch(error => {
          console.error("Error al reproducir audio:", error);
          musicToggle.classList.remove('playing');
          isPlaying = false;
          // Sugerencia silenciosa en consola en lugar de un alert intrusivo
          console.warn("Sugerencia: Guarda tu pista favorita como 'assets/ambient.mp3' para asegurar que la música siempre funcione localmente.");
        });
        
        musicToggle.classList.add('playing');
      }
      isPlaying = !isPlaying;
    };

    musicToggle.addEventListener('click', toggleMusic);
    
    // Accessibility
    musicToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMusic();
      }
    });
  }
});

