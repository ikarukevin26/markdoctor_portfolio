// =========================================================
// Boot sequence in hero terminal
// =========================================================
const bootLines = [
  { text: '$ status --check-all', type: 'cmd' },
  { text: '[ OK ] software_engineering ......... online', type: 'ok' },
  { text: '[ OK ] web_development ............... online', type: 'ok' },
  { text: '[ OK ] it_helpdesk_support ........... online', type: 'ok' },
  { text: '[ OK ] shopify ........................ online', type: 'ok' },
  { text: '[ OK ] ai_automation .................. online', type: 'ok' },
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
// Ticket form (static site — opens the visitor's email client)
// =========================================================
function initTicketForm() {
  const form = document.getElementById('ticketForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    const mailto = `mailto:ikarukevin26@gmail.com` +
      `?subject=${encodeURIComponent('[Portfolio] ' + subject + ' — ' + name)}` +
      `&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;

    window.location.href = mailto;
    status.textContent = 'Opening your email client to send this ticket...';
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
