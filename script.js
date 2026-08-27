// =========================================================
// Boot sequence in hero terminal
// =========================================================
const bootLines = [
  { text: '$ status --check-all', type: 'cmd' },
  { text: '[ OK ] software_engineering .......... online', type: 'ok' },
  { text: '[ OK ] web_development ............... online', type: 'ok' },
  { text: '[ OK ] it_helpdesk_support ........... online', type: 'ok' },
  { text: '[ OK ] shopify ....................... online', type: 'ok' },
  { text: '[ OK ] ai_automation ................. online', type: 'ok' },
  { text: '[ OK ] VOIP .......................... online', type: 'ok' },
  { text: '', type: 'blank' },
  { text: 'Ready to help. Scroll down ↓', type: 'info' },
];

function runBootSequence() {
  const el = document.getElementById('bootLog');
  if (!el) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    el.textContent = bootLines.map(l => l.text).join('\n');
    return;
  }

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= bootLines.length) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.textContent = ' ';
      el.appendChild(cursor);
      return;
    }

    const line = bootLines[lineIndex];
    const span = document.createElement('span');
    span.className = line.type === 'ok' ? 'ok' : line.type === 'info' ? 'info' : '';
    el.appendChild(span);

    let charIndex = 0;
    const speed = line.type === 'cmd' ? 40 : 6;

    function typeChar() {
      if (charIndex < line.text.length) {
        span.textContent += line.text[charIndex];
        charIndex++;
        setTimeout(typeChar, speed);
      } else {
        el.appendChild(document.createTextNode('\n'));
        lineIndex++;
        setTimeout(typeLine, line.type === 'cmd' ? 200 : 90);
      }
    }
    typeChar();
  }

  typeLine();
}

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
// Hero parallax + mouse-reactive spotlight
// =========================================================
function initHeroInteractions() {
  const hero = document.querySelector('.hero');
  const grid = document.getElementById('heroGrid');
  if (!hero) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', mx + '%');
    hero.style.setProperty('--my', my + '%');
  });

  if (grid && !prefersReduced) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.08;
      grid.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }
}

// =========================================================
// Card spotlight micro-interaction (project cards & skill panels)
// =========================================================
function initCardSpotlight() {
  const cards = document.querySelectorAll('.project-card, .skill-panel');
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
    status.textContent = 'Submitting ticket...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        status.style.color = 'var(--green)';
        status.textContent = 'Ticket submitted — I\'ll get back to you shortly.';
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
  runBootSequence();
  initNavToggle();
  initReveal();
  initScrollProgress();
  initScrollspy();
  initHeroInteractions();
  initCardSpotlight();
  initMetrics();
  initTicketForm();
  setYear();
});
