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
  }, { threshold: 0.15 });

  items.forEach(i => observer.observe(i));
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
  initTicketForm();
  setYear();
});
