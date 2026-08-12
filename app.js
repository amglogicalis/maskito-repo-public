// MASKITO Console App
// Vanilla JS SPA - Premium Dashboard

const state = {
  token: null,
  user: null,
  currentView: 'dashboard'
};

// ─── UTILS ──────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const show = el => el && el.classList.remove('hidden');
const hide = el => el && el.classList.add('hidden');

// YAML Generators (Simplified versions of the SDK generators for client-side)
const Generators = {
  horde: (cfg) => `name: "Maskito Horde: ${cfg.name}"
on: workflow_dispatch
jobs:
  swarm-controller:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Dispatching ${cfg.swarmSize} mosquitos to ${cfg.targetUrl}"
  mosquito:
    needs: swarm-controller
    strategy:
      matrix:
        index: [${Array.from({length: cfg.swarmSize}, (_,i) => i).join(',')}]
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Running Horde against ${cfg.targetUrl} for ${cfg.duration} at ${cfg.rate}"
          # k6 run ...
`,
  siege: (cfg) => `name: "Maskito Siege: ${cfg.name}"
on: workflow_dispatch
jobs:
  siege-relay:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running Siege against ${cfg.targetUrl} (Duration: ${cfg.totalHours}h, Relay: ${cfg.relayHours}h)"
      - name: Trigger Next Relay
        run: echo "gh workflow run siege.yml"
`,
  colony: (cfg) => `name: "Maskito Colony: ${cfg.name}"
on: workflow_dispatch
jobs:
  mosquito:
    strategy:
      matrix:
        index: [${Array.from({length: cfg.swarmSize}, (_,i) => i).join(',')}]
    runs-on: ubuntu-latest
    steps:
      - name: Geo IP
        run: curl -s https://ipinfo.io/region
      - run: echo "Hitting ${cfg.targetUrl}"
`,
  phantom: (cfg) => `name: "Maskito Phantom: ${cfg.name}"
on: workflow_dispatch
jobs:
  mosquito:
    strategy:
      matrix:
        index: [${Array.from({length: cfg.concurrency}, (_,i) => i).join(',')}]
    runs-on: ubuntu-latest
    steps:
      - name: Run Playwright
        run: npx playwright test
`,
  echo: (cfg) => `name: "Maskito Echo: ${cfg.name}"
on: workflow_dispatch
jobs:
  echo:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Replaying log ${cfg.logPath} to ${cfg.targetUrl} at ${cfg.speed}x"
`,
  toxin: (cfg) => `name: "Maskito Toxin: ${cfg.name}"
on: workflow_dispatch
jobs:
  toxin:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Injecting Chaos: ${cfg.modes.join(', ')} against ${cfg.targetUrl}"
`,
  epidemic: (cfg) => `name: "Maskito Epidemic: ${cfg.name}"
on: workflow_dispatch
jobs:
  mosquito:
    strategy:
      matrix:
        index: [${Array.from({length: cfg.swarmSize}, (_,i) => i).join(',')}]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Role based on composition (Normal: ${cfg.normal}%, Chaos: ${cfg.chaos}%)"
`,
  cascade: (cfg) => `name: "Maskito Cascade: ${cfg.name}"
on: workflow_dispatch
jobs:
  cascade:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Mapping Cascade Failure for ${cfg.services}"
`,
  hunter: (cfg) => `name: "Maskito Hunter: ${cfg.name}"
on: workflow_dispatch
jobs:
  hunter:
    strategy:
      matrix:
        index: [1, 2, 3]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running stateful journey on ${cfg.targetUrl}"
`
};

// ─── VIEWS DEFINITION ───────────────────────────────────────────────────────
const views = {
  dashboard: `
    <div class="glass-card">
      <h2>Welcome to Maskito</h2>
      <p>The Swarm Strikes. Zero Cost. Maximum Pressure.</p>
    </div>
    <div class="stats-grid">
      <div class="glass-card stat-card"><h3>Active Soaks</h3><div class="stat-value">2</div></div>
      <div class="glass-card stat-card"><h3>Runs Today</h3><div class="stat-value">14</div></div>
      <div class="glass-card stat-card"><h3>Total Requests</h3><div class="stat-value">1.2M</div></div>
    </div>
  `,
  antenna: `
    <div class="glass-card">
      <h2>Antenna</h2>
      <p>Parse OpenAPI specs into Maskito seed templates.</p>
      <label>OpenAPI Spec URL or Path</label>
      <input type="text" id="antenna-spec" placeholder="https://api.example.com/swagger.json">
      <label>Output Path</label>
      <input type="text" id="antenna-output" placeholder="maskito-seed.yaml" value="maskito-seed.yaml">
      <button class="btn btn-primary btn-lg" onclick="generateAntenna()">Generate Template</button>
    </div>
  `,
  larva: `
    <div class="glass-card">
      <h2>Larva Forge</h2>
      <p>Generate statistically coherent datasets.</p>
      <label>Config Path (maskito-seed.yaml)</label>
      <input type="text" id="larva-config" placeholder="maskito-seed.yaml">
      <label>Output Format</label>
      <select id="larva-format">
        <option value="sql">SQL Inserts</option>
        <option value="json">JSON Array</option>
        <option value="csv">CSV</option>
        <option value="rest">REST cURL commands</option>
      </select>
      <button class="btn btn-primary btn-lg">Generate Dataset</button>
    </div>
  `,
  venom: `
    <div class="glass-card">
      <h2>Venom Seed</h2>
      <p>Generate adversarial payloads.</p>
      <label>Config Path (maskito-seed.yaml)</label>
      <input type="text" id="venom-config" placeholder="maskito-seed.yaml">
      <label>Modes</label>
      <div>
        <label><input type="checkbox" checked> Boundary Values</label>
        <label><input type="checkbox" checked> Unicode Edge Cases</label>
        <label><input type="checkbox" checked> Injection (SQL/XSS)</label>
      </div>
      <button class="btn btn-primary btn-lg">Generate Payloads</button>
    </div>
  `,
  horde: `
    <div class="glass-card">
      <h2>Horde</h2>
      <p>Distributed Load Test.</p>
      <label>Test Name</label>
      <input type="text" id="horde-name" value="Primary API Load">
      <label>Target URL</label>
      <input type="text" id="horde-target" value="https://api.example.com">
      <div class="form-row">
        <div class="form-group"><label>Swarm Size</label><input type="number" id="horde-size" value="5"></div>
        <div class="form-group"><label>Duration</label><input type="text" id="horde-duration" value="5m"></div>
        <div class="form-group"><label>Rate (req/s)</label><input type="text" id="horde-rate" value="100rps"></div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="showYaml('horde', {name: $('horde-name').value, targetUrl: $('horde-target').value, swarmSize: $('horde-size').value, duration: $('horde-duration').value, rate: $('horde-rate').value})">Generate Workflow YAML</button>
    </div>
  `,
  siege: `
    <div class="glass-card">
      <h2>Siege</h2>
      <p>Soak/Endurance Test via Relay.</p>
      <label>Test Name</label>
      <input type="text" id="siege-name" value="Weekend Soak">
      <label>Target URL</label>
      <input type="text" id="siege-target" value="https://api.example.com">
      <div class="form-row">
        <div class="form-group"><label>Total Duration (Hours)</label><input type="number" id="siege-total" value="48"></div>
        <div class="form-group"><label>Relay Duration (Hours)</label><input type="number" id="siege-relay" value="5"></div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="showYaml('siege', {name: $('siege-name').value, targetUrl: $('siege-target').value, totalHours: $('siege-total').value, relayHours: $('siege-relay').value})">Generate Workflow YAML</button>
    </div>
  `,
  colony: `
    <div class="glass-card">
      <h2>Colony</h2>
      <p>Geographic Distribution Test.</p>
      <label>Test Name</label>
      <input type="text" id="colony-name" value="Global Latency Check">
      <label>Target URL</label>
      <input type="text" id="colony-target" value="https://api.example.com">
      <label>Swarm Size (Regions)</label>
      <input type="number" id="colony-size" value="20">
      <button class="btn btn-primary btn-lg" onclick="showYaml('colony', {name: $('colony-name').value, targetUrl: $('colony-target').value, swarmSize: $('colony-size').value})">Generate Workflow YAML</button>
    </div>
  `,
  phantom: `
    <div class="glass-card">
      <h2>Phantom</h2>
      <p>Playwright Browser Load Test.</p>
      <label>Test Name</label>
      <input type="text" id="phantom-name" value="Frontend Journey">
      <label>Target URL</label>
      <input type="text" id="phantom-target" value="https://app.example.com">
      <label>Concurrency</label>
      <input type="number" id="phantom-conc" value="5">
      <button class="btn btn-primary btn-lg" onclick="showYaml('phantom', {name: $('phantom-name').value, targetUrl: $('phantom-target').value, concurrency: $('phantom-conc').value})">Generate Workflow YAML</button>
    </div>
  `,
  echo: `
    <div class="glass-card">
      <h2>Echo</h2>
      <p>Traffic Replay.</p>
      <label>Test Name</label>
      <input type="text" id="echo-name" value="Prod Replay">
      <label>Target URL</label>
      <input type="text" id="echo-target" value="https://staging.example.com">
      <label>Log Path</label>
      <input type="text" id="echo-log" value="s3://logs/prod.log">
      <label>Speed Multiplier</label>
      <input type="number" id="echo-speed" value="2">
      <button class="btn btn-primary btn-lg" onclick="showYaml('echo', {name: $('echo-name').value, targetUrl: $('echo-target').value, logPath: $('echo-log').value, speed: $('echo-speed').value})">Generate Workflow YAML</button>
    </div>
  `,
  toxin: `
    <div class="glass-card">
      <h2>Toxin</h2>
      <p>Chaos Injection.</p>
      <label>Test Name</label>
      <input type="text" id="toxin-name" value="Random Chaos">
      <label>Target URL</label>
      <input type="text" id="toxin-target" value="https://api.example.com">
      <label>Modes</label>
      <div>
        <label><input type="checkbox" id="toxin-latency" checked> Latency</label>
        <label><input type="checkbox" id="toxin-gremlins"> Gremlins</label>
        <label><input type="checkbox" id="toxin-blackout"> Blackout</label>
      </div>
      <button class="btn btn-primary btn-lg" onclick="showYaml('toxin', {name: $('toxin-name').value, targetUrl: $('toxin-target').value, modes: ['latency']})">Generate Workflow YAML</button>
    </div>
  `,
  epidemic: `
    <div class="glass-card">
      <h2>Epidemic</h2>
      <p>Mixed Chaos Swarm.</p>
      <label>Test Name</label>
      <input type="text" id="epidemic-name" value="Resilience Test">
      <label>Swarm Size</label>
      <input type="number" id="epidemic-size" value="10">
      <div class="form-row">
        <div class="form-group"><label>Normal Load (%)</label><input type="number" id="epi-normal" value="70"></div>
        <div class="form-group"><label>Chaos (%)</label><input type="number" id="epi-chaos" value="30"></div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="showYaml('epidemic', {name: $('epidemic-name').value, swarmSize: $('epidemic-size').value, normal: $('epi-normal').value, chaos: $('epi-chaos').value})">Generate Workflow YAML</button>
    </div>
  `,
  cascade: `
    <div class="glass-card">
      <h2>Cascade</h2>
      <p>Failure Mapping.</p>
      <label>Test Name</label>
      <input type="text" id="cascade-name" value="Microservice cascade">
      <label>Services (comma separated)</label>
      <input type="text" id="cascade-services" value="auth, orders, cart">
      <button class="btn btn-primary btn-lg" onclick="showYaml('cascade', {name: $('cascade-name').value, services: $('cascade-services').value})">Generate Workflow YAML</button>
    </div>
  `,
  hunter: `
    <div class="glass-card">
      <h2>Hunter</h2>
      <p>Stateful User Journey.</p>
      <label>Test Name</label>
      <input type="text" id="hunter-name" value="Checkout Flow">
      <label>Target URL</label>
      <input type="text" id="hunter-target" value="https://api.example.com">
      <button class="btn btn-primary btn-lg" onclick="showYaml('hunter', {name: $('hunter-name').value, targetUrl: $('hunter-target').value})">Generate Workflow YAML</button>
    </div>
  `,
  runs: `
    <div class="glass-card">
      <h2>Runs</h2>
      <table>
        <tr><th>Run ID</th><th>Type</th><th>Status</th><th>Date</th></tr>
        <tr><td>run_1234_horde</td><td>Horde</td><td><span style="color:var(--success)">Completed</span></td><td>Just now</td></tr>
        <tr><td>run_1233_siege</td><td>Siege</td><td><span style="color:var(--warning)">Running (Relay 2)</span></td><td>2 hrs ago</td></tr>
      </table>
    </div>
  `,
  configs: `
    <div class="glass-card">
      <h2>Configs</h2>
      <p>Saved configurations.</p>
    </div>
  `,
  settings: `
    <div class="glass-card">
      <h2>Settings</h2>
      <label>Storage Repo</label>
      <input type="text" value=".maskito-storage" disabled>
    </div>
  `
};

// ─── INITIALIZATION ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const storedToken = sessionStorage.getItem('maskito_gh_token');
  if (storedToken) {
    authenticate(storedToken);
  }

  $('btn-connect').addEventListener('click', () => {
    const t = $('token-input').value.trim();
    if (t) authenticate(t);
  });

  $('btn-disconnect').addEventListener('click', () => {
    sessionStorage.removeItem('maskito_gh_token');
    location.reload();
  });

  // Navigation
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      e.target.classList.add('active');
      const view = e.target.getAttribute('data-view');
      renderView(view);
    });
  });

  // Modal handlers
  $('btn-close-modal').addEventListener('click', () => hide($('yaml-modal')));
  $('btn-copy-yaml').addEventListener('click', () => {
    navigator.clipboard.writeText($('yaml-output').innerText);
    alert('Copied to clipboard');
  });
  $('btn-download-yaml').addEventListener('click', () => {
    const a = document.createElement('a');
    const file = new Blob([$('yaml-output').innerText], {type: 'text/yaml'});
    a.href = URL.createObjectURL(file);
    a.download = 'maskito-workflow.yml';
    a.click();
  });
});

async function authenticate(token) {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    if (!res.ok) throw new Error('Invalid token');
    const data = await res.json();
    state.token = token;
    state.user = data.login;
    sessionStorage.setItem('maskito_gh_token', token);
    
    $('user-display').innerText = \`👤 @\${data.login}\`;
    hide($('login-gate'));
    show($('main-console'));
    
    renderView('dashboard');
  } catch (err) {
    alert('Failed to connect. Ensure your token is valid.');
    sessionStorage.removeItem('maskito_gh_token');
  }
}

function renderView(viewName) {
  state.currentView = viewName;
  const html = views[viewName] || '<h2>View not found</h2>';
  $('views-container').innerHTML = html;
}

// Global functions attached to window for inline onclick handlers
window.generateAntenna = function() {
  alert('Antenna generated! Check .maskito-storage/maskito-seed.yaml');
};

window.showYaml = function(type, config) {
  const gen = Generators[type];
  if (gen) {
    const yamlStr = gen(config);
    $('yaml-output').innerText = yamlStr;
    show($('yaml-modal'));
  }
};
