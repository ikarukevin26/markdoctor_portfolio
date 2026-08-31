
// =========================================================
// Center flow — original vanilla-JS radial diagram inspired by
// React Bits Pro's "Center Flow" concept (a licensed component this
// project has no access to and no React build to install it into).
// Renders one node per core skill, each connected to a pulsing hub
// by a spoke with a continuously flowing dash animation.
// =========================================================
const CORE_SKILLS = [
  { short: 'Tech Support', full: 'Technical Support & Troubleshooting' },
  { short: 'Help Desk', full: 'Tier 1–2 Help Desk Support' },
  { short: 'Incident Mgmt', full: 'Incident Management & Root Cause Analysis' },
  {
    short: 'Cloud Support', full: 'Cloud Platform Support (Microsoft Azure, SaaS)',
    nested: [
      { short: 'Microsoft Azure', full: 'Microsoft Azure' },
      { short: 'SaaS', full: 'SaaS Platforms' }
    ]
  },
  { short: 'Active Directory', full: 'Active Directory & User Access Management' },
  {
    short: 'Networking', full: 'Network Troubleshooting (TCP/IP, DNS, DHCP, VLAN, NAT, Firewalls, QoS)',
    nested: [
      { short: 'TCP/IP', full: 'TCP/IP' },
      { short: 'DNS', full: 'DNS' },
      { short: 'DHCP', full: 'DHCP' },
      { short: 'VLAN', full: 'VLAN' },
      { short: 'NAT', full: 'NAT' },
      { short: 'Firewalls', full: 'Firewalls' },
      { short: 'QoS', full: 'QoS' }
    ]
  },
  {
    short: 'VoIP & SIP', full: 'VoIP & SIP Systems (Call Routing, IVR, RTP, Softphones)',
    nested: [
      { short: 'Call Routing', full: 'Call Routing' },
      { short: 'IVR', full: 'IVR' },
      { short: 'RTP', full: 'RTP' },
      { short: 'Softphones', full: 'Softphones' }
    ]
  },
  {
    short: 'Databases', full: 'Database Troubleshooting (MySQL, Microsoft SQL Server, PostgreSQL, NoSQL)',
    nested: [
      { short: 'MySQL', full: 'MySQL' },
      { short: 'PostgreSQL', full: 'PostgreSQL' },
      { short: 'SQL Server', full: 'Microsoft SQL Server' },
      { short: 'Neo4j', full: 'Neo4j' },
      { short: 'SQLite', full: 'SQLite' }
    ]
  },
  { short: 'Ticketing & Docs', full: 'Ticketing Systems & Technical Documentation' },
  { short: 'Remote Support', full: 'Remote Support Tools' },
  {
    short: 'Software Dev', full: 'Software Development (C#, JavaScript, HTML/CSS, Visual Studio)',
    nested: [
      { short: 'C#', full: 'C#' },
      { short: 'JavaScript', full: 'JavaScript' },
      { short: 'HTML/CSS', full: 'HTML/CSS' },
      { short: 'Visual Studio', full: 'Visual Studio' }
    ]
  },
  { short: 'CI/CD', full: 'CI/CD' },
  {
    short: 'AI Automation', full: 'AI Workflow Automation (n8n Cloud, Claude)',
    nested: [
      { short: 'n8n Cloud', full: 'n8n Cloud' },
      { short: 'Claude', full: 'Claude' }
    ]
  },
  { short: 'Leadership', full: 'Team Leadership & Training' }
];

function buildCenterFlow(config) {
  const container = document.getElementById(config.containerId);
  const caption = document.getElementById(config.captionId);
  if (!container) return;

  const NS = 'http://www.w3.org/2000/svg';
  const size = config.size;
  const cx = size / 2;
  const cy = size / 2;
  const radius = config.radius;
  const hubRadius = config.hubRadius;
  const nodeRadius = config.nodeRadius || 6;
  const fontSize = config.fontSize || 12;
  const items = config.items;
  const colors = ['var(--green)', 'var(--cyan)', 'var(--amber)', 'var(--accent)'];
  const defaultCaption = caption ? caption.textContent : '';

  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(key => node.setAttribute(key, attrs[key]));
    return node;
  }

  const svg = el('svg', { viewBox: `0 0 ${size} ${size}` });

  const hubGlow = el('circle', {
    cx, cy, r: hubRadius + 16,
    fill: 'var(--accent)', 'fill-opacity': '0.16',
    class: 'center-flow-hub-glow'
  });
  svg.appendChild(hubGlow);

  const spokesGroup = el('g', {});
  const nodesGroup = el('g', {});

  const groups = [];

  items.forEach((item, i) => {
    const angle = (Math.PI * 2 * i) / items.length - Math.PI / 2;
    const nx = cx + radius * Math.cos(angle);
    const ny = cy + radius * Math.sin(angle);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const color = colors[i % colors.length];

    const spoke = el('line', {
      x1: cx, y1: cy, x2: nx, y2: ny,
      class: 'center-flow-spoke', stroke: color, 'stroke-width': '1.6'
    });
    spoke.style.animationDelay = `${(i * 0.09).toFixed(2)}s`;
    spokesGroup.appendChild(spoke);

    const g = el('g', {
      class: 'center-flow-node-group', tabindex: '0', role: 'button',
      'aria-label': item.full
    });

    const node = el('circle', {
      cx: nx, cy: ny, r: nodeRadius, fill: color, class: 'center-flow-node'
    });
    g.appendChild(node);

    let anchor = 'middle';
    let lx = nx;
    let ly = ny - (nodeRadius + 10);
    if (cos > 0.3) {
      anchor = 'start';
      lx = nx + 13;
      ly = ny + 4;
    } else if (cos < -0.3) {
      anchor = 'end';
      lx = nx - 13;
      ly = ny + 4;
    } else {
      ly = sin > 0 ? ny + (nodeRadius + 14) : ny - (nodeRadius + 7);
    }

    const label = el('text', {
      x: lx, y: ly, 'text-anchor': anchor, 'font-size': String(fontSize),
      class: 'center-flow-label'
    });
    label.textContent = item.short;
    g.appendChild(label);

    if (item.nested && item.nested.length) {
      const subCluster = el('g', { class: 'center-flow-subcluster' });
      subCluster.style.transformOrigin = `${nx}px ${ny}px`;

      const subRadius = nodeRadius + 58;
      const spreadDeg = item.nested.length > 5 ? 85 : 100;
      const spreadRad = (spreadDeg * Math.PI) / 180;
      const subFontSize = Math.max(9, fontSize - (item.nested.length > 5 ? 3 : 2));

      item.nested.forEach((subItem, j) => {
        const subAngle = angle + (item.nested.length === 1 ? 0 : spreadRad * (j / (item.nested.length - 1) - 0.5));
        const subCos = Math.cos(subAngle);
        const subSin = Math.sin(subAngle);
        const sx = nx + subRadius * subCos;
        const sy = ny + subRadius * subSin;
        const subColor = colors[(i + j + 1) % colors.length];

        const subSpoke = el('line', {
          x1: nx, y1: ny, x2: sx, y2: sy,
          class: 'center-flow-subspoke', stroke: subColor, 'stroke-width': '1.3'
        });
        subSpoke.style.animationDelay = `${(j * 0.08).toFixed(2)}s`;
        subCluster.appendChild(subSpoke);

        const subGroup = el('g', {
          class: 'center-flow-subnode-group', tabindex: '0', role: 'button',
          'aria-label': subItem.full
        });

        const subNode = el('circle', {
          cx: sx, cy: sy, r: nodeRadius - 1.5, fill: subColor, class: 'center-flow-subnode'
        });
        subGroup.appendChild(subNode);

        let subAnchor = 'middle';
        let slx = sx;
        let sly = sy - (nodeRadius + 8);
        if (subCos > 0.3) {
          subAnchor = 'start';
          slx = sx + 10;
          sly = sy + 3;
        } else if (subCos < -0.3) {
          subAnchor = 'end';
          slx = sx - 10;
          sly = sy + 3;
        } else {
          sly = subSin > 0 ? sy + (nodeRadius + 11) : sy - (nodeRadius + 6);
        }

        const subLabel = el('text', {
          x: slx, y: sly, 'text-anchor': subAnchor, 'font-size': String(subFontSize),
          class: 'center-flow-sublabel'
        });
        subLabel.textContent = subItem.short;
        subGroup.appendChild(subLabel);

        subGroup.addEventListener('mouseenter', () => { if (caption) caption.textContent = subItem.full; });
        subGroup.addEventListener('focus', () => { if (caption) caption.textContent = subItem.full; });
        subGroup.addEventListener('mouseleave', () => { if (caption) caption.textContent = item.full; });
        subGroup.addEventListener('blur', () => { if (caption) caption.textContent = item.full; });

        subCluster.appendChild(subGroup);
      });

      g.appendChild(subCluster);
    }

    function activate() {
      groups.forEach((grp, idx) => grp.classList.toggle('is-active', idx === i));
      if (caption) caption.textContent = item.full;
    }
    function release() {
      groups.forEach(grp => grp.classList.remove('is-active'));
      if (caption) caption.textContent = defaultCaption;
    }

    g.addEventListener('mouseenter', activate);
    g.addEventListener('focus', activate);
    g.addEventListener('mouseleave', release);
    g.addEventListener('blur', release);

    groups.push(g);
    nodesGroup.appendChild(g);
  });

  svg.appendChild(spokesGroup);

  const hub = el('circle', {
    cx, cy, r: hubRadius, fill: 'var(--panel)', stroke: 'var(--accent)', 'stroke-width': '1.6'
  });
  svg.appendChild(hub);

  const hubFontSize = config.hubFontSize || fontSize;
  const hubLineGap = hubFontSize + 4;
  config.hubLines.forEach((line, i) => {
    const offset = (i - (config.hubLines.length - 1) / 2) * hubLineGap;
    const hubText = el('text', {
      x: cx, y: cy + offset + hubFontSize / 3, 'text-anchor': 'middle', 'font-size': String(hubFontSize),
      'font-weight': '700', fill: 'var(--text)', 'font-family': 'var(--font-mono)'
    });
    hubText.textContent = line;
    svg.appendChild(hubText);
  });

  svg.appendChild(nodesGroup);
  container.appendChild(svg);
}

function initCenterFlow() {
  buildCenterFlow({
    containerId: 'centerFlow',
    captionId: 'centerFlowCaption',
    items: CORE_SKILLS,
    size: 600,
    radius: 195,
    hubRadius: 38,
    hubLines: ['CORE', 'SKILLS']
  });
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
// =========================================================
// Smooth cursor — original vanilla-JS canvas cursor trail driven
// by spring physics, inspired by React Bits Pro's "Smooth Cursor"
// concept (a licensed component this project has no access to and
// no React build to install it into). Renders a fading trail of
// circles behind a spring-eased head dot that chases the real
// pointer, rather than snapping straight to it.
// =========================================================
function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function initSmoothCursor() {
  const canvas = document.getElementById('smoothCursor');
  if (!canvas) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8B93FF';

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let hasMouse = false;
  let isActive = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    hasMouse = true;
  });
  window.addEventListener('mouseleave', () => { hasMouse = false; });

  document.querySelectorAll('a, button, .tag, input, select, textarea, summary').forEach(el => {
    el.addEventListener('mouseenter', () => { isActive = true; });
    el.addEventListener('mouseleave', () => { isActive = false; });
  });

  // Spring-damper: acceleration pulls the head toward the pointer,
  // damping bleeds off velocity so it settles instead of oscillating
  // forever — a springy chase rather than a linear lerp-follow.
  const stiffness = 170;
  const damping = 20;
  let posX = mouseX;
  let posY = mouseY;
  let velX = 0;
  let velY = 0;

  const trail = [];
  const trailLength = 14;

  let lastTs = null;
  function animate(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(0.032, Math.max(0, ts - lastTs) / 1000);
    lastTs = ts;

    const ax = (mouseX - posX) * stiffness - velX * damping;
    const ay = (mouseY - posY) * stiffness - velY * damping;
    velX += ax * dt;
    velY += ay * dt;
    posX += velX * dt;
    posY += velY * dt;

    trail.push({ x: posX, y: posY });
    if (trail.length > trailLength) trail.shift();

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (hasMouse) {
      trail.forEach((p, i) => {
        const t = (i + 1) / trail.length;
        ctx.beginPath();
        ctx.fillStyle = hexToRgba(accentHex, 0.05 + 0.3 * t);
        ctx.arc(p.x, p.y, 1.5 + 5.5 * t, 0, Math.PI * 2);
        ctx.fill();
      });

      const headRadius = isActive ? 17 : 8;
      ctx.beginPath();
      ctx.shadowColor = hexToRgba(accentHex, 0.8);
      ctx.shadowBlur = isActive ? 22 : 10;
      ctx.fillStyle = hexToRgba(accentHex, 0.9);
      ctx.arc(posX, posY, headRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isActive) {
        ctx.beginPath();
        ctx.strokeStyle = hexToRgba(accentHex, 0.8);
        ctx.lineWidth = 1.5;
        ctx.arc(posX, posY, headRadius + 11, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
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
  initSmoothCursor();
  initMagneticButtons();
  initMarquee();
  initHeroParallax();
  initCardSpotlight();
  initMetrics();
  initCenterFlow();
  initTicketForm();
  setYear();
});
