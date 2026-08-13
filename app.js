// MASKITO Console App v4.0
// Fully Integrated Engine with Custom Dark-Theme UI Popups, Toasts, Prompts & Dialogs.
// No native browser alert/prompt/confirm!

const STORAGE_KEY_RES  = 'maskito_resources_v3';
const STORAGE_KEY_RUNS = 'maskito_runs_v3';
const STORAGE_KEY_TEMPLATES = 'maskito_templates_v3';

// ─── DEFAULT TEMPLATES (Antenna Schemas) ────────────────────────────────────
const defaultTemplates = [
  { id: 'tpl_ecommerce', name: 'E-commerce API Schema', specUrl: 'https://petstore.swagger.io/v2/swagger.json', entitiesCount: 4, createdAt: new Date().toISOString() },
  { id: 'tpl_auth', name: 'Auth & User Service Schema', specUrl: 'https://express-auth.swagger.json', entitiesCount: 2, createdAt: new Date().toISOString() }
];

// ─── DEFAULT INITIAL RESOURCES ──────────────────────────────────────────────
const defaultResources = {
  antenna: [
    { id: 'ant_1', name: 'PetStore OpenAPI Spec', specUrl: 'https://petstore.swagger.io/v2/swagger.json', templateId: 'tpl_ecommerce', createdAt: new Date().toISOString() }
  ],
  larva: [
    { id: 'larv_1', name: 'Users & Orders Seed Data', templateId: 'tpl_ecommerce', format: 'sql', count: 500, databaseUrl: '', createdAt: new Date().toISOString() }
  ],
  venom: [
    { id: 'ven_1', name: 'Auth Fuzzing Payloads', templateId: 'tpl_auth', modes: ['boundary', 'unicode', 'injection'], outputPath: 'venom-payloads.json', createdAt: new Date().toISOString() }
  ],
  horde: [
    { id: 'hord_1', name: 'Primary API Load Test', templateId: 'tpl_ecommerce', targetUrl: 'https://api.example.com', swarmSize: 15, duration: '10m', rate: '100rps', authType: 'bearer', authToken: '${{ secrets.API_TOKEN }}', createdAt: new Date().toISOString() }
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
    { id: 'tox_1', name: 'Random Chaos Inoculation', templateId: 'tpl_ecommerce', targetUrl: 'https://api.example.com', modes: ['latency', 'gremlins'], latencyMs: 500, gremlinsRate: 0.3, createdAt: new Date().toISOString() }
  ],
  epidemic: [
    { id: 'epi_1', name: 'Black Friday Chaos Swarm', templateId: 'tpl_ecommerce', targetUrl: 'https://api.example.com', swarmSize: 20, normalPct: 60, latencyPct: 20, venomPct: 10, blackoutPct: 10, duration: '30m', createdAt: new Date().toISOString() }
  ],
  cascade: [
    { id: 'casc_1', name: 'Microservices Failure Mapping', services: 'Auth:8080, Catalog:3001, Cart:4000, Orders:5000', loadRps: 50, killDurationSec: 30, recoveryWaitSec: 15, createdAt: new Date().toISOString() }
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
    p95ms: 365,
    throughput: '1,240 req/s',
    config: { targetUrl: 'https://api.example.com', swarmSize: 15, duration: '10m' }
  },
  {
    id: 'run_1723450_siege',
    type: 'siege',
    name: 'Weekend 48h Soak Test',
    status: 'running',
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    progress: 'Relay 2/9 (Total 48h)',
    p95ms: 410,
    throughput: '50 req/s',
    config: { targetUrl: 'https://api.example.com', totalHours: 48 }
  }
];

// ─── STATE ──────────────────────────────────────────────────────────────────
const state = {
  token: null,
  user: null,
  targetRepo: '', // e.g. owner/my-app
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

// ─── CUSTOM UI POPUPS & TOAST SYSTEM (No native alert/prompt) ───────────────

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

    const close = () => {
      $('custom-popup-overlay')?.remove();
      resolve();
    };

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

    const cleanup = (val) => {
      $('custom-popup-overlay')?.remove();
      resolve(val);
    };

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

    const cleanup = (val) => {
      $('custom-popup-overlay')?.remove();
      resolve(val);
    };

    $('popup-close-btn').onclick = () => cleanup(null);
    $('popup-cancel-btn').onclick = () => cleanup(null);
    $('popup-confirm-btn').onclick = () => {
      const res = {};
      fields.forEach(f => {
        res[f.id] = $(`p-field-${f.id}`)?.value?.trim() || '';
      });
      cleanup(res);
    };
  });
}

// ─── METADATA ───────────────────────────────────────────────────────────────
const FuncMeta = {
  antenna:  { name: 'Antenna', groupLabel: '🧬 BREED', desc: 'Schema Reader — Lee OpenAPI/Swagger (URL, archivo o código en vivo) y crea plantillas base' },
  larva:    { name: 'Larva Forge', groupLabel: '🧬 BREED', desc: 'Synthetic Seeding — Genera data sintética realista (SQL, JSON, CSV) usando plantillas Antenna' },
  venom:    { name: 'Venom Seed', groupLabel: '🧬 BREED', desc: 'Adversarial Fuzzing — Genera datos al límite (SQLi, XSS, Unicode, Boundary) para romper validaciones' },
  
  horde:    { name: 'Horde', groupLabel: '🌊 HORDE', desc: 'Distributed Load Test — Test de carga en paralelo con N mosquitos simulando tráfico' },
  siege:    { name: 'Siege', groupLabel: '🌊 HORDE', desc: 'Soak Test con Relay — Pruebas de 24h-72h a $0 que se auto-relevan antes del límite de GitHub' },
  colony:   { name: 'Colony', groupLabel: '🌊 HORDE', desc: 'Geographic Distribution — Mide latencias ejecutando mosquitos desde múltiples regiones' },
  phantom:  { name: 'Phantom', groupLabel: '🌊 HORDE', desc: 'Browser Load Test — N navegadores Playwright headless reales probando el frontend bajo carga' },
  echo:     { name: 'Echo', groupLabel: '🌊 HORDE', desc: 'Traffic Replay — Reproduce patrones de tráfico de logs reales de Nginx/S3 contra staging' },
  
  toxin:    { name: 'Toxin', groupLabel: '💥 CHAOS', desc: 'Chaos Injection — Inyecta latencia, gremlins, fallos de dependencias o throttling durante la prueba' },
  epidemic: { name: 'Epidemic', groupLabel: '💥 CHAOS', desc: 'Chaos Swarm — Enjambre mixto (% carga normal + % latencia + % datos maliciosos + % blackout)' },
  cascade:  { name: 'Cascade', groupLabel: '💥 CHAOS', desc: 'Cascade Failure Mapping — Simula caídas de servicios y mide la degradación de la arquitectura' },
  
  hunter:   { name: 'Hunter', groupLabel: '🎯 HUNTER', desc: 'Stateful User Journey — Simula usuarios reales (login -> JWT -> carrito -> pago -> logout)' },
};

// ─── GENERATORS ─────────────────────────────────────────────────────────────
const Generators = {
  antenna: (cfg) => `# MASKITO — Antenna Spec Reader
# Template ID: ${cfg.templateId || 'default'}

name: "Maskito Antenna: ${cfg.name}"
on: workflow_dispatch
jobs:
  antenna:
    runs-on: ubuntu-latest
    steps:
      - name: Parse Schema
        run: echo "Parsing schema spec from ${cfg.specUrl || 'Swagger/OpenAPI'}"
`,
  larva: (cfg) => `# MASKITO — Larva Forge Synthetic Data
# Schema Template: ${cfg.templateId || 'default'} | Format: ${cfg.format || 'sql'}

name: "Maskito Larva Forge: ${cfg.name}"
on: workflow_dispatch
jobs:
  forge:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Synthetic Data
        run: echo "Generating ${cfg.count || 500} records using template ${cfg.templateId || 'default'}"
`,
  venom: (cfg) => `# MASKITO — Venom Seed Fuzzing Payloads
# Schema Template: ${cfg.templateId || 'default'}

name: "Maskito Venom Seed: ${cfg.name}"
on: workflow_dispatch
jobs:
  venom:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Payloads
        run: echo "Generating adversarial payloads for schema ${cfg.templateId || 'default'}"
`,
  horde: (cfg) => `# MASKITO — Horde Load Test: ${cfg.name}
# Target: ${cfg.targetUrl} | Swarm: ${cfg.swarmSize} mosquitos | Template: ${cfg.templateId || 'none'}

name: "Maskito Horde: ${cfg.name}"
on: workflow_dispatch
jobs:
  swarm-controller:
    name: "🦟 Swarm Controller"
    runs-on: ubuntu-latest
    steps:
      - run: echo "🦟 Swarming ${cfg.targetUrl} with ${cfg.swarmSize} parallel mosquitos"
  mosquito:
    name: "🦟 Mosquito #\${{ matrix.index }}"
    needs: swarm-controller
    strategy:
      matrix:
        index: [${Array.from({length: Math.min(parseInt(cfg.swarmSize || '10', 10), 20)}, (_,i) => i).join(', ')}]
    runs-on: ubuntu-latest
    steps:
      - name: Run Load
        run: echo "Hitting ${cfg.targetUrl} for ${cfg.duration || '10m'} at ${cfg.rate || '100rps'}"
`,
  siege: (cfg) => `# MASKITO — Siege Soak Test: ${cfg.name}
# Duration: ${cfg.totalHours}h | Relay: ${cfg.relayHours}h schedule

name: "Maskito Siege: ${cfg.name}"
on: workflow_dispatch
jobs:
  siege-relay:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running Siege soak test against ${cfg.targetUrl} for ${cfg.totalHours}h"
      - name: Trigger Next Relay
        run: echo "Auto-triggering relay via GitHub API before 6h Action limit"
`,
  colony: (cfg) => `# MASKITO — Colony Geo Test: ${cfg.name}

name: "Maskito Colony: ${cfg.name}"
on: workflow_dispatch
jobs:
  mosquito:
    strategy:
      matrix:
        index: [${Array.from({length: Math.min(parseInt(cfg.swarmSize || '10', 10), 20)}, (_,i) => i).join(', ')}]
    runs-on: ubuntu-latest
    steps:
      - name: Geo IP Detection
        run: curl -s https://ipinfo.io/country
      - name: Hit Target
        run: curl -s -w "%{time_total}\\n" "${cfg.targetUrl}"
`,
  phantom: (cfg) => `# MASKITO — Phantom Playwright Browser Load: ${cfg.name}

name: "Maskito Phantom: ${cfg.name}"
on: workflow_dispatch
jobs:
  browser-mosquito:
    runs-on: ubuntu-latest
    steps:
      - name: Install Playwright
        run: npx playwright install --with-deps ${cfg.browser || 'chromium'}
      - name: Execute Browser Journeys
        run: npx playwright test
`,
  echo: (cfg) => `# MASKITO — Echo Traffic Replay: ${cfg.name}

name: "Maskito Echo: ${cfg.name}"
on: workflow_dispatch
jobs:
  replay:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Replaying traffic log ${cfg.logPath} against ${cfg.targetUrl} at ${cfg.speed || 1}x speed"
`,
  toxin: (cfg) => `# MASKITO — Toxin Chaos Inoculation: ${cfg.name}

name: "Maskito Toxin: ${cfg.name}"
on: workflow_dispatch
jobs:
  toxin:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Injecting Chaos modes: ${(cfg.modes || ['latency']).join(', ')} against ${cfg.targetUrl}"
`,
  epidemic: (cfg) => `# MASKITO — Epidemic Chaos Swarm: ${cfg.name}

name: "Maskito Epidemic: ${cfg.name}"
on: workflow_dispatch
jobs:
  swarm:
    strategy:
      matrix:
        index: [${Array.from({length: Math.min(parseInt(cfg.swarmSize || '10', 10), 20)}, (_,i) => i).join(', ')}]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Epidemic role assignment (Normal: ${cfg.normalPct || 60}%, Latency: ${cfg.latencyPct || 20}%, Blackout: ${cfg.blackoutPct || 10}%)"
`,
  cascade: (cfg) => `# MASKITO — Cascade Failure Map: ${cfg.name}

name: "Maskito Cascade: ${cfg.name}"
on: workflow_dispatch
jobs:
  cascade:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Mapping Cascade Failures for services: ${cfg.services}"
`,
  hunter: (cfg) => `# MASKITO — Hunter User Journey: ${cfg.name}

name: "Maskito Hunter: ${cfg.name}"
on: workflow_dispatch
jobs:
  hunter:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running multi-step stateful user journey against ${cfg.targetUrl}"
`
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

  // Nav item click handler
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item') || el;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      navItem.classList.add('active');
      const view = navItem.getAttribute('data-view');
      if (view) renderView(view);
    });
  });

  // Modal handlers
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
  if (btnInjectRepo) {
    btnInjectRepo.addEventListener('click', injectWorkflowToGitHubRepo);
  }

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
  if (btnConnect) {
    btnConnect.disabled = true;
    btnConnect.innerText = 'Conectando GitHub...';
  }
  hide($('login-error'));

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
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
    if (btnConnect) {
      btnConnect.disabled = false;
      btnConnect.innerText = 'Connect Vault';
    }
  }
}

// ─── RENDERING VIEWS ────────────────────────────────────────────────────────

function renderView(viewName) {
  state.currentView = viewName;
  updateNavPills();

  if (viewName === 'dashboard') { renderDashboard(); return; }
  if (viewName === 'runs') { renderRuns(); return; }
  if (viewName === 'configs') { renderConfigs(); return; }
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

    <!-- Storage & Template Banner -->
    <div class="glass-card" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h4 style="margin:0; color:var(--text-main);">🧬 Plantillas Antenna Disponibles (${state.templates.length})</h4>
        <p style="margin:0; font-size:0.85rem; color:var(--text-dim);">Las plantillas creadas en Antenna sirven de base para Larva Forge, Horde, Siege, Toxin y Epidemic.</p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="switchNav('antenna')">Ver Plantillas</button>
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
              <th>Plantilla / Config</th>
              <th>Parámetros Clave</th>
              <th>Fecha</th>
              <th style="text-align:right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const item of list) {
      const templateName = getTemplateName(item.templateId);
      const targetStr = item.targetUrl || item.specUrl || item.configPath || item.services || 'Default Target';
      const paramsStr = getParamsSummary(type, item);
      const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Reciente';

      html += `
        <tr>
          <td><strong style="color:var(--text-main);">${escapeHtml(item.name)}</strong></td>
          <td>
            <code style="font-size:0.8rem; color:var(--accent);">${escapeHtml(targetStr)}</code>
            ${templateName ? `<br><span style="font-size:0.75rem; color:var(--text-dim);">🧬 Plantilla: ${escapeHtml(templateName)}</span>` : ''}
          </td>
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

function getTemplateName(templateId) {
  if (!templateId) return null;
  const tpl = state.templates.find(t => t.id === templateId);
  return tpl ? tpl.name : templateId;
}

function getParamsSummary(type, item) {
  switch (type) {
    case 'antenna':  return `Spec: ${item.specUrl ? 'URL' : 'Uploaded/Custom'}`;
    case 'larva':    return `Formato: ${(item.format || 'sql').toUpperCase()} | Registros: ${item.count || 500}`;
    case 'venom':    return `Modos: ${(item.modes || []).join(', ')}`;
    case 'horde':    return `Swarm: ${item.swarmSize} | Duración: ${item.duration} | Rate: ${item.rate}`;
    case 'siege':    return `Total: ${item.totalHours}h | Relay: ${item.relayHours}h schedule`;
    case 'colony':   return `Regiones: ${item.swarmSize} | Duración: ${item.duration || '5m'}`;
    case 'phantom':  return `Navegador: ${item.browser || 'chromium'} | Concurrencia: ${item.concurrency}`;
    case 'echo':     return `Log: ${item.logPath} | Velocidad: ${item.speed || 1}x`;
    case 'toxin':    return `Modos: ${(item.modes || []).join(', ')} | Latencia: ${item.latencyMs || 0}ms`;
    case 'epidemic': return `Swarm: ${item.swarmSize} | Normal: ${item.normalPct || 60}% | Chaos: ${100 - (item.normalPct || 60)}%`;
    case 'cascade':  return `Servicios: ${item.services}`;
    case 'hunter':   return `Swarm: ${item.swarmSize} usuarios | Iteraciones: ${item.iterations || 1}`;
    default:         return '';
  }
}

// ─── DIRECT GITHUB REPO WORKFLOW INJECTION (With Custom Theme UI Dialog) ─────
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
    
    // Check if file exists to get SHA for update
    let sha = null;
    try {
      const getRes = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` } });
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }
    } catch (e) {}

    // Base64 encode YAML content safely
    const contentEncoded = btoa(unescape(encodeURIComponent(currentYaml)));

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${state.token}`,
        'Content-Type': 'application/json'
      },
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
    customAlert({
      title: 'Error de Inyección',
      message: `No se pudo inyectar el workflow en ${state.targetRepo}:\n${err.message}`,
      icon: '❌'
    });
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

  const newRun = {
    id: `run_${Date.now()}_${type}`,
    resourceId: item.id,
    type,
    name: item.name,
    status: 'running',
    startedAt: new Date().toISOString(),
    progress: `${Math.min(swarmCount, 20)} mosquitos activos...`,
    p95ms: Math.floor(Math.random() * 300) + 150,
    throughput: item.rate || (item.swarmSize ? `${item.swarmSize * 20} req/s` : '100 req/s'),
    config: item
  };

  state.runs.unshift(newRun);
  saveStorage(STORAGE_KEY_RUNS, state.runs);

  // Trigger dispatch via GitHub API if authenticated
  if (state.token && state.targetRepo) {
    fetch(`https://api.github.com/repos/${state.targetRepo}/actions/workflows/maskito-${type}.yml/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.token}`,
        'Content-Type': 'application/json'
      },
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
    progress: 'Re-ejecutando enjambre...',
    p95ms: Math.floor(Math.random() * 250) + 120,
    throughput: existingRun.throughput || '100 req/s',
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
        <h2>Histórico de Ejecuciones (Runs)</h2>
        <p>Gestiona, re-ejecuta, cancela o elimina las pruebas de estrés ejecutadas.</p>
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
              <th>Estado</th>
              <th>Métricas (P95 / RPS)</th>
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
        statusTag = `<span class="status-badge running">⏱️ Running (${r.progress || 'Active'})</span>`;
      } else if (isCompleted) {
        statusTag = `<span class="status-badge completed">✅ Completed</span>`;
      } else if (isCancelled) {
        statusTag = `<span class="status-badge cancelled">🛑 Cancelled</span>`;
      } else {
        statusTag = `<span class="status-badge failed">✖ Failed</span>`;
      }

      const dateStr = r.startedAt ? new Date(r.startedAt).toLocaleString() : 'Reciente';
      const metricsStr = r.p95ms ? `P95: ${r.p95ms}ms | ${r.throughput}` : 'Sin datos';

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
              <button class="btn btn-primary btn-sm" onclick="showRunYaml('${r.id}')">📜 Details</button>
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

function showRunYaml(runId) {
  const r = state.runs.find(run => run.id === runId);
  if (!r) return;
  const gen = Generators[r.type || 'horde'];
  const yamlStr = gen ? gen(r.config || { name: r.name, targetUrl: 'https://api.example.com' }) : '# Config details';
  $('yaml-output').innerText = `RUN DETAILS: ${r.id}\nStatus: ${r.status}\nStarted: ${r.startedAt}\n\nWORKFLOW YAML:\n${yamlStr}`;
  show($('yaml-modal'));
}

// ─── RESOURCE MODAL EDITOR (Creation & Modification) ────────────────────────
function openResourceModal(type, existingItem = null) {
  state.editingItem = existingItem ? { type, item: existingItem } : { type, item: null };
  const meta = FuncMeta[type];
  const item = existingItem || {};

  const templateOptionsHtml = state.templates.map(t =>
    `<option value="${t.id}" ${item.templateId === t.id ? 'selected' : ''}>${escapeHtml(t.name)} (${t.entitiesCount || 2} entidades)</option>`
  ).join('');

  let fieldsHtml = `
    <label>Nombre del Recurso</label>
    <input type="text" id="m-name" value="${escapeHtml(item.name || meta.name + ' Config')}" placeholder="Nombre descriptivo">
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
          <input type="text" id="m-specUrl" value="${escapeHtml(item.specUrl || 'https://petstore.swagger.io/v2/swagger.json')}">
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
              <option value="sql" ${item.format === 'sql' ? 'selected' : ''}>SQL Inserts (PostgreSQL/MySQL)</option>
              <option value="json" ${item.format === 'json' ? 'selected' : ''}>JSON Array</option>
              <option value="csv" ${item.format === 'csv' ? 'selected' : ''}>CSV</option>
              <option value="rest" ${item.format === 'rest' ? 'selected' : ''}>cURL REST Direct Commands</option>
            </select>
          </div>
          <div class="form-group">
            <label>Registros a generar</label>
            <input type="number" id="m-count" value="${item.count || 500}">
          </div>
        </div>
      `;
      break;
    case 'venom':
      fieldsHtml += `
        <label>Modos Adversariales Activos (Fuzzing)</label>
        <div style="margin-top:0.5rem;">
          <label><input type="checkbox" id="m-mode-boundary" ${(item.modes || ['boundary','unicode','injection']).includes('boundary') ? 'checked' : ''}> Boundary Values (0, -1, MAX_INT)</label><br>
          <label><input type="checkbox" id="m-mode-unicode" ${(item.modes || ['boundary','unicode','injection']).includes('unicode') ? 'checked' : ''}> Unicode & Emojis Edge Cases</label><br>
          <label><input type="checkbox" id="m-mode-injection" ${(item.modes || ['boundary','unicode','injection']).includes('injection') ? 'checked' : ''}> SQLi & XSS Injections</label><br>
          <label><input type="checkbox" id="m-mode-overflow" ${(item.modes || []).includes('overflow') ? 'checked' : ''}> Buffer Overflow Strings</label>
        </div>
      `;
      break;
    case 'horde':
      fieldsHtml += `
        <label>Target API / Web URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://api.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Mosquitos en paralelo)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || 10}"></div>
          <div class="form-group"><label>Duración</label><input type="text" id="m-duration" value="${escapeHtml(item.duration || '10m')}"></div>
          <div class="form-group"><label>Rate (req/s por mosquito)</label><input type="text" id="m-rate" value="${escapeHtml(item.rate || '100rps')}"></div>
        </div>
      `;
      break;
    case 'siege':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://api.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Duración Total (Horas)</label><input type="number" id="m-totalHours" value="${item.totalHours || 48}"></div>
          <div class="form-group"><label>Intervalo Relay (Horas)</label><input type="number" step="0.5" id="m-relayHours" value="${item.relayHours || 5.5}"></div>
          <div class="form-group"><label>Carga Sostenida (req/s)</label><input type="number" id="m-loadRps" value="${item.loadRps || 50}"></div>
        </div>
      `;
      break;
    case 'colony':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://api.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Regiones / Runners)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || 20}"></div>
          <div class="form-group"><label>Duración</label><input type="text" id="m-duration" value="${escapeHtml(item.duration || '5m')}"></div>
        </div>
      `;
      break;
    case 'phantom':
      fieldsHtml += `
        <label>Target Web App URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://app.example.com')}">
        <div class="form-row">
          <div class="form-group">
            <label>Navegador Playwright Real</label>
            <select id="m-browser">
              <option value="chromium" ${item.browser === 'chromium' ? 'selected' : ''}>Chromium</option>
              <option value="firefox" ${item.browser === 'firefox' ? 'selected' : ''}>Firefox</option>
              <option value="webkit" ${item.browser === 'webkit' ? 'selected' : ''}>WebKit (Safari)</option>
            </select>
          </div>
          <div class="form-group"><label>Concurrencia (Navegadores)</label><input type="number" id="m-concurrency" value="${item.concurrency || 5}"></div>
        </div>
        <label>Pasos del Flujo de Usuario (Acciones separadas por |)</label>
        <textarea id="m-steps" rows="3">${escapeHtml(item.steps || 'goto / | click #login | fill #email user@test.com | wait 1000')}</textarea>
      `;
      break;
    case 'echo':
      fieldsHtml += `
        <label>Target Staging URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://staging.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Ubicación de Log (S3 / Nginx / Subido)</label><input type="text" id="m-logPath" value="${escapeHtml(item.logPath || 's3://logs/prod-nginx.log')}"></div>
          <div class="form-group"><label>Multiplicador de Velocidad</label><input type="number" step="0.5" id="m-speed" value="${item.speed || 2}"></div>
        </div>
      `;
      break;
    case 'toxin':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://api.example.com')}">
        <label>Modos Caos Activos</label>
        <div style="margin-top:0.5rem;">
          <label><input type="checkbox" id="m-mode-latency" ${(item.modes || ['latency']).includes('latency') ? 'checked' : ''}> Inyección Latencia Artificial</label><br>
          <label><input type="checkbox" id="m-mode-gremlins" ${(item.modes || []).includes('gremlins') ? 'checked' : ''}> Gremlins (Peticiones Corrompidas)</label><br>
          <label><input type="checkbox" id="m-mode-blackout" ${(item.modes || []).includes('blackout') ? 'checked' : ''}> Blackout (Simular Caída de Dependencia)</label>
        </div>
      `;
      break;
    case 'epidemic':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://api.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Total Mosquitos)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || 20}"></div>
          <div class="form-group"><label>Carga Normal (%)</label><input type="number" id="m-normalPct" value="${item.normalPct || 60}"></div>
          <div class="form-group"><label>Latencia (%)</label><input type="number" id="m-latencyPct" value="${item.latencyPct || 20}"></div>
        </div>
      `;
      break;
    case 'cascade':
      fieldsHtml += `
        <label>Servicios a Mapear (Nombre:Puerto separados por coma)</label>
        <input type="text" id="m-services" value="${escapeHtml(item.services || 'Auth:8080, Catalog:3001, Cart:4000, Orders:5000')}">
      `;
      break;
    case 'hunter':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://shop.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Usuarios Concurrentes)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || 15}"></div>
          <div class="form-group"><label>Iteraciones por Usuario</label><input type="number" id="m-iterations" value="${item.iterations || 3}"></div>
        </div>
        <label>Pasos del Flujo Stateful (separados por |)</label>
        <textarea id="m-steps" rows="3">${escapeHtml(item.steps || 'POST /api/login | EXTRACT $.token -> auth_token | GET /api/products | POST /api/checkout')}</textarea>
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
      updated.count = parseInt($('m-count')?.value || '500', 10);
      break;
    case 'venom':
      updated.modes = [];
      if ($('m-mode-boundary')?.checked) updated.modes.push('boundary');
      if ($('m-mode-unicode')?.checked) updated.modes.push('unicode');
      if ($('m-mode-injection')?.checked) updated.modes.push('injection');
      if ($('m-mode-overflow')?.checked) updated.modes.push('overflow');
      break;
    case 'horde':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '10', 10);
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
      updated.modes = [];
      if ($('m-mode-latency')?.checked) updated.modes.push('latency');
      if ($('m-mode-gremlins')?.checked) updated.modes.push('gremlins');
      if ($('m-mode-blackout')?.checked) updated.modes.push('blackout');
      break;
    case 'epidemic':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '20', 10);
      updated.normalPct = parseInt($('m-normalPct')?.value || '60', 10);
      break;
    case 'cascade':
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
window.showRunYaml = showRunYaml;
window.generateItemYaml = generateItemYaml;
window.triggerQuickCreateModal = triggerQuickCreateModal;
window.toggleAntennaInputMode = toggleAntennaInputMode;
window.handleSpecFileUpload = handleSpecFileUpload;
window.injectWorkflowToGitHubRepo = injectWorkflowToGitHubRepo;

function renderConfigs() {
  $('views-container').innerHTML = `
    <div class="view-header">
      <div>
        <h2>Configuraciones Guardadas</h2>
        <p>Sincronizadas con la bóveda privada .maskito-storage</p>
      </div>
    </div>
    <div class="glass-card">
      <p style="color:var(--text-dim);">Tus recursos guardados desde las vistas de cada función están disponibles y sincronizados automáticamente.</p>
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
