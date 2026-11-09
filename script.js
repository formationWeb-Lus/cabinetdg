/* ==========================================================================
   SAFIRA — Script Principal v3.0 (Corrigé & Sécurisé)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. ANIMATION SCROLL REVEAL ( APPARITION DES ÉLÉMENTS AU DÉFILEMENT )
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-image');

  // Sécurité immédiate : si l'élément est déjà visible dans l'écran au chargement, on l'affiche
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('is-visible');
    }
  });

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.05, // Se déclenche dès que 5% de l'élément apparaît
    rootMargin: '0px 0px 50px 0px' // Anticipe légèrement l'apparition avant qu'il n'arrive à l'écran
  });

  revealElements.forEach(el => {
    scrollObserver.observe(el);
  });

  // 🛡️ SÉCURITÉ DE SECOURS : Si pour une raison quelconque un élément restait caché, 
  // on force l'affichage global de tout le contenu après 1.5 seconde.
  setTimeout(() => {
    revealElements.forEach(el => {
      el.classList.add('is-visible');
    });
  }, 1500);


  /* --------------------------------------------------------------------------
     2. GESTION DU DIAPORAMA HERO (CHANGEMENT TOUTES LES 4 SECONDES)
     -------------------------------------------------------------------------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dots .dot');
  const currentCounter = document.getElementById('slide-current');
  const nextBtn = document.getElementById('next-slide');
  const prevBtn = document.getElementById('prev-slide');
  
  let currentIndex = 0;
  let slideInterval;
  const totalSlides = slides.length;
  const intervalTime = 4000; // 4 secondes

  function goToSlide(index) {
    if (slides.length === 0) return;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (index >= totalSlides) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalSlides - 1;
    } else {
      currentIndex = index;
    }

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');

    if (currentCounter) {
      currentCounter.textContent = String(currentIndex + 1).padStart(2, '0');
    }
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  function startSlider() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function resetSliderTimer() {
    clearInterval(slideInterval);
    startSlider();
  }

  if (nextBtn) { nextBtn.addEventListener('click', () => { nextSlide(); resetSliderTimer(); }); }
  if (prevBtn) { prevBtn.addEventListener('click', () => { prevSlide(); resetSliderTimer(); }); }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => { goToSlide(index); resetSliderTimer(); });
  });

  if (slides.length > 0) { startSlider(); }


  /* --------------------------------------------------------------------------
     3. MENU BURGER MOBILE
     -------------------------------------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* --------------------------------------------------------------------------
     4. FILTRAGE ET RECHERCHE DE PROJETS
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('project-search');
  const emptyState = document.getElementById('empty-state');

  let activeFilter = 'all';
  let searchQuery = '';

  function filterProjects() {
    let visibleCount = 0;
    projectCards.forEach(card => {
      const status = card.getAttribute('data-status');
      const name = card.getAttribute('data-name') ? card.getAttribute('data-name').toLowerCase() : '';
      const matchesFilter = (activeFilter === 'all' || status === activeFilter);
      const matchesSearch = (name.includes(searchQuery));

      if (matchesFilter && matchesSearch) {
        card.removeAttribute('hidden');
        visibleCount++;
      } else {
        card.setAttribute('hidden', '');
      }
    });

    if (emptyState) {
      emptyState.toggleAttribute('hidden', visibleCount > 0);
    }
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeFilter = button.getAttribute('data-filter');
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterProjects();
    });
  }

  // Année dynamique dans le footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

});