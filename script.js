// =========================================================
// Mobile nav toggle
// =========================================================
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =========================================================
// Wrap section titles in split-line spans for a scroll wipe-up reveal
// =========================================================
function initSplitTitles() {
  document.querySelectorAll('.section-title').forEach(el => {
    const text = el.textContent;
    el.innerHTML = `<span class="split-line"><span>${text}</span></span>`;
  });
}

// =========================================================
// Scroll reveal
// =========================================================
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  items.forEach(i => observer.observe(i));
}

// =========================================================
// Scroll progress bar
// =========================================================
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// =========================================================
// Nav scrollspy — highlights the current section's nav link
// =========================================================
function initScrollspy() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(links)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

// =========================================================
// Custom cursor — a small dot plus a trailing ring that
// scales up over interactive elements
// =========================================================
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;
  let targetX = ringX;
  let targetY = ringY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });

  function animateRing() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  document.querySelectorAll('a, button, .tag, input, select, textarea, summary').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}

// =========================================================
// Magnetic buttons — CTAs drift slightly toward the cursor
// =========================================================
function initMagneticButtons() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// =========================================================
// Skill tag marquee — duplicate content once for a seamless loop
// =========================================================
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

// =========================================================
// Hero parallax — the giant ghost initials drift slower than scroll
// =========================================================
function initHeroParallax() {
  const mark = document.getElementById('heroMark');
  if (!mark) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.15;
    mark.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

// =========================================================
// Card spotlight micro-interaction (project cards, skill panels, pitch cards)
// =========================================================
function initCardSpotlight() {
  const cards = document.querySelectorAll('.project-card, .skill-panel, .pitch-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', x + '%');
      card.style.setProperty('--y', y + '%');
    });
  });
}

// =========================================================
// Animated metrics — count-up numbers + fill bars on reveal
// =========================================================
function initMetrics() {
  const cards = document.querySelectorAll('.metric-card');
  if (!cards.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(card) {
    const target = parseInt(card.dataset.target, 10) || 0;
    const numEl = card.querySelector('.metric-num');
    card.style.setProperty('--target-pct', Math.min(target, 100) + '%');
    card.classList.add('is-counted');

    if (prefersReduced || !numEl) {
      if (numEl) numEl.textContent = target;
      return;
    }

    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      numEl.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    cards.forEach(animateCount);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  cards.forEach(c => observer.observe(c));
}

// =========================================================
// Ticket form — submits directly to Formspree (no email client)
// =========================================================
function initTicketForm() {
  const form = document.getElementById('ticketForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const endpoint = form.getAttribute('action');
    const isConfigured = endpoint && !endpoint.includes('YOUR_FORM_ID');

    if (!isConfigured) {
      status.textContent = 'Form isn\'t connected yet — see setup notes in script.js.';
      status.style.color = 'var(--amber)';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.style.color = 'var(--text-muted)';
    status.textContent = 'Submitting message...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        status.style.color = 'var(--green)';
        status.textContent = 'Message sent — I\'ll get back to you shortly.';
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      status.style.color = 'var(--red)';
      status.textContent = 'Something went wrong. Please email ikarukevin26@gmail.com directly.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// =========================================================
// Footer year
// =========================================================
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// =========================================================
// Init
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initSplitTitles();
  initReveal();
  initScrollProgress();
  initScrollspy();
  initCustomCursor();
  initMagneticButtons();
  initMarquee();
  initHeroParallax();
  initCardSpotlight();
  initMetrics();
  initTicketForm();
  setYear();
});
