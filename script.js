/* ============================================================
   COMBINED APP: ARES-1 LANDING + ARES-7 HUD
   ============================================================ */

// ========================
// MODE SWITCHER
// ========================
let hudInitialized = false;

function switchMode(mode) {
  const landing = document.getElementById('view-landing');
  const hud = document.getElementById('view-hud');
  const nav = document.getElementById('main-nav');
  const btnL = document.getElementById('btn-landing');
  const btnH = document.getElementById('btn-hud');

  if (mode === 'landing') {
    landing.style.display = 'block';
    hud.style.display = 'none';
    nav.classList.remove('hidden-nav');
    btnL.classList.add('active');
    btnH.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.cursor = 'crosshair';
  } else {
    landing.style.display = 'none';
    hud.style.display = 'block';
    nav.classList.add('hidden-nav');
    btnL.classList.remove('active');
    btnH.classList.add('active');
    document.body.style.cursor = 'default';
    if (!hudInitialized) {
      hudInitialized = true;
      startHudLoader();
    }
  }
}

// ========================
// MOBILE NAV
// ========================
function toggleNav() {
  const links = document.getElementById('nav-links-list');
  links.classList.toggle('open');
}
// Close on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('nav-links-list').classList.remove('open');
  });
});

// ========================
// NAV SCROLL EFFECT
// ========================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ========================
// STARFIELD
// ========================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function initStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({length: 280}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.2,
    a: Math.random(),
    da: (Math.random() - 0.5) * 0.006,
    hue: Math.random() > 0.85 ? (Math.random() > 0.5 ? 200 : 30) : 0
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.a += s.da;
    if (s.a <= 0 || s.a >= 1) s.da *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    if (s.hue === 200) {
      ctx.fillStyle = `rgba(150,200,255,${s.a * 0.7})`;
    } else if (s.hue === 30) {
      ctx.fillStyle = `rgba(255,220,150,${s.a * 0.7})`;
    } else {
      ctx.fillStyle = `rgba(255,240,220,${s.a * 0.7})`;
    }
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

initStars();
drawStars();
window.addEventListener('resize', initStars);

// ========================
// DUST PARTICLES
// ========================
function createDustParticles() {
  const container = document.getElementById('dust-container');
  if (!container) return;
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'dust-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.width = (Math.random() * 4 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = (Math.random() * 20 + 15) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = Math.random() * 0.5;
    container.appendChild(p);
  }
}
createDustParticles();

// ========================
// ANIMATED HERO COUNTER
// ========================
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}
// Trigger on scroll
const statSolsEl = document.getElementById('stat-sols');
let counterTriggered = false;
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !counterTriggered) {
    counterTriggered = true;
    setTimeout(() => animateCounter(statSolsEl, 847, 2000), 800);
  }
}, { threshold: 0.3 });
if (statSolsEl) heroObserver.observe(document.getElementById('mission'));

// ========================
// SCROLL REVEAL
// ========================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ========================
// CLICK RIPPLE
// ========================
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.className = 'ripple';
  r.style.left = e.clientX + 'px';
  r.style.top = e.clientY + 'px';
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 800);
});

// ========================
// PROGRESS TOAST
// ========================
function showToast(msg, duration = 2500) {
  const t = document.getElementById('progress-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ========================
// EASTER EGG SYSTEM
// ========================
let secretsFound = 0;
const totalSecrets = 5;

function showSecretFound(name) {
  secretsFound++;
  const notif = document.getElementById('secret-notif');
  notif.querySelector('.sf-title').textContent = `🔍 ${name}`;
  notif.querySelector('#secret-count').textContent = `${secretsFound} / ${totalSecrets} секретів`;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 3500);
  if (secretsFound === totalSecrets) {
    setTimeout(() => showToast('🏆 ВСІ СЕКРЕТИ ЗНАЙДЕНО! ДОСТУП: OMEGA'), 4000);
  }
}

// Secret 1: Logo 5 rapid clicks
let logoClicks = 0, logoTimer = null;
document.getElementById('logo-secret').addEventListener('click', () => {
  logoClicks++;
  if (logoTimer) clearTimeout(logoTimer);
  if (logoClicks >= 5) {
    logoClicks = 0;
    document.getElementById('logo-secret').classList.add('glitch-active');
    setTimeout(() => document.getElementById('logo-secret').classList.remove('glitch-active'), 500);
    const msg = document.getElementById('secret-msg');
    msg.style.opacity = '1';
    setTimeout(() => msg.style.opacity = '0', 3000);
    showSecretFound('Секрет #1: Сигнал Альфа');
  } else {
    logoTimer = setTimeout(() => { logoClicks = 0; }, 1000);
  }
});

// Secret 2: Konami code
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
document.addEventListener('keydown', e => {
  if (e.key === konamiSequence[konamiIndex]) {
    konamiIndex++;
    showToast(`⌨ ${konamiIndex}/${konamiSequence.length}`, 600);
    if (konamiIndex === konamiSequence.length) {
      konamiIndex = 0;
      document.getElementById('konami-overlay').classList.add('active');
      showSecretFound('Секрет #2: Konami Code!');
    }
  } else { konamiIndex = 0; }
  if (e.key === 'Escape') { closeKonami(); closeTerminal(); closeModal(); }
});

function closeKonami() {
  document.getElementById('konami-overlay').classList.remove('active');
}

// Secret 3: Morse temp hover/click
const statsSecret = document.getElementById('stats-secret');
const morseTooltip = statsSecret.querySelector('.morse-tooltip');
statsSecret.addEventListener('mouseenter', () => { morseTooltip.style.opacity = '1'; });
statsSecret.addEventListener('mouseleave', () => { morseTooltip.style.opacity = '0'; });
statsSecret.addEventListener('click', () => {
  morseTooltip.textContent = '→ HIDDEN FILE ✓';
  morseTooltip.style.opacity = '1';
  showSecretFound('Секрет #3: Morse файл');
  setTimeout(() => { morseTooltip.style.opacity = '0'; morseTooltip.textContent = '.... .. -.. -.. . -.  ..-. .. .-.. .'; }, 3000);
});

// Secret 4: Terminal
document.getElementById('terminal-trigger').addEventListener('click', () => {
  document.getElementById('terminal').classList.add('open');
  showSecretFound('Секрет #4: Термінал Арес-1');
});

function closeTerminal() {
  document.getElementById('terminal').classList.remove('open');
}

const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const commands = {
  help: `\nКоманди доступу:\n  status   — статус бази\n  crew     — список екіпажу\n  signal   — аналіз сигналу\n  weather  — погода\n  secret   — ???\n  clear    — очистити\n`,
  status: `\n[OK] Купол-1: 98% цілісність\n[OK] Купол-2: 100% цілісність\n[OK] Купол-3: 87% цілісність\n[!] Реактор: 72% потужність\n[OK] O₂: 21.0%\n[OK] Температура: +22°C\n`,
  crew: `\nАктивний екіпаж (Sol 847):\n1. Атаєва Л. — КОМАНДИР [ОНЛАЙН]\n2. Коваль Д. — ГЕОЛОГ [ПОВЕРХНЯ]\n3. Оконкво С. — ЛІКАР [ОНЛАЙН]\n4. Вей Ч.    — ШІ-ІНЖ [ОНЛАЙН]\n5. Соуза А.  — БОТАНІК [ФЕРМА]\n6. Петренко І.— МЕХАНІК [ШЛЮЗ]\n`,
  signal: `\n[АНАЛІЗ] Сигнал: 1420.405 МГц\n[АНАЛІЗ] Джерело: 89.2°N, 0.0°W\n[АНАЛІЗ] Тривалість: 72 секунди\n[АНАЛІЗ] Повтор: кожні 11.2 год\n[!!!] Природне чи штучне — НЕВІДОМО\n`,
  weather: `\n[ПОГОДА Sol 847]\nТемпература: -63°C\nВітер: 12 м/с, ПнС\nВидимість: 8 км\nРадіація: 142 мЗв\nПилові бурі: НЕ ВИЯВЛЕНО\n`,
  secret: `\n██████████████████████\n█                    █\n█  ПРИВІТ, МАНДРІВНИКУ █\n█  Ти знайшов 4/5      █\n█  секретів бази!     █\n█  Один залишився...  █\n██████████████████████\n`,
  clear: 'CLEAR'
};
terminalInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const cmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';
    const response = commands[cmd];
    if (response === 'CLEAR') { terminalBody.textContent = 'ARES-1 TERMINAL CLEARED\n> '; }
    else if (response) { terminalBody.textContent += `\n> ${cmd}${response}> `; }
    else { terminalBody.textContent += `\n> ${cmd}\nПомилка: команда '${cmd}' не знайдена. Введи 'help'\n> `; }
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
});

// Secret 5: Gallery double-click
let galleryClicks = 0, galleryTimer = null;
document.getElementById('gallery-secret').addEventListener('click', () => {
  galleryClicks++;
  if (galleryTimer) clearTimeout(galleryTimer);
  if (galleryClicks >= 2) {
    galleryClicks = 0;
    const el = document.getElementById('gallery-secret');
    el.style.filter = 'hue-rotate(180deg) saturate(2)';
    el.style.transition = 'filter 0.5s';
    setTimeout(() => { el.style.filter = ''; }, 2000);
    showSecretFound('Секрет #5: Марс-Веселка! 🎨');
  } else {
    galleryTimer = setTimeout(() => { galleryClicks = 0; }, 500);
  }
});

// Bonus secrets
document.getElementById('author-secret').addEventListener('click', () => {
  const messages = ['🛸 Файно, що ти підглянув!', '🌌 Космос — це нескінченність', '🔴 Марс чекає на тебе', '🚀 Один маленький клік...', '💡 Цікавість — двигун прогресу!'];
  const el = document.getElementById('author-secret');
  el.textContent = messages[Math.floor(Math.random() * messages.length)];
  setTimeout(() => el.textContent = '🔭 Secret', 2000);
});

document.getElementById('planet-secret').addEventListener('click', () => {
  const notif = document.getElementById('secret-notif');
  notif.querySelector('.sf-title').textContent = '🪐 Планета натиснута!';
  notif.querySelector('#secret-count').textContent = 'Фобос: 9376 км від Марса';
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 3000);
});

let crew1clicks = 0, crew1timer = null;
document.getElementById('crew1').addEventListener('click', () => {
  crew1clicks++;
  if (crew1timer) clearTimeout(crew1timer);
  if (crew1clicks >= 3) {
    crew1clicks = 0;
    document.getElementById('crew1-badge').style.opacity = '1';
    showSecretFound('Бонус: Значок Командира ⭐');
  } else {
    crew1timer = setTimeout(() => { crew1clicks = 0; }, 800);
  }
});

// ========================
// HUD APP — ARES-7
// ========================
const state = {
  oxygen: 87, energy: 74, food: 62, crew: 6,
  marsDay: 847, missionsDone: 0,
  roverX: 48, roverY: 40,
  weatherStorm: false, selectedModule: null, logEntries: [],
  modules: {
    habitat:    { name: 'ЖИТЛОВИЙ БЛОК',            icon: '🏠', status: 'online',  temp: 22,  pressure: 101, crew: 6, power: 85 },
    lab:        { name: 'ЛАБОРАТОРІЯ',               icon: '🔬', status: 'online',  temp: 20,  pressure: 100, crew: 2, power: 90 },
    greenhouse: { name: 'ОРАНЖЕРЕЯ',                 icon: '🌱', status: 'warning', temp: 25,  pressure: 98,  crew: 1, power: 60 },
    reactor:    { name: 'ЯДЕРНИЙ РЕАКТОР',           icon: '⚛️', status: 'online',  temp: 380, pressure: 150, crew: 0, power: 100 },
    hangar:     { name: 'АНГАР ТРАНСПОРТНИХ ЗАСОБІВ',icon: '🚀', status: 'online',  temp: 18,  pressure: 102, crew: 1, power: 75 },
    comms:      { name: 'ЦЕНТР ЗВ\'ЯЗКУ',            icon: '📡', status: 'online',  temp: 19,  pressure: 101, crew: 1, power: 95 },
  },
  missions: [
    { id: 1, title: '🌋 Зразки ґрунту з кратера Гаусс', progress: 65, total: 100, done: false },
    { id: 2, title: '🧬 Аналіз ґрунту на органіку',     progress: 30, total: 100, done: false },
    { id: 3, title: '🔧 Ремонт сонячних панелей №3',    progress: 90, total: 100, done: false },
    { id: 4, title: '📡 Калібрування антен зв\'язку',   progress: 10, total: 100, done: false },
  ]
};

function startHudLoader() {
  const fill = document.getElementById('hudLoaderFill');
  const pct  = document.getElementById('hudLoaderPct');
  const msgs = ['ІНІЦІАЛІЗАЦІЯ СИСТЕМ...', 'ПЕРЕВІРКА МОДУЛІВ...', 'ЗАВАНТАЖЕННЯ ДАНИХ...', 'З\'ЄДНАННЯ ВСТАНОВЛЕНО'];
  let p = 0, msgIdx = 0;
  const msgEl = document.querySelector('#hud-loader div > div:nth-child(2)');
  const iv = setInterval(() => {
    p += Math.random() * 12 + 3;
    if (p > 25 && msgIdx === 0) { msgIdx = 1; if(msgEl) msgEl.textContent = msgs[1]; }
    if (p > 60 && msgIdx === 1) { msgIdx = 2; if(msgEl) msgEl.textContent = msgs[2]; }
    if (p > 85 && msgIdx === 2) { msgIdx = 3; if(msgEl) msgEl.textContent = msgs[3]; }
    if (p >= 100) {
      p = 100; clearInterval(iv);
      setTimeout(() => {
        document.getElementById('hud-loader').style.display = 'none';
        document.getElementById('hud-app').classList.remove('hidden');
        initHudApp();
      }, 400);
    }
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
  }, 130);
}

function initHudApp() {
  renderMissions();
  addLog('Систему ініційовано. Усі модулі на зв\'язку.', 'success');
  addLog('Отримано дані з орбітального зонду MRO.', 'info');
  addLog('УВАГА: рівень їжі нижче норми.', 'warn');
  addLog('Оранжерея: потрібна перевірка освітлення.', 'warn');
  updateHUD();
  attachModuleEvents();
  startTicker();
  animateRover();
  // Mark greenhouse as warning
  const ghMod = document.getElementById('mod-greenhouse');
  if (ghMod) ghMod.classList.add('warning');
}

function updateHUD() {
  const s = state;
  setBar('oxygenBar', s.oxygen); setVal('oxygenVal', s.oxygen.toFixed(0) + '%');
  setBar('energyBar', s.energy); setVal('energyVal', s.energy.toFixed(0) + '%');
  setBar('foodBar',   s.food);   setVal('foodVal',   s.food.toFixed(0)   + '%');
  setVal('crewVal', s.crew + '/6');
  setStat(document.getElementById('statOxygen'), s.oxygen);
  setStat(document.getElementById('statEnergy'), s.energy);
  setStat(document.getElementById('statFood'),   s.food);
  document.getElementById('marsDay').textContent = 'МАРСІАНСЬКИЙ ДЕНЬ: ' + String(s.marsDay).padStart(4, '0');
}

function setBar(id, val) { document.getElementById(id).style.width = Math.max(0, val) + '%'; }
function setVal(id, val) { document.getElementById(id).textContent = val; }
function setStat(el, val) {
  el.classList.remove('warning','critical');
  if (val < 25) el.classList.add('critical');
  else if (val < 45) el.classList.add('warning');
}

function addLog(msg, type = 'info') {
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0') + ':' + now.getSeconds().toString().padStart(2,'0');
  state.logEntries.unshift({ msg, type, time });
  if (state.logEntries.length > 40) state.logEntries.pop();
  renderLog();
}

function renderLog() {
  const list = document.getElementById('logList');
  if (!list) return;
  list.innerHTML = state.logEntries.slice(0, 15).map(e => `
    <div class="log-entry ${e.type}">
      <span class="log-time">${e.time}</span>
      <span class="log-msg">${e.msg}</span>
    </div>
  `).join('');
}

function renderMissions() {
  const el = document.getElementById('missionList');
  if (!el) return;
  el.innerHTML = state.missions.map(m => `
    <div class="mission-card ${m.done ? 'done' : ''}" onclick="clickMission(${m.id})">
      <div class="mission-header">
        <span class="mission-title">${m.title}</span>
        <span class="mission-status ${m.done ? 'status-ok' : 'status-warn'}">${m.done ? 'ЗАВЕРШЕНО ✓' : m.progress + '%'}</span>
      </div>
      <div class="mission-progress">
        <div class="mission-bar" style="width:${m.progress}%"></div>
      </div>
    </div>
  `).join('');
}

function clickMission(id) {
  const m = state.missions.find(x => x.id === id);
  if (!m || m.done) return;
  showModal(`
    <h2>🎯 ${m.title}</h2>
    <p>Поточний прогрес: <strong>${m.progress}%</strong></p>
    <p>Ця місія потребує ресурсів та участі екіпажу. Виконання вимагає виходу на поверхню Марса.</p>
    <button class="modal-btn green" onclick="advanceMission(${id})">▶ ПРОДОВЖИТИ МІСІЮ</button>
    <button class="modal-btn" onclick="closeModal()">✕ СКАСУВАТИ</button>
  `);
}

function advanceMission(id) {
  const m = state.missions.find(x => x.id === id);
  if (!m) return;
  const gain = Math.floor(Math.random() * 20) + 10;
  m.progress = Math.min(100, m.progress + gain);
  state.energy = Math.max(0, state.energy - 5);
  state.oxygen = Math.max(0, state.oxygen - 2);
  if (m.progress >= 100) {
    m.done = true;
    addLog(`✅ Місію "${m.title.slice(3)}" завершено!`, 'success');
    state.missionsDone++;
    showToast(`🏆 МІСІЮ ЗАВЕРШЕНО: ${m.title.slice(3)}`);
  } else {
    addLog(`⏳ Місія "${m.title.slice(3)}" прогрес: ${m.progress}%`, 'info');
  }
  closeModal(); renderMissions(); updateHUD();
}

function attachModuleEvents() {
  document.querySelectorAll('.hud-module').forEach(el => {
    el.addEventListener('click', () => selectModule(el.getAttribute('data-id')));
  });
}

function selectModule(id) {
  const mod = state.modules[id];
  if (!mod) return;

  // Remove selected from all
  document.querySelectorAll('.hud-module').forEach(el => el.classList.remove('selected'));
  // Add to clicked
  const modEl = document.getElementById('mod-' + id);
  if (modEl) modEl.classList.add('selected');

  state.selectedModule = id;
  document.getElementById('detailIcon').textContent = mod.icon;
  document.getElementById('detailName').textContent = mod.name;
  const statusLabel = mod.status === 'online' ? '<span class="status-ok">● ОНЛАЙН</span>'
    : mod.status === 'warning' ? '<span class="status-warn">⚠ ПОПЕРЕДЖЕННЯ</span>'
    : '<span class="status-err">✕ ОФЛАЙН</span>';

  const powerBar = `
    <div style="height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;margin-top:4px;">
      <div style="height:100%;width:${mod.power}%;background:linear-gradient(90deg,var(--mars-orange),var(--hud-yellow));border-radius:2px;transition:width 0.5s;"></div>
    </div>`;

  document.getElementById('detailBody').innerHTML = `
    <div class="detail-stat-row"><span class="detail-stat-label">Статус</span><span class="detail-stat-val">${statusLabel}</span></div>
    <div class="detail-stat-row"><span class="detail-stat-label">Температура</span><span class="detail-stat-val">${mod.temp}°C</span></div>
    <div class="detail-stat-row"><span class="detail-stat-label">Тиск</span><span class="detail-stat-val">${mod.pressure} кПа</span></div>
    <div class="detail-stat-row"><span class="detail-stat-label">Персонал</span><span class="detail-stat-val">${mod.crew} ос.</span></div>
    <div class="detail-stat-row">
      <span class="detail-stat-label">Споживання енергії</span>
      <span class="detail-stat-val">${mod.power}%</span>
    </div>
    ${powerBar}
    <button class="detail-btn" onclick="openModuleAction('${id}')">⚙ КЕРУВАТИ МОДУЛЕМ</button>
  `;
  addLog(`Переглянуто модуль: ${mod.name}`, 'info');
}

function openModuleAction(id) {
  const mod = state.modules[id];
  const actMap = {
    habitat: ['Перевірити герметизацію', 'Провести перекличку екіпажу', 'Оптимізувати О₂'],
    lab: ['Провести аналіз зразків', 'Калібрувати обладнання', 'Передати дані на Землю'],
    greenhouse: ['Зібрати врожай', 'Оновити систему поливу', 'Перевірити освітлення'],
    reactor: ['Перевірити рівень охолодження', 'Оптимізувати потужність', 'Технічне обслуговування'],
    hangar: ['Підготувати ровер до виїзду', 'Технічний огляд шатла', 'Заправити ровер'],
    comms: ['Встановити зв\'язок із Землею', 'Оновити антенну орієнтацію', 'Передати звіт місії'],
  };
  const acts = actMap[id] || ['Виконати обслуговування'];
  showModal(`
    <h2>${mod.icon} ${mod.name}</h2>
    <p>Оберіть дію для виконання:</p>
    ${acts.map((a, i) => `<button class="modal-btn" onclick="executeModuleAction('${id}', ${i}, '${a.replace(/'/g, "\\'")}')">${a}</button>`).join('<br>')}
    <br><button class="modal-btn" onclick="closeModal()" style="margin-top:10px">✕ ЗАКРИТИ</button>
  `);
}

function executeModuleAction(id, idx, label) {
  closeModal();
  addLog(`⚙ ${label} — виконується...`, 'info');
  showToast(`⚙ ${label}...`);
  setTimeout(() => {
    const outcomes = [
      () => { state.energy = Math.min(100, state.energy + 8); addLog(`✅ ${label} — завершено успішно.`, 'success'); },
      () => { state.oxygen = Math.min(100, state.oxygen + 5); addLog(`✅ ${label} — завершено успішно.`, 'success'); },
      () => { state.food   = Math.min(100, state.food   + 10); addLog(`✅ ${label} — завершено успішно.`, 'success'); },
    ];
    outcomes[Math.floor(Math.random() * outcomes.length)]();
    updateHUD(); updateAlert();
  }, 1200);
}

const actionDefs = {
  scan:     { msg: '🔭 Сканування поверхні розпочато', result: (s) => { s.oxygen = Math.min(100, s.oxygen + 2); addLog('✅ Знайдено нові геологічні зразки!', 'success'); } },
  repair:   { msg: '🔧 Технічне обслуговування...', result: (s) => { s.energy = Math.min(100, s.energy + 12); addLog('✅ Ремонт завершено. Потужність відновлено.', 'success'); } },
  mine:     { msg: '⛏ Видобуток ресурсів...', result: (s) => { s.food = Math.min(100, s.food + 8); addLog('✅ Добуто 47 кг оксиду заліза.', 'success'); } },
  launch:   { msg: '🚀 Підготовка до запуску...', result: (s) => { addLog('⚠ Запуск скасовано: погодні умови.', 'warn'); } },
  research: { msg: '🧬 Проводиться дослідження...', result: (s) => { s.oxygen = Math.min(100, s.oxygen + 4); addLog('✅ Нові дані передано на Землю.', 'success'); } },
  sos:      { msg: '🆘 СИГНАЛ SOS ВІДПРАВЛЕНО', result: (s) => { addLog('📡 SOS прийнято місією контролю NASA!', 'danger'); } },
};

function doAction(type) {
  const act = actionDefs[type];
  if (!act) return;
  addLog(act.msg, type === 'sos' ? 'danger' : 'info');
  showToast(act.msg, 1500);
  const btn = [...document.querySelectorAll('.action-btn')].find(b => b.getAttribute('onclick') === `doAction('${type}')`);
  if (btn) { btn.style.opacity = '0.5'; btn.disabled = true; }
  setTimeout(() => {
    act.result(state);
    updateHUD(); updateAlert();
    if (btn) { btn.style.opacity = '1'; btn.disabled = false; }
  }, 1500);
}

function startTicker() {
  setInterval(() => {
    document.getElementById('earthTime').textContent = new Date().toLocaleTimeString('uk-UA');
  }, 1000);

  setInterval(() => {
    state.oxygen = Math.max(0, state.oxygen - (0.1 + Math.random() * 0.05));
    state.energy = Math.max(0, state.energy - (0.08 + Math.random() * 0.04));
    state.food   = Math.max(0, state.food   - (0.06 + Math.random() * 0.03));
    if (Math.random() < 0.08) randomEvent();
    updateHUD(); updateAlert(); updateWeather();
  }, 5000);

  setInterval(() => {
    state.missions.forEach(m => {
      if (!m.done && Math.random() < 0.3) {
        m.progress = Math.min(100, m.progress + Math.floor(Math.random() * 3));
        if (m.progress >= 100) { m.done = true; addLog(`🎉 Місію "${m.title.slice(3)}" ЗАВЕРШЕНО!`, 'success'); }
      }
    });
    renderMissions();
  }, 8000);

  // Increment marsDay every minute
  setInterval(() => {
    state.marsDay++;
    updateHUD();
  }, 60000);
}

const events = [
  { msg: '🌪 Пилова буря наближається! Рекомендується залишитися в базі.', type: 'warn', fx: s => { s.energy -= 8; } },
  { msg: '☄️ Метеоритний дощ зафіксовано на північному схилі.', type: 'info', fx: () => {} },
  { msg: '📶 Отримано повідомлення з Землі: "Усі в порядку. Чекаємо!"', type: 'success', fx: () => {} },
  { msg: '🔋 Несправність сонячних панелей блоку B. Потужність знижено.', type: 'warn', fx: s => { s.energy -= 10; } },
  { msg: '🌿 Врожай у оранжереї готовий до збору!', type: 'success', fx: s => { s.food += 12; } },
  { msg: '⚠ Мікротріщина в герметизації шлюзу №2. Перевірка...', type: 'warn', fx: s => { s.oxygen -= 5; } },
  { msg: '🛰 Орбітальний зонд передав нові знімки поверхні.', type: 'info', fx: () => {} },
  { msg: '💧 Система водопостачання відновлена після технічного обслуговування.', type: 'success', fx: () => {} },
  { msg: '🔭 Виявлено незвичайні сейсмічні коливання на північ від бази.', type: 'info', fx: () => {} },
  { msg: '⚡ Сонячна активність підвищена. Заряд батарей +5%.', type: 'success', fx: s => { s.energy = Math.min(100, s.energy + 5); } },
];

function randomEvent() {
  const ev = events[Math.floor(Math.random() * events.length)];
  addLog(ev.msg, ev.type);
  ev.fx(state);
  state.oxygen = Math.max(5, Math.min(100, state.oxygen));
  state.energy = Math.max(5, Math.min(100, state.energy));
  state.food   = Math.max(5, Math.min(100, state.food));
  updateHUD();
}

const weatherStates = [
  { temp: -63, wind: 12, storm: false, rad: 142 },
  { temp: -71, wind: 28, storm: true,  rad: 198 },
  { temp: -58, wind: 6,  storm: false, rad: 120 },
  { temp: -80, wind: 45, storm: true,  rad: 230 },
  { temp: -55, wind: 3,  storm: false, rad: 110 },
];

function updateWeather() {
  if (Math.random() > 0.85) {
    const w = weatherStates[Math.floor(Math.random() * weatherStates.length)];
    document.getElementById('wTemp').textContent = w.temp + '°C';
    document.getElementById('wWind').textContent = w.wind + ' м/с';
    const stormEl = document.getElementById('wStorm');
    stormEl.textContent = w.storm ? 'АКТИВНА ⚠' : 'ВІДСУТНЯ';
    stormEl.className   = 'w-val ' + (w.storm ? 'status-err' : 'status-ok');
    document.getElementById('wRad').textContent = w.rad + ' мЗв';
    if (w.storm && !state.weatherStorm) {
      addLog('🌪 ПИЛОВА БУРЯ АКТИВОВАНА! Усі виходи заблоковано.', 'danger');
      state.weatherStorm = true;
    } else if (!w.storm) { state.weatherStorm = false; }
  }
}

function updateAlert() {
  const bar = document.getElementById('alertBar');
  const txt = document.getElementById('alertText');
  if (!bar) return;
  if (state.oxygen < 25 || state.energy < 20 || state.food < 20) {
    bar.className = 'alert-bar alert-danger';
    txt.textContent = '🚨 КРИТИЧНИЙ РІВЕНЬ РЕСУРСІВ — НЕГАЙНІ ДІЇ НЕОБХІДНІ — 🚨 КРИТИЧНИЙ РІВЕНЬ РЕСУРСІВ — НЕГАЙНІ ДІЇ НЕОБХІДНІ';
  } else if (state.oxygen < 45 || state.energy < 40 || state.food < 35) {
    bar.className = 'alert-bar alert-warn';
    txt.textContent = '⚠ РЕСУРСИ ЗНИЖУЮТЬСЯ — РЕКОМЕНДУЄТЬСЯ ПОПОВНЕННЯ';
  } else {
    bar.className = 'alert-bar';
    txt.textContent = '✅ СТАНДАРТНИЙ РЕЖИМ — ВСІ СИСТЕМИ В НОРМІ';
  }
}

function animateRover() {
  const rover = document.getElementById('rover');
  function moveRover() {
    state.roverX = 10 + Math.random() * 80;
    state.roverY = 15 + Math.random() * 70;
    rover.style.left = state.roverX + '%';
    rover.style.top  = state.roverY + '%';
    rover.title = 'Ровер «Дух-ІІ» | ' + Math.floor(state.roverX) + ',' + Math.floor(state.roverY);
  }
  rover.style.left = '48%'; rover.style.top = '40%';
  rover.addEventListener('click', () => {
    addLog('🤖 Ровер «Дух-ІІ» передає дані з точки ' + Math.floor(state.roverX) + ',' + Math.floor(state.roverY), 'info');
    showModal(`
      <h2>🤖 РОВЕР «ДУХ-ІІ»</h2>
      <p>Поточна позиція: ${Math.floor(state.roverX * 10) / 10}°N, ${Math.floor(state.roverY * 10) / 10}°E</p>
      <p>Стан акумулятора: <strong>72%</strong></p>
      <p>Пробіг: <strong>1,847 км</strong></p>
      <p>Температура корпусу: <strong>-28°C</strong></p>
      <p>Зразків зібрано: <strong>14 флакони</strong></p>
      <button class="modal-btn green" onclick="roverMission()">🗺 НОВА ТОЧКА ПРИЗНАЧЕННЯ</button>
      <button class="modal-btn" onclick="closeModal()">✕ ЗАКРИТИ</button>
    `);
  });
  setInterval(moveRover, 6000);
}

function roverMission() {
  closeModal();
  addLog('🤖 Ровер отримав нові координати. Рухається до цілі...', 'info');
  showToast('🤖 Ровер «Дух-ІІ» рухається...');
  state.energy = Math.max(0, state.energy - 4);
  updateHUD();
}

function showModal(html) {
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('active');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// Expose globals
window.switchMode = switchMode;
window.doAction = doAction;
window.clickMission = clickMission;
window.advanceMission = advanceMission;
window.openModuleAction = openModuleAction;
window.executeModuleAction = executeModuleAction;
window.roverMission = roverMission;
window.closeModal = closeModal;
window.closeKonami = closeKonami;
window.closeTerminal = closeTerminal;

// Console easter egg
console.log(
  '%c🚀 MARS 2047 COMBINED TERMINAL %c\n\n' +
  'Привіт, розробнику! Обидва проєкти об\'єднані.\n\n' +
  'Підказки для прихованих місць (Арес-1):\n' +
  '1. Клікни на логотип 5 разів швидко\n' +
  '2. Введи Konami Code: ↑↑↓↓←→←→BA\n' +
  '3. Наведи/натисни на температуру у статистиці\n' +
  '4. Натисни на Факт #5 (секретний сигнал)\n' +
  '5. Двічі клікни на велику фото у галереї\n\n' +
  'Перейди в режим ⬡ АРЕС-7 HUD для керування базою!\n',
  'background:#0d0400; color:#e8611a; font-size:14px; padding:10px; font-weight:bold;',
  'background:#0d0400; color:#d4956a; font-size:11px; padding:10px;'
);
