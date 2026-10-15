/**
 * Xclean Demo 1 - Interactive Functionality
 * Zero-dependency Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }

  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // 2. Hero Slider Implementation (Continuous Auto-Slideable Banner)
  const slides = document.querySelectorAll('.hero-slider-section .slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const progressBar = document.querySelector('.slider-progress-fill');
  let currentSlide = 0;
  let slideInterval;
  const SLIDE_DURATION = 4800; // 4.8s per slide

  function resetProgressBar() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    void progressBar.offsetWidth; // Force DOM reflow
    progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
    progressBar.style.width = '100%';
  }

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentSlide = index;

    slides.forEach((slide, i) => {
      const isActive = (i === currentSlide);
      slide.classList.toggle('active', isActive);

      // Re-trigger Craft Combine text reveal on active slide
      const slideTexts = slide.querySelectorAll('.cc-text-reveal, .cc-fade-reveal');
      if (isActive) {
        slideTexts.forEach(el => el.classList.remove('is-inview'));
        requestAnimationFrame(() => {
          slideTexts.forEach(el => el.classList.add('is-inview'));
        });
      } else {
        slideTexts.forEach(el => el.classList.remove('is-inview'));
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    resetProgressBar();
  }

  function startSlideTimer() {
    stopSlideTimer();
    resetProgressBar();
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, SLIDE_DURATION);
  }

  function stopSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startSlideTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startSlideTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startSlideTimer();
      });
    });

    // Touch swipe support on mobile
    const sliderContainer = document.querySelector('.hero-slider-section');
    if (sliderContainer) {
      let touchStartX = 0;
      sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (diff > 50) {
          showSlide(currentSlide + 1);
          startSlideTimer();
        } else if (diff < -50) {
          showSlide(currentSlide - 1);
          startSlideTimer();
        }
      }, { passive: true });
    }

    // Auto-slide starts immediately
    startSlideTimer();
  }

  // 4. Mobile Drawer Navigation
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn && drawer) {
    hamburgerBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Close when clicking any nav link
    const mobileLinks = drawer.querySelectorAll('.mobile-nav-item a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // 5. Animated Number Counters
  const counters = document.querySelectorAll('.counter-value, .feature-counter');

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const counter = entry.target;
        counter.classList.add('counted');
        const target = parseInt(counter.getAttribute('data-target') || counter.innerText.replace(/[^0-9]/g, ''));
        const suffix = counter.getAttribute('data-suffix') || '';
        if (!isNaN(target)) {
          let start = 0;
          const duration = 2000;
          const stepTime = Math.abs(Math.floor(duration / target)) || 10;
          const timer = setInterval(() => {
            start += Math.ceil(target / 80);
            if (start >= target) {
              counter.innerText = target + suffix;
              clearInterval(timer);
            } else {
              counter.innerText = start + suffix;
            }
          }, stepTime);
        }
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => countObserver.observe(counter));

  // 6. Craft Combine Style (craftcombine.org) Scroll-Triggered Text Animation System
  function initCraftCombineTextAnimations() {
    // Select all target titles across the website
    const targetHeadings = document.querySelectorAll(
      '.cc-text-reveal, .main-title, .split-ref-title, .split-title, .slide-title, .who-title, .feature-title, .section-header .main-title'
    );

    targetHeadings.forEach(el => {
      if (el.dataset.ccSplit) return;
      el.dataset.ccSplit = 'true';
      el.classList.add('cc-text-reveal');

      const originalText = el.textContent.replace(/\s+/g, ' ').trim();
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', originalText);
      }

      const childNodes = Array.from(el.childNodes);
      el.innerHTML = '';
      let wordIndex = 0;

      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/\s+/).filter(Boolean);
          words.forEach((word) => {
            const mask = document.createElement('span');
            mask.className = 'cc-word-mask';
            mask.setAttribute('aria-hidden', 'true');

            const wordSpan = document.createElement('span');
            wordSpan.className = 'cc-word';
            wordSpan.textContent = word;
            // Craft Combine stagger delay per word: 0.065s
            const delay = (wordIndex * 0.065).toFixed(3);
            wordSpan.style.setProperty('--cc-delay', `${delay}s`);
            wordIndex++;

            mask.appendChild(wordSpan);
            el.appendChild(mask);
            el.appendChild(document.createTextNode(' '));
          });
        } else if (node.nodeName === 'BR') {
          el.appendChild(document.createElement('br'));
        } else {
          const words = node.textContent.split(/\s+/).filter(Boolean);
          words.forEach((word) => {
            const mask = document.createElement('span');
            mask.className = 'cc-word-mask';
            mask.setAttribute('aria-hidden', 'true');

            const clone = node.cloneNode(false);
            clone.className = (node.className ? node.className + ' ' : '') + 'cc-word';
            clone.textContent = word;
            const delay = (wordIndex * 0.065).toFixed(3);
            clone.style.setProperty('--cc-delay', `${delay}s`);
            wordIndex++;

            mask.appendChild(clone);
            el.appendChild(mask);
            el.appendChild(document.createTextNode(' '));
          });
        }
      });
    });

    // Subtitles, badges, and kickers receive smooth spring fade-up
    const fadeTargets = document.querySelectorAll(
      '.sub-title, .split-sub-title, .split-pill, .slide-badge, .clients-badge, .projects-sub-badge, .cc-fade-reveal'
    );
    fadeTargets.forEach(el => {
      el.classList.add('cc-fade-reveal');
    });

    // IntersectionObserver triggers animation on scroll
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Exclude elements inside hero slides (controlled by slider)
        if (entry.target.closest('.hero-slider-section')) return;

        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.cc-text-reveal, .cc-fade-reveal').forEach(el => {
      if (!el.closest('.hero-slider-section')) {
        scrollObserver.observe(el);
      }
    });

    // Initial activation for the first hero slide
    const activeSlide = document.querySelector('.hero-slider-section .slide.active');
    if (activeSlide) {
      activeSlide.querySelectorAll('.cc-text-reveal, .cc-fade-reveal').forEach(el => {
        el.classList.add('is-inview');
      });
    }
  }

  initCraftCombineTextAnimations();

  // 8. Testimonials Interactive Slider (Touch, Arrows, Dynamic Dots & Auto-Play)
  function initTestimonialSlider() {
    const track = document.getElementById('testiTrack');
    const dotsContainer = document.getElementById('testiDots');
    const prevBtn = document.querySelector('.testi-prev');
    const nextBtn = document.querySelector('.testi-next');
    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;

    let currentIndex = 0;
    let autoInterval = null;

    function getPerView() {
      return window.innerWidth > 992 ? 2 : 1;
    }

    function getMaxIndex() {
      const perView = getPerView();
      return Math.max(0, cards.length - perView);
    }

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const perView = getPerView();
      const dotCount = Math.ceil(cards.length / perView);

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'testi-dot' + (i === Math.floor(currentIndex / perView) ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
        dot.addEventListener('click', () => {
          goToIndex(i * perView);
          restartTimer();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const perView = getPerView();
      const activeDotIndex = Math.min(
        Math.floor(currentIndex / perView),
        dotsContainer.children.length - 1
      );
      Array.from(dotsContainer.children).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeDotIndex);
      });
    }

    function updateSlider() {
      const perView = getPerView();
      const maxIdx = getMaxIndex();
      if (currentIndex > maxIdx) currentIndex = maxIdx;
      if (currentIndex < 0) currentIndex = 0;

      const cardWidth = cards[0].offsetWidth;
      const gap = perView === 2 ? 30 : 20;
      const moveDistance = currentIndex * (cardWidth + gap);

      track.style.transform = `translateX(-${moveDistance}px)`;
      updateDots();
    }

    function goToIndex(index) {
      const maxIdx = getMaxIndex();
      if (index > maxIdx) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = maxIdx;
      } else {
        currentIndex = index;
      }
      updateSlider();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const perView = getPerView();
        goToIndex(currentIndex + perView);
        restartTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const perView = getPerView();
        goToIndex(currentIndex - perView);
        restartTimer();
      });
    }

    // Touch / Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopTimer();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      const perView = getPerView();
      if (diff > 50) {
        goToIndex(currentIndex + perView);
      } else if (diff < -50) {
        goToIndex(currentIndex - perView);
      }
      startTimer();
    }, { passive: true });

    function startTimer() {
      stopTimer();
      autoInterval = setInterval(() => {
        const perView = getPerView();
        goToIndex(currentIndex + perView);
      }, 5500);
    }

    function stopTimer() {
      if (autoInterval) clearInterval(autoInterval);
    }

    function restartTimer() {
      stopTimer();
      startTimer();
    }

    const sliderWrapper = track.closest('.testimonials-slider-container');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', stopTimer);
      sliderWrapper.addEventListener('mouseleave', startTimer);
    }

    window.addEventListener('resize', () => {
      renderDots();
      updateSlider();
    });

    renderDots();
    updateSlider();
    startTimer();
  }

  initTestimonialSlider();

  // 9. Project Cards Interactive Touch / Click Toggle Support
  const projectCards = document.querySelectorAll('.project-card-item');
  if (projectCards.length > 0) {
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking on an anchor tag, let the standard link behavior occur
        if (e.target.closest('a')) return;

        const wasActive = card.classList.contains('is-active');
        projectCards.forEach(c => c.classList.remove('is-active'));
        if (!wasActive) {
          card.classList.add('is-active');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.project-card-item')) {
        projectCards.forEach(c => c.classList.remove('is-active'));
      }
    });
  }
});

