// MASKITO Console App
// Vanilla JS SPA — Resource Manager & Dashboard ($0 Cost Engine)

const STORAGE_KEY = 'maskito_resources_v2';

// ─── DEFAULT INITIAL RESOURCES ──────────────────────────────────────────────
const defaultResources = {
  antenna: [
    { id: 'ant_1', name: 'PetStore OpenAPI', specUrl: 'https://petstore.swagger.io/v2/swagger.json', outputPath: 'maskito-seed.yaml', createdAt: new Date().toISOString() }
  ],
  larva: [
    { id: 'larv_1', name: 'Users & Orders Seed', configPath: 'maskito-seed.yaml', format: 'sql', count: 500, databaseUrl: '', createdAt: new Date().toISOString() }
  ],
  venom: [
    { id: 'ven_1', name: 'Auth Venom Payloads', configPath: 'maskito-seed.yaml', modes: ['boundary', 'unicode', 'injection'], outputPath: 'venom-payloads.json', createdAt: new Date().toISOString() }
  ],
  horde: [
    { id: 'hord_1', name: 'Primary API Load Test', targetUrl: 'https://api.example.com', swarmSize: 10, duration: '10m', rate: '100rps', authType: 'bearer', authToken: '${{ secrets.API_TOKEN }}', thresholdP95: 500, thresholdError: 0.05, createdAt: new Date().toISOString() }
  ],
  siege: [
    { id: 'siege_1', name: 'Weekend 48h Soak', targetUrl: 'https://api.example.com', totalHours: 48, relayHours: 5.5, loadRps: 50, swarmSize: 3, createdAt: new Date().toISOString() }
  ],
  colony: [
    { id: 'col_1', name: 'Global Geo Latency Check', targetUrl: 'https://api.example.com', swarmSize: 20, duration: '5m', createdAt: new Date().toISOString() }
  ],
  phantom: [
    { id: 'phan_1', name: 'E-commerce Checkout Browser Journey', targetUrl: 'https://shop.example.com', browser: 'chromium', concurrency: 5, steps: 'goto / | click #buy | wait 1000', createdAt: new Date().toISOString() }
  ],
  echo: [
    { id: 'echo_1', name: 'Prod Nginx Log Replay', targetUrl: 'https://staging.example.com', logPath: 's3://logs/prod-nginx.log', speed: 2, logFormat: 'nginx', createdAt: new Date().toISOString() }
  ],
  toxin: [
    { id: 'tox_1', name: 'Random Chaos Inoculation', targetUrl: 'https://api.example.com', modes: ['latency', 'gremlins'], latencyMs: 500, gremlinsRate: 0.3, blackoutServices: '', createdAt: new Date().toISOString() }
  ],
  epidemic: [
    { id: 'epi_1', name: 'Black Friday Chaos Swarm', targetUrl: 'https://api.example.com', swarmSize: 50, normalPct: 60, latencyPct: 20, venomPct: 10, blackoutPct: 10, duration: '30m', createdAt: new Date().toISOString() }
  ],
  cascade: [
    { id: 'casc_1', name: 'Microservices Failure Mapping', services: 'Auth:8080, Catalog:3001, Cart:4000, Orders:5000', loadRps: 50, killDurationSec: 30, recoveryWaitSec: 15, createdAt: new Date().toISOString() }
  ],
  hunter: [
    { id: 'hunt_1', name: 'Full Purchase User Journey', targetUrl: 'https://shop.example.com', steps: 'POST /api/login | EXTRACT $.token -> auth_token | GET /api/products | POST /api/checkout', swarmSize: 25, iterations: 3, createdAt: new Date().toISOString() }
  ]
};

// ─── STATE MANAGEMENT ─────────────────────────────────────────────────────────
const state = {
  token: null,
  user: null,
  currentView: 'dashboard',
  resources: loadResources(),
  editingItem: null, // { type: 'horde', item: {...} } or null for creation
};

function loadResources() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error('Failed loading resources:', e); }
  return defaultResources;
}

function saveResources() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.resources));
  } catch (e) { console.error('Failed saving resources:', e); }
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

// ─── FUNCTION DEFINITIONS METADATA ───────────────────────────────────────────
const FuncMeta = {
  antenna:  { name: 'Antenna', group: 'breed', groupLabel: '🧬 BREED', desc: 'Schema Reader — Lee OpenAPI/Swagger y genera plantillas YAML' },
  larva:    { name: 'Larva Forge', group: 'breed', groupLabel: '🧬 BREED', desc: 'Synthetic Data Seeding — Genera datasets estadísticamente coherentes (SQL, JSON, CSV)' },
  venom:    { name: 'Venom Seed', group: 'breed', groupLabel: '🧬 BREED', desc: 'Adversarial Data — Genera datos al límite para romper validaciones (boundary, unicode, injection)' },
  
  horde:    { name: 'Horde', group: 'horde', groupLabel: '🌊 HORDE', desc: 'Distributed Load Test — Test de carga masivo distribuido con N Actions en paralelo' },
  siege:    { name: 'Siege', group: 'horde', groupLabel: '🌊 HORDE', desc: 'Soak/Endurance Test — Tests de horas/días con mecanismo Relay auto-reejecutable' },
  colony:   { name: 'Colony', group: 'horde', groupLabel: '🌊 HORDE', desc: 'Geographic Distribution — Tests de latencia distribuida desde múltiples regiones de GitHub' },
  phantom:  { name: 'Phantom', group: 'horde', groupLabel: '🌊 HORDE', desc: 'Browser Load Test — N navegadores Playwright headless reales probando el frontend bajo carga' },
  echo:     { name: 'Echo', group: 'horde', groupLabel: '🌊 HORDE', desc: 'Traffic Replay — Reproduce patrones de tráfico real de logs de producción contra staging' },
  
  toxin:    { name: 'Toxin', group: 'chaos', groupLabel: '💥 CHAOS', desc: 'Chaos Engineering — Inyecta latencia, gremlins, caídas de dependencias o throttling' },
  epidemic: { name: 'Epidemic', group: 'chaos', groupLabel: '💥 CHAOS', desc: 'Chaos Swarm — Enjambre mixto (% tráfico normal + % inyección caos)' },
  cascade:  { name: 'Cascade', group: 'chaos', groupLabel: '💥 CHAOS', desc: 'Cascade Failure Mapping — Mata servicios de forma secuencial y mide la propagación del fallo' },
  
  hunter:   { name: 'Hunter', group: 'hunter', groupLabel: '🎯 HUNTER', desc: 'Stateful User Journey — Simula usuarios reales completos manteniedo cookies y JWTs entre pasos' },
};

// ─── YAML WORKFLOW GENERATORS ─────────────────────────────────────────────────
const Generators = {
  antenna: (cfg) => `# MASKITO — Antenna Spec Reader
# Target Spec: ${cfg.specUrl || 'openapi.json'}

name: "Maskito Antenna: ${cfg.name}"
on: workflow_dispatch
jobs:
  antenna:
    runs-on: ubuntu-latest
    steps:
      - name: Read Schema
        run: echo "Reading OpenAPI spec from ${cfg.specUrl || 'openapi.json'} -> ${cfg.outputPath || 'maskito-seed.yaml'}"
`,
  larva: (cfg) => `# MASKITO — Larva Forge Synthetic Data
# Format: ${cfg.format || 'sql'} | Count: ${cfg.count || 500}

name: "Maskito Larva Forge: ${cfg.name}"
on: workflow_dispatch
jobs:
  forge:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Dataset
        run: echo "Generating ${cfg.count || 500} records in format ${cfg.format || 'sql'} from ${cfg.configPath}"
`,
  venom: (cfg) => `# MASKITO — Venom Seed Adversarial Data
# Modes: ${(cfg.modes || ['boundary']).join(', ')}

name: "Maskito Venom Seed: ${cfg.name}"
on: workflow_dispatch
jobs:
  venom:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Payloads
        run: echo "Generating adversarial payloads for ${cfg.configPath}"
`,
  horde: (cfg) => `# MASKITO — Horde Load Test: ${cfg.name}
# Target: ${cfg.targetUrl} | Swarm: ${cfg.swarmSize} mosquitos | Rate: ${cfg.rate || '100rps'}

name: "Maskito Horde: ${cfg.name}"
on: workflow_dispatch
jobs:
  swarm-controller:
    name: "🦟 Swarm Controller"
    runs-on: ubuntu-latest
    steps:
      - run: echo "🦟 Dispatching ${cfg.swarmSize} mosquitos to ${cfg.targetUrl}"
  mosquito:
    name: "🦟 Mosquito #\${{ matrix.index }}"
    needs: swarm-controller
    strategy:
      matrix:
        index: [${Array.from({length: parseInt(cfg.swarmSize || '5', 10)}, (_,i) => i).join(', ')}]
    runs-on: ubuntu-latest
    steps:
      - name: Detect Region
        run: echo "Mosquito #\${{ matrix.index }} active"
      - name: Run Load Test
        run: echo "Hitting ${cfg.targetUrl} for ${cfg.duration || '5m'} at ${cfg.rate || '100rps'}"
`,
  siege: (cfg) => `# MASKITO — Siege Soak Test: ${cfg.name}
# Duration: ${cfg.totalHours}h | Relay: ${cfg.relayHours}h schedule

name: "Maskito Siege: ${cfg.name}"
on: workflow_dispatch
jobs:
  siege-relay:
    name: "🦟 Siege Relay"
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running Siege against ${cfg.targetUrl} (${cfg.totalHours}h total)"
      - name: Trigger Next Relay
        run: echo "gh workflow run siege.yml"
`,
  colony: (cfg) => `# MASKITO — Colony Geo Test: ${cfg.name}

name: "Maskito Colony: ${cfg.name}"
on: workflow_dispatch
jobs:
  mosquito:
    strategy:
      matrix:
        index: [${Array.from({length: parseInt(cfg.swarmSize || '10', 10)}, (_,i) => i).join(', ')}]
    runs-on: ubuntu-latest
    steps:
      - name: Geo IP Detection
        run: curl -s https://ipinfo.io/country
      - name: Hit Target
        run: curl -s -w "%{time_total}\\n" "${cfg.targetUrl}"
`,
  phantom: (cfg) => `# MASKITO — Phantom Browser Test: ${cfg.name}

name: "Maskito Phantom: ${cfg.name}"
on: workflow_dispatch
jobs:
  browser-mosquito:
    runs-on: ubuntu-latest
    steps:
      - name: Run Playwright
        run: npx playwright test --config=${cfg.browser || 'chromium'}
`,
  echo: (cfg) => `# MASKITO — Echo Traffic Replay: ${cfg.name}

name: "Maskito Echo: ${cfg.name}"
on: workflow_dispatch
jobs:
  replay:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Replaying traffic from ${cfg.logPath} to ${cfg.targetUrl} at ${cfg.speed || 1}x"
`,
  toxin: (cfg) => `# MASKITO — Toxin Chaos Test: ${cfg.name}

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
        index: [${Array.from({length: parseInt(cfg.swarmSize || '10', 10)}, (_,i) => i).join(', ')}]
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
  if (storedToken) {
    authenticate(storedToken);
  }

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
        else showError('Por favor, introduce un Personal Access Token de GitHub.');
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

  // Navigation handlers
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
      alert('Copiado al portapapeles');
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
    });
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
    btnConnect.innerText = 'Conectando bóveda...';
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

  if (viewName === 'dashboard') {
    renderDashboard();
    return;
  }
  if (viewName === 'runs') {
    renderRuns();
    return;
  }
  if (viewName === 'configs') {
    renderConfigs();
    return;
  }
  if (viewName === 'settings') {
    renderSettings();
    return;
  }

  // Render Function Resource Manager View for specific test type
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
        <p>Visión general de recursos y accesos rápidos por función ($0 Cost Engine)</p>
      </div>
      <button class="btn btn-primary" onclick="triggerQuickCreateModal()">+ Nuevo Recurso</button>
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

// ─── RESOURCE MANAGER RENDERER (For each function) ──────────────────────────
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
              <th>Configuración / Target</th>
              <th>Parámetros Clave</th>
              <th>Fecha</th>
              <th style="text-align:right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const item of list) {
      const targetStr = item.targetUrl || item.specUrl || item.configPath || item.services || 'Default Config';
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
              <button class="btn btn-secondary btn-sm" onclick="editResource('${type}', '${item.id}')">✏️ Editar</button>
              <button class="btn btn-primary btn-sm" onclick="generateItemYaml('${type}', '${item.id}')">📜 Ver YAML</button>
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
    case 'antenna':  return `Output: ${item.outputPath || 'maskito-seed.yaml'}`;
    case 'larva':    return `Formato: ${(item.format || 'sql').toUpperCase()} | Registros: ${item.count || 500}`;
    case 'venom':    return `Modos: ${(item.modes || []).join(', ')}`;
    case 'horde':    return `Swarm: ${item.swarmSize} | Duración: ${item.duration} | Rate: ${item.rate}`;
    case 'siege':    return `Total: ${item.totalHours}h | Relay: ${item.relayHours}h | Rate: ${item.loadRps}rps`;
    case 'colony':   return `Regiones/Swarm: ${item.swarmSize} | Duración: ${item.duration || '5m'}`;
    case 'phantom':  return `Navegador: ${item.browser || 'chromium'} | Concurrencia: ${item.concurrency}`;
    case 'echo':     return `Log: ${item.logPath} | Velocidad: ${item.speed || 1}x`;
    case 'toxin':    return `Modos: ${(item.modes || []).join(', ')} | Latencia: ${item.latencyMs || 0}ms`;
    case 'epidemic': return `Swarm: ${item.swarmSize} | Normal: ${item.normalPct || 60}% | Chaos: ${100 - (item.normalPct || 60)}%`;
    case 'cascade':  return `Servicios: ${item.services} | Delay: ${item.recoveryWaitSec || 15}s`;
    case 'hunter':   return `Swarm: ${item.swarmSize} | Iteraciones: ${item.iterations || 1}`;
    default:         return '';
  }
}

// ─── RESOURCE MODAL EDITOR (Creation & Modification) ────────────────────────
function openResourceModal(type, existingItem = null) {
  state.editingItem = existingItem ? { type, item: existingItem } : { type, item: null };
  const meta = FuncMeta[type];
  const item = existingItem || {};

  let fieldsHtml = `
    <label>Nombre del Recurso</label>
    <input type="text" id="m-name" value="${escapeHtml(item.name || meta.name + ' Config')}" placeholder="Nombre descriptivo">
  `;

  switch (type) {
    case 'antenna':
      fieldsHtml += `
        <label>OpenAPI Spec URL o Path local</label>
        <input type="text" id="m-specUrl" value="${escapeHtml(item.specUrl || 'https://petstore.swagger.io/v2/swagger.json')}">
        <label>Output Path (YAML)</label>
        <input type="text" id="m-outputPath" value="${escapeHtml(item.outputPath || 'maskito-seed.yaml')}">
      `;
      break;
    case 'larva':
      fieldsHtml += `
        <label>Config Path (maskito-seed.yaml)</label>
        <input type="text" id="m-configPath" value="${escapeHtml(item.configPath || 'maskito-seed.yaml')}">
        <div class="form-row">
          <div class="form-group">
            <label>Formato de Salida</label>
            <select id="m-format">
              <option value="sql" ${item.format === 'sql' ? 'selected' : ''}>SQL Inserts</option>
              <option value="json" ${item.format === 'json' ? 'selected' : ''}>JSON Array</option>
              <option value="csv" ${item.format === 'csv' ? 'selected' : ''}>CSV</option>
              <option value="rest" ${item.format === 'rest' ? 'selected' : ''}>cURL REST Commands</option>
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
        <label>Config Path (maskito-seed.yaml)</label>
        <input type="text" id="m-configPath" value="${escapeHtml(item.configPath || 'maskito-seed.yaml')}">
        <label>Modos Adversariales Activos</label>
        <div style="margin-top:0.5rem;">
          <label><input type="checkbox" id="m-mode-boundary" ${(item.modes || ['boundary','unicode','injection']).includes('boundary') ? 'checked' : ''}> Boundary Values (0, -1, MAX_INT)</label><br>
          <label><input type="checkbox" id="m-mode-unicode" ${(item.modes || ['boundary','unicode','injection']).includes('unicode') ? 'checked' : ''}> Unicode & Emojis Edge Cases</label><br>
          <label><input type="checkbox" id="m-mode-injection" ${(item.modes || ['boundary','unicode','injection']).includes('injection') ? 'checked' : ''}> SQLi & XSS Injections</label><br>
          <label><input type="checkbox" id="m-mode-overflow" ${(item.modes || []).includes('overflow') ? 'checked' : ''}> Buffer Overflow Strings</label>
        </div>
        <label>Output Path (JSON)</label>
        <input type="text" id="m-outputPath" value="${escapeHtml(item.outputPath || 'venom-payloads.json')}">
      `;
      break;
    case 'horde':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://api.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Actions paralelas)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || 10}"></div>
          <div class="form-group"><label>Duración</label><input type="text" id="m-duration" value="${escapeHtml(item.duration || '10m')}"></div>
          <div class="form-group"><label>Rate (req/s)</label><input type="text" id="m-rate" value="${escapeHtml(item.rate || '100rps')}"></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Tipo de Autenticación</label>
            <select id="m-authType">
              <option value="bearer" ${item.authType === 'bearer' ? 'selected' : ''}>Bearer Token</option>
              <option value="apikey" ${item.authType === 'apikey' ? 'selected' : ''}>API Key Header</option>
              <option value="none" ${item.authType === 'none' ? 'selected' : ''}>Ninguna</option>
            </select>
          </div>
          <div class="form-group"><label>Token / Key</label><input type="text" id="m-authToken" value="${escapeHtml(item.authToken || '${{ secrets.API_TOKEN }}')}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Umbral P95 Máx (ms)</label><input type="number" id="m-thresholdP95" value="${item.thresholdP95 || 500}"></div>
          <div class="form-group"><label>Umbral Error Máx (0-1)</label><input type="number" step="0.01" id="m-thresholdError" value="${item.thresholdError || 0.05}"></div>
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
          <div class="form-group"><label>Swarm Size (Regiones)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || 20}"></div>
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
            <label>Navegador Playwright</label>
            <select id="m-browser">
              <option value="chromium" ${item.browser === 'chromium' ? 'selected' : ''}>Chromium</option>
              <option value="firefox" ${item.browser === 'firefox' ? 'selected' : ''}>Firefox</option>
              <option value="webkit" ${item.browser === 'webkit' ? 'selected' : ''}>WebKit (Safari)</option>
            </select>
          </div>
          <div class="form-group"><label>Concurrencia (Navegadores)</label><input type="number" id="m-concurrency" value="${item.concurrency || 5}"></div>
        </div>
        <label>Pasos del Flujo (Acciones separadas por |)</label>
        <textarea id="m-steps" rows="3" placeholder="goto / | click #buy | wait 1000">${escapeHtml(item.steps || 'goto / | click #login | fill #email user@test.com')}</textarea>
      `;
      break;
    case 'echo':
      fieldsHtml += `
        <label>Target Staging URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://staging.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Path a Logs (S3 / Nginx)</label><input type="text" id="m-logPath" value="${escapeHtml(item.logPath || 's3://logs/prod-nginx.log')}"></div>
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
          <label><input type="checkbox" id="m-mode-latency" ${(item.modes || ['latency']).includes('latency') ? 'checked' : ''}> Inyección Latencia</label><br>
          <label><input type="checkbox" id="m-mode-gremlins" ${(item.modes || []).includes('gremlins') ? 'checked' : ''}> Gremlins (Corrupción Requests)</label><br>
          <label><input type="checkbox" id="m-mode-blackout" ${(item.modes || []).includes('blackout') ? 'checked' : ''}> Blackout (Simular Caída Dependencia)</label>
        </div>
        <div class="form-row" style="margin-top:1rem;">
          <div class="form-group"><label>Latencia Inyectada (ms)</label><input type="number" id="m-latencyMs" value="${item.latencyMs || 500}"></div>
          <div class="form-group"><label>Gremlins Rate (0-1)</label><input type="number" step="0.1" id="m-gremlinsRate" value="${item.gremlinsRate || 0.3}"></div>
        </div>
      `;
      break;
    case 'epidemic':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://api.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Total Actions)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || 50}"></div>
          <div class="form-group"><label>Tráfico Normal (%)</label><input type="number" id="m-normalPct" value="${item.normalPct || 60}"></div>
          <div class="form-group"><label>Latencia (%)</label><input type="number" id="m-latencyPct" value="${item.latencyPct || 20}"></div>
        </div>
      `;
      break;
    case 'cascade':
      fieldsHtml += `
        <label>Servicios del Sistema (Nombre:URL separadas por coma)</label>
        <input type="text" id="m-services" value="${escapeHtml(item.services || 'Auth:8080, Catalog:3001, Cart:4000, Orders:5000')}">
        <div class="form-row">
          <div class="form-group"><label>Carga Base (req/s)</label><input type="number" id="m-loadRps" value="${item.loadRps || 50}"></div>
          <div class="form-group"><label>Espera Recuperación (s)</label><input type="number" id="m-recoveryWaitSec" value="${item.recoveryWaitSec || 15}"></div>
        </div>
      `;
      break;
    case 'hunter':
      fieldsHtml += `
        <label>Target API URL</label>
        <input type="text" id="m-targetUrl" value="${escapeHtml(item.targetUrl || 'https://shop.example.com')}">
        <div class="form-row">
          <div class="form-group"><label>Swarm Size (Usuarios Concurrentes)</label><input type="number" id="m-swarmSize" value="${item.swarmSize || 25}"></div>
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

  // Inject modal into DOM
  let existingOverlay = $('editor-modal-overlay');
  if (existingOverlay) existingOverlay.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
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
    createdAt: item.createdAt || new Date().toISOString()
  };

  // Collect specific fields per type
  switch (type) {
    case 'antenna':
      updated.specUrl = $('m-specUrl')?.value?.trim();
      updated.outputPath = $('m-outputPath')?.value?.trim();
      break;
    case 'larva':
      updated.configPath = $('m-configPath')?.value?.trim();
      updated.format = $('m-format')?.value;
      updated.count = parseInt($('m-count')?.value || '500', 10);
      break;
    case 'venom':
      updated.configPath = $('m-configPath')?.value?.trim();
      updated.modes = [];
      if ($('m-mode-boundary')?.checked) updated.modes.push('boundary');
      if ($('m-mode-unicode')?.checked) updated.modes.push('unicode');
      if ($('m-mode-injection')?.checked) updated.modes.push('injection');
      if ($('m-mode-overflow')?.checked) updated.modes.push('overflow');
      updated.outputPath = $('m-outputPath')?.value?.trim();
      break;
    case 'horde':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '10', 10);
      updated.duration = $('m-duration')?.value?.trim();
      updated.rate = $('m-rate')?.value?.trim();
      updated.authType = $('m-authType')?.value;
      updated.authToken = $('m-authToken')?.value?.trim();
      updated.thresholdP95 = parseInt($('m-thresholdP95')?.value || '500', 10);
      updated.thresholdError = parseFloat($('m-thresholdError')?.value || '0.05');
      break;
    case 'siege':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.totalHours = parseFloat($('m-totalHours')?.value || '48');
      updated.relayHours = parseFloat($('m-relayHours')?.value || '5.5');
      updated.loadRps = parseInt($('m-loadRps')?.value || '50', 10);
      break;
    case 'colony':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '20', 10);
      updated.duration = $('m-duration')?.value?.trim();
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
      updated.latencyMs = parseInt($('m-latencyMs')?.value || '500', 10);
      updated.gremlinsRate = parseFloat($('m-gremlinsRate')?.value || '0.3');
      break;
    case 'epidemic':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '50', 10);
      updated.normalPct = parseInt($('m-normalPct')?.value || '60', 10);
      updated.latencyPct = parseInt($('m-latencyPct')?.value || '20', 10);
      break;
    case 'cascade':
      updated.services = $('m-services')?.value?.trim();
      updated.loadRps = parseInt($('m-loadRps')?.value || '50', 10);
      updated.recoveryWaitSec = parseInt($('m-recoveryWaitSec')?.value || '15', 10);
      break;
    case 'hunter':
      updated.targetUrl = $('m-targetUrl')?.value?.trim();
      updated.swarmSize = parseInt($('m-swarmSize')?.value || '25', 10);
      updated.iterations = parseInt($('m-iterations')?.value || '3', 10);
      updated.steps = $('m-steps')?.value?.trim();
      break;
  }

  if (!state.resources[type]) state.resources[type] = [];

  if (isEdit) {
    const idx = state.resources[type].findIndex(r => r.id === newId);
    if (idx !== -1) state.resources[type][idx] = updated;
  } else {
    state.resources[type].push(updated);
  }

  saveResources();
  closeEditorModal();
  renderView(state.currentView);
}

function editResource(type, id) {
  const item = (state.resources[type] || []).find(r => r.id === id);
  if (item) openResourceModal(type, item);
}

function deleteResource(type, id) {
  if (confirm('¿Seguro que deseas eliminar este recurso?')) {
    state.resources[type] = (state.resources[type] || []).filter(r => r.id !== id);
    saveResources();
    renderView(state.currentView);
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

function triggerQuickCreateModal() {
  const type = prompt('Ingresa el tipo de función a crear (ej: horde, siege, toxin, hunter, larva...):', 'horde');
  if (type && FuncMeta[type]) {
    openResourceModal(type);
  } else if (type) {
    alert('Tipo no reconocido. Opciones: ' + Object.keys(FuncMeta).join(', '));
  }
}

// Global functions attached to window
window.$ = $;
window.renderView = renderView;
window.switchNav = switchNav;
window.openResourceModal = openResourceModal;
window.closeEditorModal = closeEditorModal;
window.saveResourceModalForm = saveResourceModalForm;
window.editResource = editResource;
window.deleteResource = deleteResource;
window.generateItemYaml = generateItemYaml;
window.triggerQuickCreateModal = triggerQuickCreateModal;

// Simple renders for fixed pages
function renderRuns() {
  $('views-container').innerHTML = `
    <div class="view-header">
      <div>
        <h2>Histórico de Ejecuciones (Runs)</h2>
        <p>Resultados almacenados en .maskito-storage</p>
      </div>
    </div>
    <div class="glass-card">
      <table class="resource-table">
        <thead>
          <tr><th>Run ID</th><th>Función</th><th>Estado</th><th>P95 Latencia</th><th>Throughput</th><th>Fecha</th></tr>
        </thead>
        <tbody>
          <tr><td>run_1723456_horde</td><td>Horde</td><td><span style="color:var(--success)">✅ Completed</span></td><td>365ms</td><td>1,240 req/s</td><td>Hoy, 12:40</td></tr>
          <tr><td>run_1723450_siege</td><td>Siege</td><td><span style="color:var(--warning)">⏱️ Running (Relay 2/9)</span></td><td>410ms</td><td>50 req/s</td><td>Hoy, 10:15</td></tr>
          <tr><td>run_1723400_epidemic</td><td>Epidemic</td><td><span style="color:var(--success)">✅ Completed</span></td><td>770ms</td><td>890 req/s</td><td>Ayer</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

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
