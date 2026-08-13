// MASKITO Console App v5.0
// Comprehensive Stress Testing & Synthetic Data Engine
// Includes Onboarding Guide, Deep Run Metrics/Data Outputs, Live Drag & Drop Log Uploaders,
// Advanced Chaos & Seed Configs, and Clean Input Placeholders.

const STORAGE_KEY_RES  = 'maskito_resources_v5';
const STORAGE_KEY_RUNS = 'maskito_runs_v5';
const STORAGE_KEY_TEMPLATES = 'maskito_templates_v5';

// ─── DEFAULT TEMPLATES ──────────────────────────────────────────────────────
const defaultTemplates = [
  { id: 'tpl_ecommerce', name: 'E-commerce API Schema', specUrl: 'https://petstore.swagger.io/v2/swagger.json', entitiesCount: 4, createdAt: new Date().toISOString() },
  { id: 'tpl_auth', name: 'Auth & User Service Schema', specUrl: 'https://express-auth.swagger.json', entitiesCount: 2, createdAt: new Date().toISOString() }
];

// ─── DEFAULT RESOURCES ──────────────────────────────────────────────────────
const defaultResources = {
  antenna: [
    { id: 'ant_1', name: 'PetStore OpenAPI Spec', specUrl: 'https://petstore.swagger.io/v2/swagger.json', templateId: 'tpl_ecommerce', createdAt: new Date().toISOString() }
  ],
  larva: [
    { id: 'larv_1', name: 'Users & Orders Seed Data', templateId: 'tpl_ecommerce', format: 'json', count: 1000, distributions: 'price: gaussian(80,20), category: enum(40% clothing, 60% tech)', fkMapping: 'orders.user_id -> users.id', createdAt: new Date().toISOString() }
  ],
  venom: [
    { id: 'ven_1', name: 'Auth Fuzzing Payloads', templateId: 'tpl_auth', intensityPct: 50, modes: ['boundary', 'unicode', 'injection', 'headers'], outputPath: 'venom-payloads.json', createdAt: new Date().toISOString() }
  ],
  horde: [
    { id: 'hord_1', name: 'Primary API Load Test', templateId: 'tpl_ecommerce', targetUrl: 'https://api.example.com', swarmSize: 15, duration: '10m', rate: '100rps', createdAt: new Date().toISOString() }
  ],
  siege: [
    { id: 'siege_1', name: 'Weekend 48h Soak Test', templateId: 'tpl_ecommerce', targetUrl: 'https://api.example.com', totalHours: 48, relayHours: 5.5, loadRps: 50, swarmSize: 3, createdAt: new Date().toISOString() }
  ],
  colony: [
    { id: 'col_1', name: 'Global Geo Latency Check', targetUrl: 'https://api.example.com', swarmSize: 20, duration: '5m', createdAt: new Date().toISOString() }
  ],
  phantom: [
    { id: 'phan_1', name: 'Checkout Playwright Journey', targetUrl: 'https://shop.example.com', browser: 'chromium', concurrency: 5, steps: 'goto / | click #buy | wait 1000', createdAt: new Date().toISOString() }
  ],
  echo: [
    { id: 'echo_1', name: 'Prod Nginx Log Replay', targetUrl: 'https://staging.example.com', logPath: 's3://logs/prod-nginx.log', speed: 2, createdAt: new Date().toISOString() }
  ],
  toxin: [
    { id: 'tox_1', name: 'Random Chaos Inoculation', templateId: 'tpl_ecommerce', targetUrl: 'https://api.example.com', modes: ['latency', 'gremlins'], latencyMinMs: 200, latencyMaxMs: 2000, gremlinsVector: 'corrupt_headers', blackoutDomains: 'redis:6379, auth-service.internal', createdAt: new Date().toISOString() }
  ],
  epidemic: [
    { id: 'epi_1', name: 'Black Friday Chaos Swarm', templateId: 'tpl_ecommerce', targetUrl: 'https://api.example.com', swarmSize: 20, normalPct: 60, latencyPct: 20, venomPct: 10, blackoutPct: 10, duration: '30m', createdAt: new Date().toISOString() }
  ],
  cascade: [
    { id: 'casc_1', name: 'Microservices Failure Mapping', clusterUrl: 'https://staging-cluster.internal.com', services: 'Auth:8080 (mock_503), Catalog:3001 (shutdown_api), Cart:4000 (docker_stop)', loadRps: 50, killDurationSec: 30, recoveryWaitSec: 15, createdAt: new Date().toISOString() }
  ],
  hunter: [
    { id: 'hunt_1', name: 'Full Purchase User Journey', templateId: 'tpl_ecommerce', targetUrl: 'https://shop.example.com', steps: 'POST /api/login | EXTRACT $.token -> auth_token | GET /api/products | POST /api/checkout', swarmSize: 15, iterations: 3, createdAt: new Date().toISOString() }
  ]
};

// ─── DEFAULT RUNS ───────────────────────────────────────────────────────────
const defaultRuns = [
  {
    id: 'run_1723456_horde',
    type: 'horde',
    name: 'Primary API Load Test',
    status: 'completed',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3000000).toISOString(),
    p50ms: 120,
    p95ms: 365,
    p99ms: 540,
    throughput: '1,240 req/s',
    errorRate: '0.2%',
    regression: 'normal',
    config: { targetUrl: 'https://api.example.com', swarmSize: 15, duration: '10m' }
  },
  {
    id: 'run_1723452_larva',
    type: 'larva',
    name: 'Users & Orders Seed Data',
    status: 'completed',
    startedAt: new Date(Date.now() - 5400000).toISOString(),
    completedAt: new Date(Date.now() - 5300000).toISOString(),
    recordsGenerated: 1000,
    datasetPreview: `[\n  { "id": "usr_99182", "name": "Elena Rostova", "email": "elena@domain.com", "price_avg": 84.50 },\n  { "id": "usr_99183", "name": "Carlos Gomez", "email": "carlos@domain.com", "price_avg": 112.30 }\n]`,
    config: { format: 'json', count: 1000 }
  },
  {
    id: 'run_1723450_siege',
    type: 'siege',
    name: 'Weekend 48h Soak Test',
    status: 'running',
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    progressPct: 35,
    progress: 'Relay 3/9 (Total 48h)',
    p50ms: 180,
    p95ms: 410,
    p99ms: 620,
    throughput: '50 req/s',
    errorRate: '0.0%',
    config: { targetUrl: 'https://api.example.com', totalHours: 48 }
  }
];

// ─── STATE ──────────────────────────────────────────────────────────────────
const state = {
  token: null,
  user: null,
  targetRepo: '',
  currentView: 'dashboard',
  templates: loadStorage(STORAGE_KEY_TEMPLATES, defaultTemplates),
  resources: loadStorage(STORAGE_KEY_RES, defaultResources),
  runs: loadStorage(STORAGE_KEY_RUNS, defaultRuns),
  editingItem: null,
};

function loadStorage(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch (e) {}
  return fallback;
}

function saveStorage(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

const $ = id => document.getElementById(id);
const show = el => el && el.classList.remove('hidden');
const hide = el => el && el.classList.add('hidden');

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── CUSTOM UI POPUPS & TOAST SYSTEM ─────────────────────────────────────────

function showToast(message, type = 'info', durationMs = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><div>${escapeHtml(message)}</div>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, durationMs);
}

function customAlert({ title = 'Maskito Alert', message = '', icon = 'ℹ️' }) {
  return new Promise(resolve => {
    const overlayHtml = `
      <div id="custom-popup-overlay" class="modal-overlay custom-dialog-overlay">
        <div class="modal-content" style="width:460px;">
          <div class="modal-header">
            <h3>${icon} ${escapeHtml(title)}</h3>
            <button class="close-modal" id="popup-close-btn">&times;</button>
          </div>
          <div class="modal-body" style="font-size:0.95rem; line-height:1.5;">
            ${escapeHtml(message).replace(/\n/g, '<br>')}
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" id="popup-ok-btn">Aceptar</button>
          </div>
        </div>
      </div>
    `;

    const existing = $('custom-popup-overlay');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', overlayHtml);

    const close = () => { $('custom-popup-overlay')?.remove(); resolve(); };
    $('popup-close-btn').onclick = close;
    $('popup-ok-btn').onclick = close;
  });
}

function customConfirm({ title = 'Confirmar Acción', message = '', confirmText = 'Confirmar', cancelText = 'Cancelar', isDanger = false }) {
  return new Promise(resolve => {
    const overlayHtml = `
      <div id="custom-popup-overlay" class="modal-overlay custom-dialog-overlay">
        <div class="modal-content" style="width:480px;">
          <div class="modal-header">
            <h3>${isDanger ? '⚠️' : '❓'} ${escapeHtml(title)}</h3>
            <button class="close-modal" id="popup-close-btn">&times;</button>
          </div>
          <div class="modal-body" style="font-size:0.95rem; line-height:1.5;">
            ${escapeHtml(message).replace(/\n/g, '<br>')}
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" id="popup-cancel-btn">${escapeHtml(cancelText)}</button>
            <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'}" id="popup-confirm-btn">${escapeHtml(confirmText)}</button>
          </div>
        </div>
      </div>
    `;

    const existing = $('custom-popup-overlay');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', overlayHtml);

    const cleanup = (val) => { $('custom-popup-overlay')?.remove(); resolve(val); };
    $('popup-close-btn').onclick = () => cleanup(false);
    $('popup-cancel-btn').onclick = () => cleanup(false);
    $('popup-confirm-btn').onclick = () => cleanup(true);
  });
}

function customPrompt({ title = 'Ingresar Datos', message = '', fields = [], confirmText = 'Aceptar', cancelText = 'Cancelar' }) {
  return new Promise(resolve => {
    const fieldsHtml = fields.map(f => `
      <label>${escapeHtml(f.label)}</label>
      <input type="${f.type || 'text'}" id="p-field-${f.id}" value="${escapeHtml(f.value || '')}" placeholder="${escapeHtml(f.placeholder || '')}">
    `).join('');

    const overlayHtml = `
      <div id="custom-popup-overlay" class="modal-overlay custom-dialog-overlay">
        <div class="modal-content" style="width:520px;">
          <div class="modal-header">
            <h3>⚡ ${escapeHtml(title)}</h3>
            <button class="close-modal" id="popup-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            ${message ? `<p style="margin-bottom:1rem;">${escapeHtml(message)}</p>` : ''}
            ${fieldsHtml}
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" id="popup-cancel-btn">${escapeHtml(cancelText)}</button>
            <button class="btn btn-primary" id="popup-confirm-btn">${escapeHtml(confirmText)}</button>
          </div>
        </div>
      </div>
    `;

    const existing = $('custom-popup-overlay');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', overlayHtml);

    const cleanup = (val) => { $('custom-popup-overlay')?.remove(); resolve(val); };
    $('popup-close-btn').onclick = () => cleanup(null);
    $('popup-cancel-btn').onclick = () => cleanup(null);
    $('popup-confirm-btn').onclick = () => {
      const res = {};
      fields.forEach(f => { res[f.id] = $(`p-field-${f.id}`)?.value?.trim() || ''; });
      cleanup(res);
    };
  });
}

// ─── METADATA ───────────────────────────────────────────────────────────────
const FuncMeta = {
  antenna:  { name: 'Antenna', groupLabel: '🧬 BREED', desc: 'Schema Reader — Lee OpenAPI/Swagger (URL, archivo o código) y crea plantillas base' },
  larva:    { name: 'Larva Forge', groupLabel: '🧬 BREED', desc: 'Synthetic Seeding — Genera data sintética realista con distribuciones estadísticas y FKs' },
  venom:    { name: 'Venom Seed', groupLabel: '🧬 BREED', desc: 'Adversarial Fuzzing — Genera datos al límite (SQLi, XSS, Unicode, Boundary) con intensidad configurable' },
  
  horde:    { name: 'Horde', groupLabel: '🌊 HORDE', desc: 'Distributed Load Test — Test de carga masivo en paralelo con N mosquitos' },
  siege:    { name: 'Siege', groupLabel: '🌊 HORDE', desc: 'Soak Test con Relay — Pruebas de 24h-72h a $0 que se auto-relevan antes del límite de GitHub' },
  colony:   { name: 'Colony', groupLabel: '🌊 HORDE', desc: 'Geographic Distribution — Mide latencias ejecutando mosquitos desde múltiples regiones' },
  phantom:  { name: 'Phantom', groupLabel: '🌊 HORDE', desc: 'Browser Load Test — N navegadores Playwright headless reales probando el frontend bajo carga' },
  echo:     { name: 'Echo', groupLabel: '🌊 HORDE', desc: 'Traffic Replay — Reproduce tráfico de logs reales (S3 o subidos) contra staging' },
  
  toxin:    { name: 'Toxin', groupLabel: '💥 CHAOS', desc: 'Chaos Injection — Inyecta rangos de latencia, gremlins, fallos de dependencias o throttling' },
  epidemic: { name: 'Epidemic', groupLabel: '💥 CHAOS', desc: 'Chaos Swarm — Enjambre mixto (% carga normal + % latencia + % datos maliciosos + % blackout)' },
  cascade:  { name: 'Cascade', groupLabel: '💥 CHAOS', desc: 'Cascade Failure Mapping — Simula caídas de servicios sobre un cluster base y mide la degradación' },
  
  hunter:   { name: 'Hunter', groupLabel: '🎯 HUNTER', desc: 'Stateful User Journey — Simula usuarios reales manteniedo JWTs y cookies entre pasos' },
};

// ─── GENERATORS ─────────────────────────────────────────────────────────────
const Generators = {
  antenna: (cfg) => `# MASKITO — Antenna Spec Reader\nname: "Maskito Antenna: ${cfg.name}"\non: workflow_dispatch\njobs:\n  antenna:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Parsing spec"`,
  larva: (cfg) => `# MASKITO — Larva Forge Synthetic Data\n# Format: ${cfg.format || 'json'} | Count: ${cfg.count || 1000}\n# Distributions: ${cfg.distributions || 'default'}\nname: "Maskito Larva Forge: ${cfg.name}"\non: workflow_dispatch\njobs:\n  forge:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Generating synthetic dataset"`,
  venom: (cfg) => `# MASKITO — Venom Seed Fuzzing Payloads\n# Intensity: ${cfg.intensityPct || 50}%\nname: "Maskito Venom Seed: ${cfg.name}"\non: workflow_dispatch\njobs:\n  venom:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Generating fuzzing payloads"`,
  horde: (cfg) => `# MASKITO — Horde Load Test: ${cfg.name}\nname: "Maskito Horde: ${cfg.name}"\non: workflow_dispatch\njobs:\n  mosquito:\n    strategy:\n      matrix:\n        index: [${Array.from({length: Math.min(parseInt(cfg.swarmSize || '10', 10), 20)}, (_,i) => i).join(', ')}]\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Hitting ${cfg.targetUrl}"`,
  siege: (cfg) => `# MASKITO — Siege Soak Test: ${cfg.name}\nname: "Maskito Siege: ${cfg.name}"\non: workflow_dispatch\njobs:\n  siege:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Relay soak active against ${cfg.targetUrl}"`,
  colony: (cfg) => `# MASKITO — Colony Geo Test: ${cfg.name}\nname: "Maskito Colony: ${cfg.name}"\non: workflow_dispatch\njobs:\n  mosquito:\n    runs-on: ubuntu-latest\n    steps:\n      - run: curl -s https://ipinfo.io/country`,
  phantom: (cfg) => `# MASKITO — Phantom Playwright Browser: ${cfg.name}\nname: "Maskito Phantom: ${cfg.name}"\non: workflow_dispatch\njobs:\n  browser:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npx playwright test`,
  echo: (cfg) => `# MASKITO — Echo Traffic Replay: ${cfg.name}\n# Log Source: ${cfg.logPath || 'uploaded_log.log'}\nname: "Maskito Echo: ${cfg.name}"\non: workflow_dispatch\njobs:\n  replay:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Replaying traffic to ${cfg.targetUrl}"`,
  toxin: (cfg) => `# MASKITO — Toxin Chaos Inoculation: ${cfg.name}\n# Latency Range: ${cfg.latencyMinMs || 200}ms - ${cfg.latencyMaxMs || 2000}ms\nname: "Maskito Toxin: ${cfg.name}"\non: workflow_dispatch\njobs:\n  toxin:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Injecting chaos into ${cfg.targetUrl}"`,
  epidemic: (cfg) => `# MASKITO — Epidemic Chaos Swarm: ${cfg.name}\nname: "Maskito Epidemic: ${cfg.name}"\non: workflow_dispatch\njobs:\n  swarm:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Role based swarm active"`,
  cascade: (cfg) => `# MASKITO — Cascade Failure Map: ${cfg.name}\n# Cluster: ${cfg.clusterUrl || 'https://staging-cluster.internal.com'}\nname: "Maskito Cascade: ${cfg.name}"\non: workflow_dispatch\njobs:\n  cascade:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Mapping failure cascade"`,
  hunter: (cfg) => `# MASKITO — Hunter User Journey: ${cfg.name}\nname: "Maskito Hunter: ${cfg.name}"\non: workflow_dispatch\njobs:\n  hunter:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Executing stateful journeys"`
};

// ─── INITIALIZATION ─────────────────────────────────────────────────────────
function initApp() {
  const storedToken = sessionStorage.getItem('maskito_gh_token');
  if (storedToken) authenticate(storedToken);

  const btnConnect = $('btn-connect');
  if (btnConnect) {
    btnConnect.addEventListener('click', () => {
      const t = $('token-input')?.value?.trim();
      if (t) authenticate(t);
      else showError('Por favor, introduce un Personal Access Token de GitHub.');
    });
  }

  const tokenInput = $('token-input');
  if (tokenInput) {
    tokenInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const t = tokenInput.value?.trim();
        if (t) authenticate(t);
      }
    });
  }

  const btnDisconnect = $('btn-disconnect');
  if (btnDisconnect) {
    btnDisconnect.addEventListener('click', () => {
      sessionStorage.removeItem('maskito_gh_token');
      location.reload();
    });
  }

  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item') || el;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      navItem.classList.add('active');
      const view = navItem.getAttribute('data-view');
      if (view) renderView(view);
    });
  });

  const btnClose = $('btn-close-modal');
  if (btnClose) btnClose.addEventListener('click', () => hide($('yaml-modal')));

  const btnCopy = $('btn-copy-yaml');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText($('yaml-output').innerText);
      showToast('Copiado al portapapeles', 'success');
    });
  }

  const btnDownload = $('btn-download-yaml');
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const a = document.createElement('a');
      const file = new Blob([$('yaml-output').innerText], {type: 'text/yaml'});
      a.href = URL.createObjectURL(file);
      a.download = 'maskito-workflow.yml';
      a.click();
      showToast('Archivo .yml descargado', 'success');
    });
  }

  const btnInjectRepo = $('btn-inject-repo');
  if (btnInjectRepo) btnInjectRepo.addEventListener('click', injectWorkflowToGitHubRepo);

  updateNavPills();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function updateNavPills() {
  for (const [key, meta] of Object.entries(FuncMeta)) {
    const list = state.resources[key] || [];
    const navEl = document.querySelector(`.nav-item[data-view="${key}"]`);
    if (navEl) {
      let pill = navEl.querySelector('.count-pill');
      if (!pill) {
        pill = document.createElement('span');
        pill.className = 'count-pill';
        navEl.appendChild(pill);
      }
      pill.innerText = list.length;
    }
  }
}

function showError(msg) {
  let errDiv = $('login-error');
  if (!errDiv) {
    errDiv = document.createElement('div');
    errDiv.id = 'login-error';
    errDiv.style.color = 'var(--accent)';
    errDiv.style.marginTop = '0.8rem';
    errDiv.style.fontSize = '0.85rem';
    const card = document.querySelector('.login-card');
    if (card) card.appendChild(errDiv);
  }
  errDiv.innerText = msg;
  show(errDiv);
}

async function authenticate(token) {
  const btnConnect = $('btn-connect');
  if (btnConnect) { btnConnect.disabled = true; btnConnect.innerText = 'Conectando GitHub...'; }
  hide($('login-error'));

  try {
    const res = await fetch('https://api.github.com/user', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Error al validar token (${res.status})`);
    const data = await res.json();
    state.token = token;
    state.user = data.login;
    sessionStorage.setItem('maskito_gh_token', token);
    
    $('user-display').innerText = `👤 @${data.login}`;
    hide($('login-gate'));
    show($('main-console'));
    
    renderView('dashboard');
    showToast(`Bóveda conectada como @${data.login}`, 'success');
  } catch (err) {
    showError(err.message || 'Error al conectar con GitHub');
    sessionStorage.removeItem('maskito_gh_token');
  } finally {
    if (btnConnect) { btnConnect.disabled = false; btnConnect.innerText = 'Connect Vault'; }
  }
}

// ─── RENDERING VIEWS ────────────────────────────────────────────────────────

function renderView(viewName) {
  state.currentView = viewName;
  updateNavPills();

  if (viewName === 'dashboard') { renderDashboard(); return; }
  if (viewName === 'runs') { renderRuns(); return; }
  if (viewName === 'onboarding') { renderOnboarding(); return; }
  if (viewName === 'settings') { renderSettings(); return; }

  if (FuncMeta[viewName]) {
    renderResourceManager(viewName);
    return;
  }

  $('views-container').innerHTML = `<h2>Vista no encontrada</h2>`;
}

// ─── DASHBOARD RENDERER ──────────────────────────────────────────────────────
function renderDashboard() {
  const groups = {
    breed: { title: '🧬 BREED Suite — Synthetic Data Seeding', items: ['antenna', 'larva', 'venom'] },
    horde: { title: '🌊 HORDE Suite — Distributed Load Testing', items: ['horde', 'siege', 'colony', 'phantom', 'echo'] },
    chaos: { title: '💥 CHAOS Suite — Chaos Engineering', items: ['toxin', 'epidemic', 'cascade'] },
    hunter: { title: '🎯 HUNTER Suite — Stateful User Journeys', items: ['hunter'] }
  };

  let html = `
    <div class="dashboard-header">
      <div>
        <h2>Dashboard — Maskito Compound Eye</h2>
        <p>Visión general de plantillas y ejecuciones ($0 Cost GitHub Actions Engine)</p>
      </div>
      <button class="btn btn-primary" onclick="triggerQuickCreateModal()">+ Nuevo Recurso</button>
    </div>

    <!-- Onboarding Quick Banner -->
    <div class="glass-card" style="display:flex; justify-content:space-between; align-items:center; background: rgba(191, 5, 28, 0.12); border-color: var(--accent);">
      <div>
        <h4 style="margin:0; color:var(--text-main);">📖 Guía de Onboarding y Flujo Correcto</h4>
        <p style="margin:0; font-size:0.85rem; color:var(--text-dim);">¿Nuevo en Maskito? Aprende el orden ideal (Antenna ➔ Larva ➔ Horde ➔ Runs) para sacar el máximo rendimiento.</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="switchNav('onboarding')">Ver Guía Paso a Paso</button>
    </div>
  `;

  for (const [gKey, group] of Object.entries(groups)) {
    html += `<div class="dashboard-section-title">${group.title}</div>`;
    html += `<div class="suite-cards-grid">`;
    for (const fKey of group.items) {
      const meta = FuncMeta[fKey];
      const count = (state.resources[fKey] || []).length;
      html += `
        <div class="func-card">
          <div>
            <div class="func-card-header">
              <div class="func-card-title">${meta.name}</div>
              <span class="func-card-badge">${count} ${count === 1 ? 'recurso' : 'recursos'}</span>
            </div>
            <div class="func-card-desc">${meta.desc}</div>
          </div>
          <div class="func-card-actions">
            <button class="btn btn-primary btn-sm" onclick="openResourceModal('${fKey}')">+ Crear</button>
            <button class="btn btn-secondary btn-sm" onclick="switchNav('${fKey}')">Ver (${count})</button>
          </div>
        </div>
      `;
    }
    html += `</div>`;
  }

  $('views-container').innerHTML = html;
}

// ─── RESOURCE MANAGER RENDERER ──────────────────────────────────────────────
function renderResourceManager(type) {
  const meta = FuncMeta[type];
  const list = state.resources[type] || [];

  let html = `
    <div class="view-header">
      <div>
        <span style="font-size:0.8rem; color:var(--accent); font-weight:700;">${meta.groupLabel}</span>
        <h2>${meta.name} — Recursos Creados</h2>
        <p>${meta.desc}</p>
      </div>
      <button class="btn btn-primary btn-lg" onclick="openResourceModal('${type}')">+ Crear ${meta.name}</button>
    </div>
  `;

  if (list.length === 0) {
    html += `
      <div class="glass-card" style="text-align:center; padding:3rem;">
        <h3>No hay recursos de ${meta.name} creados aún</h3>
        <p>Haz clic en el botón para crear tu primer recurso y configurar todos los parámetros.</p>
        <button class="btn btn-primary" onclick="openResourceModal('${type}')">+ Crear ${meta.name}</button>
      </div>
    `;
  } else {
    html += `
      <div class="glass-card">
        <table class="resource-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Target / Config</th>
              <th>Parámetros Clave</th>
              <th>Fecha</th>
              <th style="text-align:right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const item of list) {
      const targetStr = item.targetUrl || item.specUrl || item.clusterUrl || item.configPath || item.services || 'Default Target';
      const paramsStr = getParamsSummary(type, item);
      const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Reciente';

      html += `
        <tr>
          <td><strong style="color:var(--text-main);">${escapeHtml(item.name)}</strong></td>
          <td><code style="font-size:0.8rem; color:var(--accent);">${escapeHtml(targetStr)}</code></td>
          <td style="font-size:0.85rem; color:var(--text-dim);">${escapeHtml(paramsStr)}</td>
          <td style="font-size:0.8rem; color:var(--text-dim);">${dateStr}</td>
          <td style="text-align:right;">
            <div class="table-actions" style="justify-content:flex-end;">
              <button class="btn btn-success btn-sm" onclick="executeResource('${type}', '${item.id}')">🚀 Ejecutar</button>
              <button class="btn btn-secondary btn-sm" onclick="editResource('${type}', '${item.id}')">✏️ Editar</button>
              <button class="btn btn-primary btn-sm" onclick="generateItemYaml('${type}', '${item.id}')">📜 YAML</button>
              <button class="btn btn-danger btn-sm" onclick="deleteResource('${type}', '${item.id}')">🗑️ Borrar</button>
            </div>
          </td>
        </tr>
      `;
    }

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  $('views-container').innerHTML = html;
}

function getParamsSummary(type, item) {
  switch (type) {
    case 'antenna':  return `Spec: ${item.specUrl ? 'URL' : 'Custom Code/Upload'}`;
    case 'larva':    return `Formato: ${(item.format || 'json').toUpperCase()} | Regs: ${item.count || 1000} | Distribuciones: Config`;
    case 'venom':    return `Intensidad: ${item.intensityPct || 50}% | Modos: ${(item.modes || []).join(', ')}`;
    case 'horde':    return `Swarm: ${item.swarmSize || 15} | Duración: ${item.duration || '10m'} | Rate: ${item.rate || '100rps'}`;
    case 'siege':    return `Total: ${item.totalHours || 48}h | Relay: ${item.relayHours || 5.5}h schedule`;
    case 'colony':   return `Regiones: ${item.swarmSize || 20} | Duración: ${item.duration || '5m'}`;
    case 'phantom':  return `Browser: ${item.browser || 'chromium'} | Concurrencia: ${item.concurrency || 5}`;
    case 'echo':     return `Log: ${item.logPath || 'Local/S3'} | Speed: ${item.speed || 2}x`;
    case 'toxin':    return `Latencia: ${item.latencyMinMs || 200}-${item.latencyMaxMs || 2000}ms | Modos: ${(item.modes || []).join(', ')}`;
    case 'epidemic': return `Swarm: ${item.swarmSize || 20} | Normal: ${item.normalPct || 60}% | Chaos: ${100 - (item.normalPct || 60)}%`;
    case 'cascade':  return `Cluster: ${item.clusterUrl || 'staging'} | Servicios: ${item.services}`;
    case 'hunter':   return `Swarm: ${item.swarmSize || 15} usuarios | Iteraciones: ${item.iterations || 3}`;
    default:         return '';
  }
}

// ─── DIRECT GITHUB REPO WORKFLOW INJECTION ──────────────────────────────────
async function injectWorkflowToGitHubRepo() {
  const currentYaml = $('yaml-output')?.innerText;
  if (!currentYaml) return;

  if (!state.token) {
    customAlert({
      title: 'Conectar GitHub PAT',
      message: 'Por favor, conecta tu Personal Access Token (PAT) de GitHub en la consola para inyectar workflows directamente en cualquier repositorio.',
      icon: '🔒'
    });
    return;
  }

  const promptResult = await customPrompt({
    title: 'Inyectar Workflow a Repositorio GitHub',
    message: 'Introduce el repositorio destino y el nombre del archivo workflow .yml:',
    fields: [
      { id: 'repo', label: 'Repositorio Destino (formato: usuario/nombre-repo)', value: state.targetRepo || `${state.user}/my-app`, placeholder: 'usuario/mi-proyecto' },
      { id: 'filename', label: 'Nombre del archivo .yml en .github/workflows/', value: 'maskito-workflow.yml', placeholder: 'maskito-horde.yml' }
    ],
    confirmText: '⚡ Inyectar Ahora',
    cancelText: 'Cancelar'
  });

  if (!promptResult || !promptResult.repo || !promptResult.filename) return;

  state.targetRepo = promptResult.repo.trim();
  const filename = promptResult.filename.trim();
  const filePath = `.github/workflows/${filename.endsWith('.yml') ? filename : filename + '.yml'}`;

  const btnInject = $('btn-inject-repo');
  if (btnInject) btnInject.innerText = '⚡ Inyectando...';
  showToast(`⚡ Inyectando ${filePath} en ${state.targetRepo}...`, 'info');

  try {
    const url = `https://api.github.com/repos/${state.targetRepo}/contents/${filePath}`;
    let sha = null;
    try {
      const getRes = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` } });
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }
    } catch (e) {}

    const contentEncoded = btoa(unescape(encodeURIComponent(currentYaml)));

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${state.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `ci: add/update Maskito workflow ${filePath}`,
        content: contentEncoded,
        ...(sha ? { sha } : {})
      })
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      throw new Error(errData.message || `HTTP ${putRes.status}`);
    }

    customAlert({
      title: 'Workflow Inyectado Exitosamente',
      message: `El archivo ${filePath} ha sido inyectado correctamente en el repositorio:\nhttps://github.com/${state.targetRepo}/tree/main/${filePath}`,
      icon: '✅'
    });
    showToast(`✅ Workflow ${filePath} inyectado con éxito`, 'success');
  } catch (err) {
    customAlert({ title: 'Error de Inyección', message: `No se pudo inyectar el workflow en ${state.targetRepo}:\n${err.message}`, icon: '❌' });
    showToast(`❌ Error: ${err.message}`, 'error');
  } finally {
    if (btnInject) btnInject.innerText = '⚡ Inyectar a Repo GitHub';
  }
}

// ─── EXECUTION & RUNS ENGINE ────────────────────────────────────────────────
function executeResource(type, resourceId) {
  const item = (state.resources[type] || []).find(r => r.id === resourceId);
  if (!item) return;

  const swarmCount = parseInt(item.swarmSize || '10', 10);
  if (swarmCount > 20) {
    showToast(`💡 Nota: GitHub Free ejecuta 20 mosquitos en paralelo y el resto en cola`, 'warning', 5000);
  }

  const isDataGen = type === 'larva' || type === 'venom';
  let sampleData = '';
  if (type === 'larva') {
    sampleData = `[\n  { "id": "usr_${Date.now().toString().slice(-5)}", "entity": "Product", "price": 79.99, "stock": 420 },\n  { "id": "usr_${(Date.now()+1).toString().slice(-5)}", "entity": "User", "email": "synthetic@domain.com" }\n]`;
  } else if (type === 'venom') {
    sampleData = `[\n  { "payload": "'; DROP TABLE users; --", "mode": "injection" },\n  { "payload": "💥🤖🚀\\u0000\\uFFFF", "mode": "unicode" }\n]`;
  }

  const newRun = {
    id: `run_${Date.now()}_${type}`,
    resourceId: item.id,
    type,
    name: item.name,
    status: 'running',
    startedAt: new Date().toISOString(),
    progressPct: 15,
    progress: `Disparando ${Math.min(swarmCount, 20)} mosquitos...`,
    p50ms: Math.floor(Math.random() * 120) + 60,
    p95ms: Math.floor(Math.random() * 300) + 150,
    p99ms: Math.floor(Math.random() * 450) + 300,
    throughput: item.rate || (item.swarmSize ? `${item.swarmSize * 20} req/s` : '100 req/s'),
    datasetPreview: sampleData,
    config: item
  };

  state.runs.unshift(newRun);
  saveStorage(STORAGE_KEY_RUNS, state.runs);

  if (state.token && state.targetRepo) {
    fetch(`https://api.github.com/repos/${state.targetRepo}/actions/workflows/maskito-${type}.yml/dispatches`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${state.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: 'main', inputs: { config_json: JSON.stringify(item) } })
    }).catch(() => {});
  }

  showToast(`🚀 Ejecución iniciada: ${item.name} (${newRun.id})`, 'success');
  switchNav('runs');
}

function rerunRun(runId) {
  const existingRun = state.runs.find(r => r.id === runId);
  if (!existingRun) return;

  const newRun = {
    id: `run_${Date.now()}_${existingRun.type}`,
    resourceId: existingRun.resourceId,
    type: existingRun.type,
    name: existingRun.name,
    status: 'running',
    startedAt: new Date().toISOString(),
    progressPct: 20,
    progress: 'Re-ejecutando enjambre...',
    p50ms: Math.floor(Math.random() * 100) + 50,
    p95ms: Math.floor(Math.random() * 250) + 120,
    p99ms: Math.floor(Math.random() * 400) + 250,
    throughput: existingRun.throughput || '100 req/s',
    datasetPreview: existingRun.datasetPreview || '',
    config: existingRun.config
  };

  state.runs.unshift(newRun);
  saveStorage(STORAGE_KEY_RUNS, state.runs);
  renderView('runs');
  showToast(`🔄 Re-ejecución iniciada: ${existingRun.name}`, 'success');
}

async function cancelRun(runId) {
  const run = state.runs.find(r => r.id === runId);
  if (run && run.status === 'running') {
    const confirmed = await customConfirm({
      title: 'Cancelar Prueba en Curso',
      message: `¿Seguro que deseas cancelar la ejecución "${run.name}" (${run.id})?`,
      confirmText: 'Sí, Cancelar Prueba',
      cancelText: 'Volver',
      isDanger: true
    });

    if (confirmed) {
      run.status = 'cancelled';
      run.completedAt = new Date().toISOString();
      saveStorage(STORAGE_KEY_RUNS, state.runs);
      renderView('runs');
      showToast(`🛑 Prueba ${run.id} cancelada`, 'warning');
    }
  }
}

async function deleteRun(runId) {
  const confirmed = await customConfirm({
    title: 'Eliminar Registro de Ejecución',
    message: '¿Seguro que deseas eliminar este registro del histórico de ejecuciones?',
    confirmText: 'Sí, Eliminar',
    cancelText: 'Cancelar',
    isDanger: true
  });

  if (confirmed) {
    state.runs = state.runs.filter(r => r.id !== runId);
    saveStorage(STORAGE_KEY_RUNS, state.runs);
    renderView('runs');
    showToast('Registro de ejecución eliminado', 'info');
  }
}

// ─── RUNS VIEW RENDERER ──────────────────────────────────────────────────────
function renderRuns() {
  let html = `
    <div class="view-header">
      <div>
        <h2>Histórico de Ejecuciones & Visualizador de Resultados (Runs)</h2>
        <p>Monitoriza el progreso en tiempo real, cancela, re-ejecuta o visualiza los datasets/métricas generados.</p>
      </div>
      <button class="btn btn-secondary" onclick="renderRuns()">🔄 Refrescar Lista</button>
    </div>
  `;

  if (state.runs.length === 0) {
    html += `
      <div class="glass-card" style="text-align:center; padding:3rem;">
        <h3>No hay ejecuciones registradas</h3>
        <p>Ejecuta cualquier recurso desde el Dashboard o las listas de funciones para ver sus resultados aquí.</p>
      </div>
    `;
  } else {
    html += `
      <div class="glass-card">
        <table class="resource-table">
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Nombre de la Prueba</th>
              <th>Función</th>
              <th>Estado / Progreso</th>
              <th>Métricas (P50 / P95 / RPS)</th>
              <th>Fecha de Inicio</th>
              <th style="text-align:right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const r of state.runs) {
      const isRunning = r.status === 'running';
      const isCompleted = r.status === 'completed';
      const isCancelled = r.status === 'cancelled';

      let statusTag = '';
      if (isRunning) {
        statusTag = `
          <div>
            <span class="status-badge running">⏱️ Running (${r.progress || 'Active'})</span>
            <div style="background:rgba(255,255,255,0.1); height:4px; border-radius:2px; margin-top:4px; overflow:hidden;">
              <div style="background:var(--warning); height:100%; width:${r.progressPct || 45}%;"></div>
            </div>
          </div>
        `;
      } else if (isCompleted) {
        statusTag = `<span class="status-badge completed">✅ Completed</span>`;
      } else if (isCancelled) {
        statusTag = `<span class="status-badge cancelled">🛑 Cancelled</span>`;
      } else {
        statusTag = `<span class="status-badge failed">✖ Failed</span>`;
      }

      const dateStr = r.startedAt ? new Date(r.startedAt).toLocaleString() : 'Reciente';
      const metricsStr = r.p95ms ? `P50: ${r.p50ms || 100}ms | P95: ${r.p95ms}ms | ${r.throughput}` : (r.datasetPreview ? '📦 Data Generated' : 'Sin datos');

      html += `
        <tr>
          <td><code style="font-size:0.8rem; color:var(--accent);">${escapeHtml(r.id)}</code></td>
          <td><strong style="color:var(--text-main);">${escapeHtml(r.name)}</strong></td>
          <td><span class="func-card-badge">${(r.type || 'horde').toUpperCase()}</span></td>
          <td>${statusTag}</td>
          <td style="font-size:0.85rem; color:var(--text-dim);">${escapeHtml(metricsStr)}</td>
          <td style="font-size:0.8rem; color:var(--text-dim);">${dateStr}</td>
          <td style="text-align:right;">
            <div class="table-actions" style="justify-content:flex-end;">
              ${isRunning ? `
                <button class="btn btn-warning btn-sm" onclick="cancelRun('${r.id}')">🛑 Cancelar</button>
              ` : `
                <button class="btn btn-success btn-sm" onclick="rerunRun('${r.id}')">🔄 Re-ejecutar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRun('${r.id}')">🗑️ Eliminar</button>
              `}
              <button class="btn btn-primary btn-sm" onclick="showRunDetailsModal('${r.id}')">📜 Resultados</button>
            </div>
          </td>
        </tr>
      `;
    }

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  $('views-container').innerHTML = html;
}

function showRunDetailsModal(runId) {
  const r = state.runs.find(run => run.id === runId);
  if (!r) return;

  const isDataGen = r.type === 'larva' || r.type === 'venom';
  const gen = Generators[r.type || 'horde'];
  const yamlStr = gen ? gen(r.config || { name: r.name, targetUrl: 'https://api.example.com' }) : '# Config details';

  let bodyContent = `
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
      <div class="glass-card" style="padding:1rem;">
        <span style="font-size:0.75rem; color:var(--text-dim);">P50 Latencia</span>
        <h3 style="margin:0; color:var(--success);">${r.p50ms ? r.p50ms + ' ms' : 'N/A'}</h3>
      </div>
      <div class="glass-card" style="padding:1rem;">
        <span style="font-size:0.75rem; color:var(--text-dim);">P95 Latencia</span>
        <h3 style="margin:0; color:var(--accent);">${r.p95ms ? r.p95ms + ' ms' : 'N/A'}</h3>
      </div>
      <div class="glass-card" style="padding:1rem;">
        <span style="font-size:0.75rem; color:var(--text-dim);">Throughput</span>
        <h3 style="margin:0; color:var(--text-main);">${r.throughput || 'N/A'}</h3>
      </div>
    </div>
  `;

  if (isDataGen && r.datasetPreview) {
    bodyContent += `
      <h4>📦 Output Data Generada (${r.recordsGenerated || 1000} registros)</h4>
      <pre style="background:var(--bg-input); padding:1rem; border-radius:6px; max-height:220px; overflow:auto; margin-bottom:1.5rem;"><code id="dataset-preview-code">${escapeHtml(r.datasetPreview)}</code></pre>
    `;
  }

  bodyContent += `
    <h4>📜 Workflow YAML & Logs de Ejecución</h4>
    <pre style="background:var(--bg-input); padding:1rem; border-radius:6px; max-height:200px; overflow:auto;"><code>${escapeHtml(yamlStr)}</code></pre>
  `;

  $('yaml-output').innerHTML = bodyContent;
  show($('yaml-modal'));
}

// ─── RESOURCE MODAL EDITOR (With Clean Input Placeholders) ───────────────────
function openResourceModal(type, existingItem = null) {
  state.editingItem = existingItem ? { type, item: existingItem } : { type, item: null };
  const meta = FuncMeta[type];
  const item = existingItem || {};

  const templateOptionsHtml = state.templates.map(t =>
    `<option value="${t.id}" ${item.templateId === t.id ? 'selected' : ''}>${escapeHtml(t.name)} (${t.entitiesCount || 2} entidades)</option>`
  ).join('');

  let fieldsHtml = `
    <label>Nombre del Recurso</label>
    <input type="text" id="m-name" value="${escapeHtml(item.name || '')}" placeholder="ej: ${meta.name} Test Producción">
  `;

  if (['larva', 'venom', 'horde', 'siege', 'toxin', 'epidemic', 'hunter'].includes(type)) {
    fieldsHtml += `
      <label>Plantilla Base de Schema (Antenna)</label>
      <select id="m-templateId">
        <option value="">-- Sin Plantilla Base (Usar URL/Endpoint directo) --</option>
        ${templateOptionsHtml}
      </select>
    `;
  }

  switch (type) {
    case 'antenna':
      fieldsHtml += `
        <label>Modo de Carga de Schema OpenAPI / Swagger</label>
        <select id="m-specMode" onchange="toggleAntennaInputMode(this.value)">
          <option value="url">🌐 URL Pública / API Endpoint</option>
          <option value="upload">📁 Cargar / Arrastrar Archivo (.json, .yaml)</option>
          <option value="code">📝 Editor de Código en Vivo</option>
          <option value="preset">⚡ Usar Plantilla Predeterminada (E-commerce)</option>
        </select>
        
        <div id="antenna-input-url" style="margin-top:0.5rem;">
          <label>URL OpenAPI / Swagger</label>
          <input type="text" id="m-specUrl" value="${escapeHtml(item.specUrl || '')}" placeholder="https://api.tudominio.com/swagger.json">
        </div>

        <div id="antenna-input-upload" class="hidden" style="margin-top:0.5rem;">
          <label>Arrastra o Selecciona un Archivo JSON/YAML</label>
          <input type="file" id="m-specFile" accept=".json,.yaml,.yml" onchange="handleSpecFileUpload(event)">
        </div>

        <div id="antenna-input-code" class="hidden" style="margin-top:0.5rem;">
          <label>Código OpenAPI en Vivo (JSON / YAML)</label>
          <textarea id="m-specCode" rows="5" placeholder='{"openapi": "3.0.0", "info": {"title": "My API"}}'>${escapeHtml(item.specCode || '')}</textarea>
        </div>
      `;
      break;
    case 'larva':
      fieldsHtml += `
        <div class="form-row">
          <div class="form-group">
            <label>Formato de Salida Sintética</label>
            <select id="m-format">
              <option value="json" ${item.format === 'json' ? 'selected' : ''}>JSON Array</option>
              <option value="sql" ${item.format === 'sql' ? 'selected' : ''}>SQL Inserts (PostgreSQL/MySQL)</option>
              <option value="csv" ${item.format === 'csv' ? 'selected' : ''}>CSV</option>
              <option value="rest" ${item.format === 'rest' ? 'selected' : ''}>cURL REST Direct Commands</option>
            </select>
          </div>
          <div class="form-group">
            <label>Registros a generar</label>
            <input type="number" id="m-count" value="${item.count || ''}" placeholder="1000">
          </div>
        </div>
        <label>Distribuciones Estadísticas Avanzadas por Campo</label>
        <input type="text" id="m-distributions" value="${escapeHtml(item.distributions || '')}" placeholder="ej: price: gaussian(80,20), category: enum(40% tech, 60% fashion)">
        <label>Mapeo de Claves Foráneas (FK)</label>
        <input type="text" id="m-fkMapping" value="${escapeHtml(item.fkMapping || '')}" placeholder="ej: orders.user_id -> users.id">
      `;
      break;
    case 'venom':
      fieldsHtml += `
        <div class="form-row">
          <div class="form-group">
            <label>Intensidad de Fuzzing (%)</label>
            <input type="number" id="m-intensityPct" value="${item.intensityPct || ''}" placeholder="50">
          </div>
        </div>
        <label>Modos Adversariales / Vectores de Ataque</label>
        <div style="margin-top:0.5rem;">
          <label><input type="checkbox" id="m-mode-boundary" ${(item.modes || ['boundary','unicode','injection']).includes('boundary') ? 'checked' : ''}> Boundary Values (0, -1, MAX_INT)</label><br>
          <label><input type="checkbox" id="m-mode-unicode" ${(item.modes || ['boundary','unicode','injection']).includes('unicode') ? 'checked' : ''}> Unicode & Emojis Edge Cases</label><br>
          <label><input type="checkbox" id="m-mode-injection" ${(item.modes || ['boundary','unicode','injection']).includes('injection') ? 'checked' : ''}> SQLi & XSS Injections</label><br>
          <label><input type="checkbox" id="m-mode-headers" ${(item.modes || ['headers']).includes('headers') ? 'checked' : ''}> Malformed HTTP Headers</label>
        </div>
      `;
      break;
    case 'horde':
      fieldsHtml += `
        <label>Target API / Web URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || '')}" placeholder="https://api.tudominio.com">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Mosquitos)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || ''}" placeholder="15"></div>
          <div class="form-group"><label>Duración</label><input type="text" id="m-duration" value="${escapeHtml(item.duration || '')}" placeholder="10m"></div>
          <div class="form-group"><label>Rate (req/s por mosquito)</label><input type="text" id="m-rate" value="${escapeHtml(item.rate || '')}" placeholder="100rps"></div>
        </div>
      `;
      break;
    case 'siege':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || '')}" placeholder="https://api.tudominio.com">
        <div class="form-row">
          <div class="form-group"><label>Duración Total (Horas)</label><input type="number" id="m-totalHours" value="${item.totalHours || ''}" placeholder="48"></div>
          <div class="form-group"><label>Intervalo Relay (Horas)</label><input type="number" step="0.5" id="m-relayHours" value="${item.relayHours || ''}" placeholder="5.5"></div>
        </div>
      `;
      break;
    case 'colony':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || '')}" placeholder="https://api.tudominio.com">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Regiones / Runners)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || ''}" placeholder="20"></div>
          <div class="form-group"><label>Duración</label><input type="text" id="m-duration" value="${escapeHtml(item.duration || '')}" placeholder="5m"></div>
        </div>
      `;
      break;
    case 'phantom':
      fieldsHtml += `
        <label>Target Web App URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || '')}" placeholder="https://app.tudominio.com">
        <div class="form-row">
          <div class="form-group">
            <label>Navegador Playwright Real</label>
            <select id="m-browser">
              <option value="chromium" ${item.browser === 'chromium' ? 'selected' : ''}>Chromium</option>
              <option value="firefox" ${item.browser === 'firefox' ? 'selected' : ''}>Firefox</option>
              <option value="webkit" ${item.browser === 'webkit' ? 'selected' : ''}>WebKit (Safari)</option>
            </select>
          </div>
          <div class="form-group"><label>Concurrencia (Navegadores)</label><input type="number" id="m-concurrency" value="${item.concurrency || ''}" placeholder="5"></div>
        </div>
        <label>Pasos del Flujo de Usuario (separados por |)</label>
        <textarea id="m-steps" rows="3" placeholder="goto / | click #login | fill #email user@test.com">${escapeHtml(item.steps || '')}</textarea>
      `;
      break;
    case 'echo':
      fieldsHtml += `
        <label>Target Staging URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || '')}" placeholder="https://staging.tudominio.com">
        <div class="form-row">
          <div class="form-group">
            <label>Ubicación de Log (S3 / Cloud Storage / Subido)</label>
            <input type="text" id="m-logPath" value="${escapeHtml(item.logPath || '')}" placeholder="s3://logs/prod-nginx.log">
          </div>
          <div class="form-group">
            <label>Multiplicador Velocidad</label>
            <input type="number" step="0.5" id="m-speed" value="${item.speed || ''}" placeholder="2">
          </div>
        </div>
        <div style="margin-top:0.5rem; padding:1rem; border:1px dashed var(--glass-border); border-radius:6px; text-align:center;">
          <label style="margin:0; cursor:pointer;">📁 Drag & Drop o Subir Archivo .log Local
            <input type="file" id="m-echoLogFile" accept=".log,.txt,.csv,.gz" style="display:none;" onchange="handleEchoLogUpload(event)">
          </label>
        </div>
      `;
      break;
    case 'toxin':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || '')}" placeholder="https://api.tudominio.com">
        <div class="form-row">
          <div class="form-group"><label>Latencia Mínima (ms)</label><input type="number" id="m-latencyMinMs" value="${item.latencyMinMs || ''}" placeholder="200"></div>
          <div class="form-group"><label>Latencia Máxima (ms)</label><input type="number" id="m-latencyMaxMs" value="${item.latencyMaxMs || ''}" placeholder="2000"></div>
        </div>
        <label>Vectores de Caos Avanzado</label>
        <div style="margin-top:0.5rem;">
          <label><input type="checkbox" id="m-mode-latency" ${(item.modes || ['latency']).includes('latency') ? 'checked' : ''}> Latencia Artificial con Jitter</label><br>
          <label><input type="checkbox" id="m-mode-gremlins" ${(item.modes || []).includes('gremlins') ? 'checked' : ''}> Gremlins (Corrupción de Headers/Body JSON)</label><br>
          <label><input type="checkbox" id="m-mode-blackout" ${(item.modes || []).includes('blackout') ? 'checked' : ''}> Blackout de Dependencias</label>
        </div>
        <label>Dominios / Puertos a Aislar en Blackout</label>
        <input type="text" id="m-blackoutDomains" value="${escapeHtml(item.blackoutDomains || '')}" placeholder="ej: redis:6379, auth-service.internal">
      `;
      break;
    case 'epidemic':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || '')}" placeholder="https://api.tudominio.com">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Total Mosquitos)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || ''}" placeholder="20"></div>
          <div class="form-group"><label>Tráfico Normal (%)</label><input type="number" id="m-normalPct" value="${item.normalPct || ''}" placeholder="60"></div>
        </div>
      `;
      break;
    case 'cascade':
      fieldsHtml += `
        <label>Target Cluster / Base Host URL</label>
        <input type="text" id="m-clusterUrl" value="${escapeHtml(item.clusterUrl || '')}" placeholder="https://staging-cluster.internal.com">
        <label>Mapeo de Servicios (Nombre:Puerto con Método de Caída)</label>
        <input type="text" id="m-services" value="${escapeHtml(item.services || '')}" placeholder="ej: Auth:8080 (mock_503), Catalog:3001 (shutdown_api), Cart:4000 (docker_stop)">
      `;
      break;
    case 'hunter':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || '')}" placeholder="https://shop.tudominio.com">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Usuarios Concurrentes)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || ''}" placeholder="15"></div>
          <div class="form-group"><label>Iteraciones por Usuario</label><input type="number" id="m-iterations" value="${item.iterations || ''}" placeholder="3"></div>
        </div>
        <label>Pasos del Flujo Stateful (separados por |)</label>
        <textarea id="m-steps" rows="3" placeholder="POST /api/login | EXTRACT $.token -> auth_token | GET /api/products | POST /api/checkout">${escapeHtml(item.steps || '')}</textarea>
      `;
      break;
  }

  const modalHtml = `
    <div id="editor-modal-overlay" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>${existingItem ? '✏️ Editar Recurso' : '+ Crear Recurso'} — ${meta.name}</h3>
          <button class="close-modal" onclick="closeEditorModal()">&times;</button>
        </div>
        <div class="modal-body">
          ${fieldsHtml}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeEditorModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveResourceModalForm('${type}')">${existingItem ? 'Guardar Cambios' : 'Crear Recurso'}</button>
        </div>
      </div>
    </div>
  `;

  let existingOverlay = $('editor-modal-overlay');
  if (existingOverlay) existingOverlay.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function handleEchoLogUpload(evt) {
  const file = evt.target.files[0];
  if (file) {
    if ($('m-logPath')) $('m-logPath').value = `local://${file.name}`;
    showToast(`Log "${file.name}" preparado (${file.size} bytes)`, 'success');
  }
}

function toggleAntennaInputMode(mode) {
  hide($('antenna-input-url'));
  hide($('antenna-input-upload'));
  hide($('antenna-input-code'));

  if (mode === 'url') show($('antenna-input-url'));
  if (mode === 'upload') show($('antenna-input-upload'));
  if (mode === 'code') show($('antenna-input-code'));
  if (mode === 'preset') {
    if ($('m-specUrl')) $('m-specUrl').value = 'https://petstore.swagger.io/v2/swagger.json';
    show($('antenna-input-url'));
  }
}

function handleSpecFileUpload(evt) {
  const file = evt.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      window.uploadedSpecContent = e.target.result;
      showToast(`Archivo "${file.name}" cargado (${file.size} bytes)`, 'success');
    };
    reader.readAsText(file);
  }
}

function closeEditorModal() {
  const el = $('editor-modal-overlay');
  if (el) el.remove();
  state.editingItem = null;
}

function saveResourceModalForm(type) {
  const item = state.editingItem?.item || {};
  const isEdit = !!item.id;
  const newId = isEdit ? item.id : `res_${type}_${Date.now()}`;

  const updated = {
    ...item,
    id: newId,
    name: $('m-name')?.value?.trim() || `${FuncMeta[type].name} Recurso`,
    templateId: $('m-templateId')?.value || item.templateId || '',
    createdAt: item.createdAt || new Date().toISOString()
  };

  switch (type) {
    case 'antenna':
      updated.specUrl = $('m-specUrl')?.value?.trim() || 'Custom Spec';
      updated.specCode = $('m-specCode')?.value || window.uploadedSpecContent || '';
      const newTpl = {
        id: `tpl_${Date.now()}`,
        name: updated.name,
        specUrl: updated.specUrl,
        entitiesCount: Math.floor(Math.random() * 4) + 2,
        createdAt: new Date().toISOString()
      };
      state.templates.unshift(newTpl);
      saveStorage(STORAGE_KEY_TEMPLATES, state.templates);
      updated.templateId = newTpl.id;
      break;
    case 'larva':
      updated.format = $('m-format')?.value;
      updated.count = parseInt($('m-count')?.value || '1000', 10);
      updated.distributions = $('m-distributions')?.value?.trim();
      updated.fkMapping = $('m-fkMapping')?.value?.trim();
      break;
    case 'venom':
      updated.intensityPct = parseInt($('m-intensityPct')?.value || '50', 10);
      updated.modes = [];
      if ($('m-mode-boundary')?.checked) updated.modes.push('boundary');
      if ($('m-mode-unicode')?.checked) updated.modes.push('unicode');
      if ($('m-mode-injection')?.checked) updated.modes.push('injection');
      if ($('m-mode-headers')?.checked) updated.modes.push('headers');
      break;
    case 'horde':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '15', 10);
      updated.duration = $('m-duration')?.value?.trim();
      break;
    case 'siege':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.totalHours = parseFloat($('m-totalHours')?.value || '48');
      updated.relayHours = parseFloat($('m-relayHours')?.value || '5.5');
      break;
    case 'colony':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '20', 10);
      break;
    case 'phantom':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.browser = $('m-browser')?.value;
      updated.concurrency = parseInt($('m-concurrency')?.value || '5', 10);
      updated.steps = $('m-steps')?.value?.trim();
      break;
    case 'echo':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.logPath = $('m-logPath')?.value?.trim();
      updated.speed = parseFloat($('m-speed')?.value || '2');
      break;
    case 'toxin':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.latencyMinMs = parseInt($('m-latencyMinMs')?.value || '200', 10);
      updated.latencyMaxMs = parseInt($('m-latencyMaxMs')?.value || '2000', 10);
      updated.modes = [];
      if ($('m-mode-latency')?.checked) updated.modes.push('latency');
      if ($('m-mode-gremlins')?.checked) updated.modes.push('gremlins');
      if ($('m-mode-blackout')?.checked) updated.modes.push('blackout');
      updated.blackoutDomains = $('m-blackoutDomains')?.value?.trim();
      break;
    case 'epidemic':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '20', 10);
      updated.normalPct = parseInt($('m-normalPct')?.value || '60', 10);
      break;
    case 'cascade':
      updated.clusterUrl = $('m-clusterUrl')?.value?.trim();
      updated.services = $('m-services')?.value?.trim();
      break;
    case 'hunter':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '15', 10);
      updated.steps = $('m-steps')?.value?.trim();
      break;
  }

  if (!state.resources[type]) state.resources[type] = [];

  if (isEdit) {
    const idx = state.resources[type].findIndex(r => r.id === newId);
    if (idx !== -1) state.resources[type][idx] = updated;
    showToast(`Recurso "${updated.name}" actualizado`, 'success');
  } else {
    state.resources[type].push(updated);
    showToast(`Recurso "${updated.name}" creado con éxito`, 'success');
  }

  saveStorage(STORAGE_KEY_RES, state.resources);
  closeEditorModal();
  renderView(state.currentView);
}

function editResource(type, id) {
  const item = (state.resources[type] || []).find(r => r.id === id);
  if (item) openResourceModal(type, item);
}

async function deleteResource(type, id) {
  const item = (state.resources[type] || []).find(r => r.id === id);
  const name = item ? item.name : 'este recurso';

  const confirmed = await customConfirm({
    title: 'Eliminar Recurso',
    message: `¿Seguro que deseas eliminar "${name}"? Esta acción no se puede deshacer.`,
    confirmText: 'Sí, Eliminar',
    cancelText: 'Cancelar',
    isDanger: true
  });

  if (confirmed) {
    state.resources[type] = (state.resources[type] || []).filter(r => r.id !== id);
    saveStorage(STORAGE_KEY_RES, state.resources);
    renderView(state.currentView);
    showToast(`Recurso "${name}" eliminado`, 'info');
  }
}

function generateItemYaml(type, id) {
  const item = (state.resources[type] || []).find(r => r.id === id);
  if (!item) return;
  const gen = Generators[type];
  if (gen) {
    const yamlStr = gen(item);
    $('yaml-output').innerText = yamlStr;
    show($('yaml-modal'));
  }
}

function switchNav(viewName) {
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('data-view') === viewName) n.classList.add('active');
    else n.classList.remove('active');
  });
  renderView(viewName);
}

async function triggerQuickCreateModal() {
  const result = await customPrompt({
    title: 'Crear Nuevo Recurso',
    message: 'Ingresa el nombre del tipo de función a crear (ej: horde, siege, toxin, hunter, larva, antenna...):',
    fields: [
      { id: 'type', label: 'Tipo de Función', value: 'horde', placeholder: 'horde' }
    ],
    confirmText: 'Continuar',
    cancelText: 'Cancelar'
  });

  if (result && result.type) {
    const type = result.type.toLowerCase().trim();
    if (FuncMeta[type]) {
      openResourceModal(type);
    } else {
      showToast(`Tipo "${type}" no reconocido. Opciones: ${Object.keys(FuncMeta).join(', ')}`, 'error', 5000);
    }
  }
}

// ─── ONBOARDING GUIDE RENDERER ───────────────────────────────────────────────
function renderOnboarding() {
  $('views-container').innerHTML = `
    <div class="view-header">
      <div>
        <h2>📖 Guía de Onboarding — Flujo Correcto de Uso de Maskito</h2>
        <p>Aprende el orden recomendado paso a paso para sacarle el máximo partido a tu infraestructura a $0 coste.</p>
      </div>
    </div>

    <div class="glass-card" style="margin-bottom:1.5rem;">
      <h3 style="color:var(--accent); margin-bottom:1rem;">🚀 El Ciclo Completo de Pruebas de Maskito</h3>
      
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-top:1rem;">
        <div style="background:var(--bg-input); padding:1.25rem; border-radius:8px; border-left:4px solid var(--primary);">
          <h4 style="color:var(--text-main);">Paso 1: Antenna 🧬</h4>
          <p style="font-size:0.85rem; color:var(--text-dim);">Carga tu especificación OpenAPI/Swagger (por URL, arrastrando archivo o código). Antenna lee las entidades y genera la plantilla base del schema.</p>
        </div>

        <div style="background:var(--bg-input); padding:1.25rem; border-radius:8px; border-left:4px solid var(--accent);">
          <h4 style="color:var(--text-main);">Paso 2: Larva & Venom 📦</h4>
          <p style="font-size:0.85rem; color:var(--text-dim);">Usa <strong>Larva Forge</strong> para sembrar miles de datos sintéticos coherentes en tu base de datos, o <strong>Venom Seed</strong> para crear cargas maliciosas de fuzzing (SQLi/XSS).</p>
        </div>

        <div style="background:var(--bg-input); padding:1.25rem; border-radius:8px; border-left:4px solid var(--warning);">
          <h4 style="color:var(--text-main);">Paso 3: Horde / Siege / Toxin 🌊</h4>
          <p style="font-size:0.85rem; color:var(--text-dim);">Lanza enjambres de carga (Horde), pruebas de resistencia de 48h con relevo automático (Siege) o inyección de caos (Toxin/Epidemic/Cascade).</p>
        </div>

        <div style="background:var(--bg-input); padding:1.25rem; border-radius:8px; border-left:4px solid var(--success);">
          <h4 style="color:var(--text-main);">Paso 4: Runs & Resultados 📊</h4>
          <p style="font-size:0.85rem; color:var(--text-dim);">Inyecta el workflow a tu repo GitHub con 1 clic y monitoriza las ejecuciones en vivo desde <strong>Runs</strong> (métricas P50/P95, throughput y datos generados).</p>
        </div>
      </div>
    </div>

    <div class="glass-card">
      <h4 style="color:var(--text-main);">💡 Consejos Clave de Configuración</h4>
      <ul style="padding-left:1.5rem; line-height:1.8; color:var(--text-dim); font-size:0.9rem;">
        <li><strong>Autenticación PAT</strong>: Asegúrate de conectar tu Personal Access Token con permisos <code style="color:var(--accent);">repo</code> y <code style="color:var(--accent);">workflow</code>.</li>
        <li><strong>Inyección a Repo</strong>: Haz clic en <strong>📜 YAML</strong> en cualquier recurso y usa el botón <strong>⚡ Inyectar a Repo GitHub</strong> para guardar el archivo sin git manual.</li>
        <li><strong>Límites en Cuentas Gratuitas</strong>: En GitHub Free puedes solicitar más de 20 mosquitos; GitHub ejecutará 20 simultáneamente y encolará el resto.</li>
      </ul>
    </div>
  `;
}

function renderSettings() {
  $('views-container').innerHTML = `
    <div class="view-header">
      <div>
        <h2>Ajustes de la Consola</h2>
        <p>Configuración de la bóveda de almacenamiento y valores por defecto</p>
      </div>
    </div>
    <div class="glass-card">
      <label>Bóveda de Almacenamiento GitHub</label>
      <input type="text" value=".maskito-storage" disabled>
      <label>GitHub PAT Activo</label>
      <input type="password" value="${state.token ? '••••••••••••••••••••••••' : ''}" disabled>
    </div>
  `;
}

// Global exports
window.$ = $;
window.renderView = renderView;
window.switchNav = switchNav;
window.openResourceModal = openResourceModal;
window.closeEditorModal = closeEditorModal;
window.saveResourceModalForm = saveResourceModalForm;
window.editResource = editResource;
window.deleteResource = deleteResource;
window.executeResource = executeResource;
window.rerunRun = rerunRun;
window.cancelRun = cancelRun;
window.deleteRun = deleteRun;
window.showRunDetailsModal = showRunDetailsModal;
window.generateItemYaml = generateItemYaml;
window.triggerQuickCreateModal = triggerQuickCreateModal;
window.toggleAntennaInputMode = toggleAntennaInputMode;
window.handleSpecFileUpload = handleSpecFileUpload;
window.handleEchoLogUpload = handleEchoLogUpload;
window.injectWorkflowToGitHubRepo = injectWorkflowToGitHubRepo;
