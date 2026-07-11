/* ─────────────────────────────────────────────
   script.js — Fachri Azizy Portfolio
   All interactivity: navbar, AOS, counters,
   skill bars, particle canvas, form handler
───────────────────────────────────────────── */

'use strict';

/* ══════════════════════════════
   1. NAVBAR – scroll behaviour
══════════════════════════════ */
(function initNavbar() {
  const nav = document.getElementById('mainNav');
  const navContent = document.getElementById('navContent');
  const navToggler = document.querySelector('.navbar-toggler');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Auto-close mobile menu on scroll if it's open
    if (navContent && navContent.classList.contains('show')) {
      // Use Bootstrap's API to hide it gracefully, or fallback to class removal
      if (typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(navContent);
        if (bsCollapse) bsCollapse.hide();
      } else {
        navContent.classList.remove('show');
        if (navToggler) navToggler.setAttribute('aria-expanded', 'false');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
})();


/* ══════════════════════════════
   2. SCROLL-REVEAL (AOS-lite)
══════════════════════════════ */
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = el.style.transitionDelay || '0s';
          // respect inline transition-delay already set
          el.classList.add('aos-animate');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════
   3. ANIMATED COUNTERS
══════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target], .pf-num[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const step     = 16;   // ~60fps
    const increment = (target / duration) * step;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════
   4. SKILLS TAB SWITCHER
══════════════════════════════ */
(function initSkillTabs() {
  const tabs   = document.querySelectorAll('.sk-tab');
  const panels = document.querySelectorAll('.sk-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tab states
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panel states
      panels.forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();


/* ══════════════════════════════
   5. HERO PARTICLE CANVAS
══════════════════════════════ */
(function initParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    return {
      x:    Math.random() * W,
      y:    H + Math.random() * 40,
      r:    Math.random() * 1.5 + 0.4,
      vx:   (Math.random() - 0.5) * 0.4,
      vy:   -(Math.random() * 0.6 + 0.3),
      alpha: Math.random() * 0.4 + 0.1,
    };
  }

  function initPool() {
    particles = Array.from({ length: 55 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Extract RGB from CSS variable to keep it dynamic across themes
    let rgbAccent = getComputedStyle(document.documentElement).getPropertyValue('--rgb-accent').trim() || '74, 92, 106';

    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgbAccent}, ${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) particles[i] = createParticle();
    });
    requestAnimationFrame(draw);
  }

  resize();
  initPool();
  draw();
  window.addEventListener('resize', () => { resize(); initPool(); });
})();


/* ══════════════════════════════
   6. CONTACT FORM HANDLER
══════════════════════════════ */
function handleFormSubmit(event) {
  event.preventDefault();

  const btn      = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  const name     = document.getElementById('formName').value.trim();

  // Simulate sending
  btn.disabled     = true;
  btn.innerHTML    = '<i class="bi bi-hourglass-split me-2"></i>Sending…';
  feedback.textContent = '';

  setTimeout(() => {
    btn.disabled  = false;
    btn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Send Message';
    feedback.textContent = `Thank you, ${name || 'there'}! I'll get back to you soon.`;
    event.target.reset();

    // Clear feedback after 5 s
    setTimeout(() => { feedback.textContent = ''; }, 5000);
  }, 1400);
}


/* ══════════════════════════════
   7. SMOOTH SCROLL for anchor links
══════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile navbar if open
      const collapse = document.getElementById('navContent');
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ══════════════════════════════
   7. THEME SWITCHER
══════════════════════════════ */
(function initThemeSwitcher() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  if (toggleBtns.length === 0) return;

  // Check local storage or system preference
  const currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if(icon) icon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
    });
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      
      if (theme === 'light') {
        // Switch to dark
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        toggleBtns.forEach(b => {
          const i = b.querySelector('i');
          if(i) i.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        });
      } else {
        // Switch to light
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggleBtns.forEach(b => {
          const i = b.querySelector('i');
          if(i) i.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        });
      }
    });
  });
})();
