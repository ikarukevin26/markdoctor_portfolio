// =========================================================
// Drift wall — vanilla-JS port of React Bits' DriftWall
// (github.com/DavidHDev/react-bits), rebuilt without React
// so it drops into this static site with no build step.
// =========================================================
// Standalone <img>-loaded SVGs can't see this site's stylesheet, so the
// icon micro-animations (same ones used on the project cards below) are
// embedded here as a self-contained <style> block, once per tile.
const DRIFT_TILE_ANIM_CSS = `
  .clock-hand { transform-origin: 20px 21px; animation: spin 6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .wing-flap { transform-origin: 24px 18px; animation: flap 0.7s ease-in-out infinite alternate; }
  @keyframes flap { from { transform: scaleY(1); } to { transform: scaleY(0.4) translateY(2px); } }
  .snake-move { stroke-dasharray: 3 3; animation: dash 1.1s linear infinite; }
  @keyframes dash { to { stroke-dashoffset: -18; } }
  .bar-1, .bar-2, .bar-3 { transform-box: fill-box; transform-origin: bottom; animation: bar-grow 1.8s ease-in-out infinite; }
  .bar-2 { animation-delay: 0.2s; }
  .bar-3 { animation-delay: 0.4s; }
  @keyframes bar-grow { 0%, 100% { transform: scaleY(0.75); } 50% { transform: scaleY(1); } }
  .icon-diamond { animation: glow 2.4s ease-in-out infinite; }
  @keyframes glow { 0%, 100% { filter: drop-shadow(0 0 0 transparent); } 50% { filter: drop-shadow(0 0 5px currentColor); } }
  .pos-blink { animation: blink-opacity 1.6s steps(1) infinite; }
  @keyframes blink-opacity { 0%, 60% { opacity: 1; } 80% { opacity: 0.15; } 100% { opacity: 1; } }
  .check-draw { stroke-dasharray: 18; stroke-dashoffset: 18; animation: draw 2.2s ease-in-out infinite; }
  @keyframes draw { 0% { stroke-dashoffset: 18; } 35%, 70% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -18; } }
  .scan-1, .scan-2, .scan-3 { animation: scan-fade 1.8s ease-in-out infinite; }
  .scan-2 { animation-delay: 0.2s; }
  .scan-3 { animation-delay: 0.4s; }
  @keyframes scan-fade { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
  .box-lid { transform-box: fill-box; transform-origin: center; animation: lid 2.4s ease-in-out infinite; }
  @keyframes lid { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
  .cloud-float { animation: float-x 3.2s ease-in-out infinite; }
  @keyframes float-x { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1.5px); } }
  .bag-swing { transform-box: fill-box; transform-origin: top center; animation: swing 2.4s ease-in-out infinite; }
  @keyframes swing { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2.5deg); } }
  .globe-spin { transform-box: fill-box; transform-origin: center; animation: globe 3.6s linear infinite; }
  @keyframes globe { 0% { transform: scaleX(1); } 50% { transform: scaleX(0.72); } 100% { transform: scaleX(1); } }
  .node-pulse { transform-box: fill-box; transform-origin: center; animation: node-beat 1.8s ease-in-out infinite; }
  .node-b { animation-delay: 0.3s; }
  .node-c { animation-delay: 0.6s; }
  @keyframes node-beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
  .edge-flow { stroke-dasharray: 2 3; animation: dash 1.4s linear infinite; }
  .bolt-flicker { animation: bolt-flicker 1.6s ease-in-out infinite; }
  @keyframes bolt-flicker { 0%, 100% { opacity: 1; } 45% { opacity: 0.35; } 55% { opacity: 1; } 80% { opacity: 0.6; } }
`;

function driftTileSVG(accent, icon, decor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 108" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <style>${DRIFT_TILE_ANIM_CSS}</style>
    <rect width="260" height="108" fill="#121210"/>
    <rect width="260" height="22" fill="#242419"/>
    <rect y="22" width="260" height="1" fill="#33332A"/>
    <circle cx="14" cy="11" r="2.6" fill="#33332A" stroke="none"/>
    <circle cx="24" cy="11" r="2.6" fill="#33332A" stroke="none"/>
    <circle cx="34" cy="11" r="2.6" fill="#33332A" stroke="none"/>
    ${icon}
    ${decor}
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function buildProjectTiles() {
  const green = '#3DDC84';
  const cyan = '#4FD1E8';
  const amber = '#F5A623';
  const rows = (x, w1, w2, w3) => `<g stroke-opacity="0.55"><path class="dash-1" d="M${x} 44h${w1}"/><path class="dash-2" d="M${x} 64h${w2}"/><path class="dash-3" d="M${x} 84h${w3}"/></g>`;
  const squares = (x, accent) => `<g fill="${accent}" fill-opacity="0.14">
    <rect class="scan-1" x="${x}" y="46" width="24" height="24" rx="4" stroke-opacity="0.5"/>
    <rect class="scan-2" x="${x + 34}" y="46" width="24" height="24" rx="4" stroke-opacity="0.5"/>
    <rect class="scan-3" x="${x + 68}" y="46" width="24" height="24" rx="4" stroke-opacity="0.5"/>
  </g>`;

  return [
    {
      title: 'Maluho Timesheet',
      href: 'https://github.com/ikarukevin26/Maluho-Timesheet',
      image: driftTileSVG(green, `<g transform="translate(4,28) scale(1.25)"><circle cx="20" cy="21" r="12"/><path class="clock-hand" d="M20 14v7l5 3"/><path d="M15 4h10M20 4v4"/></g>`, rows(112, 128, 94, 60))
    },
    {
      title: 'FlappyBird Quiz',
      href: 'https://github.com/ikarukevin26/FlappyBrid_Quiz',
      image: driftTileSVG(cyan, `<g transform="translate(4,28) scale(1.25)"><ellipse cx="18" cy="20" rx="8" ry="6"/><path class="wing-flap" d="M26 18l6-2-4 5"/><path d="M12 18c-2-2-2-5 0-6"/><circle cx="22" cy="17" r="1.1" fill="${cyan}" stroke="none"/></g>`, `<g stroke-opacity="0.6"><path d="M130 30v26M130 68v18"/><path d="M168 30v14M168 56v30"/><path d="M206 30v40M206 82v6"/></g>`)
    },
    {
      title: 'Snake Quiz',
      href: 'https://github.com/ikarukevin26/Snake_Quiz',
      image: driftTileSVG(amber, `<g transform="translate(4,28) scale(1.25)"><path class="snake-move" d="M8 14c0 4 4 4 4 8s4 4 4 8s4 4 8 4"/><circle cx="28" cy="10" r="2.3" fill="${amber}" stroke="none"/></g>`, `<g fill="${amber}" stroke="none"><circle class="scan-1" cx="112" cy="50" r="3"/><circle class="scan-2" cx="132" cy="50" r="3"/><circle class="scan-3" cx="152" cy="50" r="3"/><circle class="scan-2" cx="112" cy="70" r="3"/><circle class="scan-3" cx="132" cy="70" r="3"/><circle class="scan-1" cx="152" cy="70" r="3"/></g>`)
    },
    {
      title: 'Maluho Sales',
      href: 'https://github.com/ikarukevin26/Maluho-Sales',
      image: driftTileSVG(green, `<g transform="translate(4,28) scale(1.25)"><path class="bar-1" d="M8 32V16"/><path class="bar-2" d="M18 32V10"/><path class="bar-3" d="M28 32V21"/><path d="M6 32h28"/><path d="M23 12l6-5 3 3"/></g>`, rows(116, 124, 90, 56))
    },
    {
      title: 'The Real Maluho',
      href: 'https://github.com/ikarukevin26/The-Real-Maluho',
      image: driftTileSVG(cyan, `<g class="icon-diamond" transform="translate(4,28) scale(1.25)"><path d="M20 4l10 8-3 12H13L10 12z"/><path d="M13 24l7 12 7-12"/></g>`, squares(110, cyan))
    },
    {
      title: 'Maluho POS',
      href: 'https://github.com/ikarukevin26/Maluho-POS',
      image: driftTileSVG(amber, `<g transform="translate(4,28) scale(1.25)"><rect x="9" y="9" width="22" height="16" rx="2"/><path d="M9 15h22"/><path class="pos-blink" d="M14 30h12M20 25v5"/></g>`, rows(118, 112, 86, 60))
    },
    {
      title: 'Maluho Authenticator',
      href: 'https://github.com/ikarukevin26/MaluhoAuthenticator',
      image: driftTileSVG(green, `<g transform="translate(4,28) scale(1.25)"><path d="M20 5l12 5v9c0 8-5 13-12 16-7-3-12-8-12-16v-9z"/><path class="check-draw" d="M15 20l4 4 7-8"/></g>`, rows(114, 118, 84, 50))
    },
    {
      title: 'Fingerprint Helper',
      href: 'https://github.com/ikarukevin26/FingerprintHelper',
      image: driftTileSVG(cyan, `<g transform="translate(4,28) scale(1.25)"><path class="scan-1" d="M20 10a10 10 0 0 1 10 10v3"/><path class="scan-2" d="M20 14a6 6 0 0 1 6 6v4"/><path class="scan-3" d="M20 18a2 2 0 0 1 2 2v6"/><path class="scan-2" d="M14 16a10 10 0 0 0-1 4v4"/><path class="scan-1" d="M17 14a10 10 0 0 0-4 8v3"/></g>`, squares(112, cyan))
    },
    {
      title: 'Inventory',
      href: 'https://github.com/ikarukevin26/Inventory',
      image: driftTileSVG(amber, `<g transform="translate(4,28) scale(1.25)"><path class="box-lid" d="M20 5l14 7-14 7-14-7z"/><path d="M6 12v16l14 7 14-7V12"/><path d="M20 19v16"/></g>`, rows(116, 120, 88, 56))
    },
    {
      title: 'Azure Customer View',
      href: 'https://github.com/ikarukevin26/azure-customer-view',
      image: driftTileSVG(green, `<g transform="translate(4,28) scale(1.25)"><path class="cloud-float" d="M13 26a6 6 0 0 1 0-12 8 8 0 0 1 15.5-2A6.5 6.5 0 0 1 27 26z"/><path d="M14 31h4"/><path d="M20 31h6"/></g>`, `<g stroke-opacity="0.9"><path class="bar-1" d="M120 90V62"/><path class="bar-2" d="M150 90V44"/><path class="bar-3" d="M180 90V70"/><path class="bar-1" d="M210 90V54"/><path d="M112 90h108" stroke-opacity="0.4"/></g>`)
    },
    {
      title: 'Maluho Luxe Shoppe',
      href: 'https://github.com/ikarukevin26/maluho-luxe-shoppe-apple',
      image: driftTileSVG(cyan, `<g transform="translate(4,28) scale(1.25)"><path d="M11 14h18l-2 18H13z"/><path class="bag-swing" d="M15 14a5 5 0 0 1 10 0"/></g>`, squares(112, cyan))
    },
    {
      title: 'Maluho Web',
      href: 'https://github.com/ikarukevin26/Maluho-Web',
      image: driftTileSVG(amber, `<g transform="translate(4,28) scale(1.25)"><circle cx="20" cy="20" r="14"/><path class="globe-spin" d="M6 20h28M20 6c4 4 4 24 0 28M20 6c-4 4-4 24 0 28" stroke-opacity="0.7"/></g>`, rows(116, 124, 94, 70))
    },
    {
      title: 'Neo4j Sample',
      href: 'https://github.com/ikarukevin26/sample_neo4j',
      image: driftTileSVG(green, `<g transform="translate(4,28) scale(1.25)"><circle class="node-pulse node-a" cx="10" cy="12" r="3.2"/><circle class="node-pulse node-b" cx="30" cy="12" r="3.2"/><circle class="node-pulse node-c" cx="20" cy="30" r="3.2"/><path class="edge-flow" d="M13 12h14M12 15l6 12M28 15l-6 12"/></g>`, `<g><circle class="node-pulse node-b" cx="150" cy="46" r="4"/><circle class="node-pulse node-c" cx="200" cy="42" r="4"/><circle class="node-pulse node-a" cx="175" cy="86" r="4"/><path class="edge-flow" d="M154 47h42M152 50l21 34M197 45l-20 38" stroke-opacity="0.5"/></g>`)
    },
    {
      title: 'The Real Maluho Automation',
      href: 'https://github.com/ikarukevin26/TheRealMaluho-Automation',
      image: driftTileSVG(cyan, `<g transform="translate(4,28) scale(1.15)"><path d="M9 12h22a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H18l-7 5v-5h-2a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z"/><path class="bolt-flicker" d="M21 16l-4 6h4l-1 5 5-6h-4z" fill="${cyan}" stroke="none"/></g>`, `<path class="edge-flow" d="M118 62h20" stroke-opacity="0.6"/><g><rect x="140" y="48" width="26" height="26" rx="4"/><path d="M144 56h18M144 62h18M144 68h12" stroke-opacity="0.6"/></g><path class="edge-flow" d="M168 62h18" stroke-opacity="0.6"/><g><path d="M188 50h30v22h-30z"/><path class="node-pulse node-b" d="M188 52l15 11 15-11"/></g>`)
    }
  ];
}

function driftColumnFactor(index, variance) {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
}

function initDriftWall() {
  const container = document.getElementById('driftWall');
  if (!container) return;

  const items = buildProjectTiles();
  const opts = {
    columns: 5,
    tileWidth: 180,
    tileHeight: 118,
    gap: 16,
    radius: 12,
    tilt: 14,
    turn: -12,
    roll: 0,
    perspective: 1100,
    depth: 100,
    speed: 34,
    direction: 'up',
    variance: 0.4,
    parallax: 0.5,
    pauseOnHover: false,
    lift: 46,
    fade: 0.6,
    dim: 0.85,
    grayscale: false,
    overlayColor: '#0A0A08'
  };

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // On small screens the continuous drift makes the wall feel like it
  // doesn't fit the viewport, so it's rendered as a static tilted grid there.
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const skipDrift = prefersReduced || isMobile;

  container.style.setProperty('--dw-tile-w', opts.tileWidth + 'px');
  container.style.setProperty('--dw-tile-h', opts.tileHeight + 'px');
  container.style.setProperty('--dw-gap', opts.gap + 'px');
  container.style.setProperty('--dw-radius', opts.radius + 'px');
  container.style.setProperty('--dw-perspective', opts.perspective + 'px');
  container.style.setProperty('--dw-lift', opts.lift + 'px');
  container.style.setProperty('--dw-dim', opts.dim);
  container.style.setProperty('--dw-gray', opts.grayscale ? 1 : 0);
  container.style.setProperty('--dw-overlay', opts.overlayColor);
  container.style.setProperty('--dw-edge', Math.max(0, (1 - opts.fade) * 100) + '%');
  if (skipDrift) container.classList.add('drift-wall--reduced');

  const columnItems = Array.from({ length: opts.columns }, () => []);
  items.forEach((item, i) => columnItems[i % opts.columns].push(item));
  columnItems.forEach((col, i) => { if (!col.length) columnItems[i] = items.slice(0, 1); });

  const plane = document.createElement('div');
  plane.className = 'drift-wall__plane';
  container.appendChild(plane);

  const unit = opts.tileHeight + opts.gap;
  const containerHeight = container.clientHeight || 480;

  const tracks = [];
  const columnMeta = [];
  const offsets = [];
  const velocities = [];

  let activeEl = null;
  let hoveredCol = -1;

  function activate(el, colIndex) {
    if (activeEl === el) return;
    if (activeEl) activeEl.classList.remove('is-active');
    activeEl = el;
    el.classList.add('is-active');
    hoveredCol = colIndex;
  }
  function release() {
    if (activeEl) activeEl.classList.remove('is-active');
    activeEl = null;
    hoveredCol = -1;
  }

  function buildTile(item, id, colIndex) {
    const el = document.createElement(item.href ? 'a' : 'div');
    el.className = 'drift-wall__tile';
    el.dataset.tileId = id;
    el.dataset.col = String(colIndex);
    if (item.href) {
      el.href = item.href;
      el.target = '_blank';
      el.rel = 'noreferrer noopener';
    } else {
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', item.title || 'tile');
    }

    const inner = document.createElement('span');
    inner.className = 'drift-wall__inner';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    const overlay = document.createElement('span');
    overlay.className = 'drift-wall__overlay';
    overlay.setAttribute('aria-hidden', 'true');
    inner.appendChild(img);
    inner.appendChild(overlay);
    el.appendChild(inner);

    el.addEventListener('mouseenter', () => activate(el, colIndex));
    el.addEventListener('mouseleave', release);
    el.addEventListener('focus', () => activate(el, colIndex));
    el.addEventListener('blur', release);
    return el;
  }

  columnItems.forEach((col, c) => {
    const copyHeight = Math.max(unit, col.length * unit);
    const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
    columnMeta.push({ copyHeight, copies });
    offsets.push(copyHeight * ((c * 0.37) % 1));
    velocities.push(0);

    const colEl = document.createElement('div');
    colEl.className = 'drift-wall__col';
    const track = document.createElement('div');
    track.className = 'drift-wall__track';

    for (let copyIndex = 0; copyIndex < copies; copyIndex++) {
      col.forEach((item, itemIndex) => {
        track.appendChild(buildTile(item, `${c}-${copyIndex}-${itemIndex}`, c));
      });
    }

    colEl.appendChild(track);
    plane.appendChild(colEl);
    tracks.push(track);
  });

  const dirSign = opts.direction === 'up' ? 1 : -1;
  const baseVelocities = columnItems.map((_, c) => {
    const altSign = c % 2 === 0 ? 1 : -1;
    return opts.speed * driftColumnFactor(c, opts.variance) * dirSign * altSign;
  });

  function applyPlaneTransform(px, py) {
    plane.style.transform =
      `translate(-50%, -50%) scale(1.18) ` +
      `rotateX(${opts.tilt + py}deg) rotateY(${opts.turn + px}deg) rotateZ(${opts.roll}deg) ` +
      `translateZ(${-opts.depth}px)`;
  }

  // Mobile / reduced-motion: render one static frame and stop — no rAF
  // loop, no pointer listeners, nothing drifting. Just a fixed tilted grid.
  if (skipDrift) {
    applyPlaneTransform(0, 0);
    tracks.forEach((track, c) => {
      track.style.transform = `translate3d(0, ${-(offsets[c] || 0)}px, 0)`;
    });
    return;
  }

  let pointer = { x: 0, y: 0 };
  const pointerDamped = { x: 0, y: 0 };
  let wallHovered = false;

  container.addEventListener('pointermove', (e) => {
    if (opts.parallax <= 0) return;
    const rect = container.getBoundingClientRect();
    pointer = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5
    };
  });
  container.addEventListener('pointerenter', () => { wallHovered = true; });
  container.addEventListener('pointerleave', () => {
    wallHovered = false;
    pointer = { x: 0, y: 0 };
    release();
  });

  let lastTs = null;
  function animate(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(0.05, Math.max(0, ts - lastTs) / 1000);
    lastTs = ts;

    const maxTilt = opts.parallax * 8;
    const targetX = pointer.x * maxTilt;
    const targetY = -pointer.y * maxTilt;
    const damp = 1 - Math.exp(-dt / 0.12);
    pointerDamped.x += (targetX - pointerDamped.x) * damp;
    pointerDamped.y += (targetY - pointerDamped.y) * damp;
    applyPlaneTransform(pointerDamped.x, pointerDamped.y);

    tracks.forEach((track, c) => {
      const meta = columnMeta[c];
      const paused = wallHovered && opts.pauseOnHover;
      const factor = (paused || hoveredCol === c) ? 0 : 1;
      const target = baseVelocities[c] * factor;
      const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
      velocities[c] += (target - velocities[c]) * ease;
      let next = (offsets[c] || 0) + velocities[c] * dt;
      next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
      offsets[c] = next;
      track.style.transform = `translate3d(0, ${-next}px, 0)`;
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

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
  { short: 'Cloud Support', full: 'Cloud Platform Support (Microsoft Azure, SaaS)' },
  { short: 'Active Directory', full: 'Active Directory & User Access Management' },
  { short: 'Networking', full: 'Network Troubleshooting (TCP/IP, DNS, DHCP, VLAN, NAT, Firewalls, QoS)' },
  { short: 'VoIP & SIP', full: 'VoIP & SIP Systems (Call Routing, IVR, RTP, Softphones)' },
  { short: 'Databases', full: 'Database Troubleshooting (MySQL, Microsoft SQL Server, PostgreSQL, NoSQL)' },
  { short: 'Ticketing & Docs', full: 'Ticketing Systems & Technical Documentation' },
  { short: 'Remote Support', full: 'Remote Support Tools' },
  { short: 'Software Dev', full: 'Software Development (C#, JavaScript, HTML/CSS, Visual Studio)' },
  { short: 'CI/CD', full: 'CI/CD' },
  { short: 'AI Automation', full: 'AI Workflow Automation (n8n Cloud, Claude)' },
  { short: 'Leadership', full: 'Team Leadership & Training' }
];

function initCenterFlow() {
  const container = document.getElementById('centerFlow');
  const caption = document.getElementById('centerFlowCaption');
  if (!container) return;

  const NS = 'http://www.w3.org/2000/svg';
  const size = 600;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 195;
  const hubRadius = 38;
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

  CORE_SKILLS.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / CORE_SKILLS.length - Math.PI / 2;
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
      'aria-label': skill.full
    });

    const node = el('circle', {
      cx: nx, cy: ny, r: 6, fill: color, class: 'center-flow-node'
    });
    g.appendChild(node);

    let anchor = 'middle';
    let lx = nx;
    let ly = ny - 16;
    if (cos > 0.3) {
      anchor = 'start';
      lx = nx + 13;
      ly = ny + 4;
    } else if (cos < -0.3) {
      anchor = 'end';
      lx = nx - 13;
      ly = ny + 4;
    } else {
      ly = sin > 0 ? ny + 20 : ny - 13;
    }

    const label = el('text', {
      x: lx, y: ly, 'text-anchor': anchor, 'font-size': '12',
      class: 'center-flow-label'
    });
    label.textContent = skill.short;
    g.appendChild(label);

    function activate() {
      groups.forEach((grp, idx) => grp.classList.toggle('is-active', idx === i));
      if (caption) caption.textContent = skill.full;
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

  const hubLine1 = el('text', {
    x: cx, y: cy - 4, 'text-anchor': 'middle', 'font-size': '12',
    'font-weight': '700', fill: 'var(--text)', 'font-family': 'var(--font-mono)'
  });
  hubLine1.textContent = 'CORE';
  const hubLine2 = el('text', {
    x: cx, y: cy + 12, 'text-anchor': 'middle', 'font-size': '12',
    'font-weight': '700', fill: 'var(--text)', 'font-family': 'var(--font-mono)'
  });
  hubLine2.textContent = 'SKILLS';
  svg.appendChild(hubLine1);
  svg.appendChild(hubLine2);

  svg.appendChild(nodesGroup);
  container.appendChild(svg);
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
  initDriftWall();
  initCenterFlow();
  initTicketForm();
  setYear();
});
