<div align="center">
  <img src="assets/logo_maskito.png" alt="Maskito Logo" width="180" />
  <h1>MASKITO</h1>
  <p><strong>The Swarm Strikes. Zero Cost. Maximum Pressure.</strong></p>
  <p>
    <img src="https://img.shields.io/npm/v/terra-maskito?color=%23bf051c&label=npm&logo=npm" alt="npm">
    <img src="https://img.shields.io/badge/license-MIT-bf051c" alt="MIT License">
    <img src="https://img.shields.io/badge/Terra-Ecosystem-bf051c" alt="Terra">
    <img src="https://img.shields.io/badge/cost-%240-green" alt="$0 Cost">
    <img src="https://img.shields.io/badge/GitHub%20Actions-Native-24292e?logo=github" alt="GitHub Actions">
  </p>
  <p><em>Massive stress testing &amp; synthetic data seeding. 100% GitHub-native. $0.</em></p>
</div>

---

## What is Maskito?

Maskito is a **$0 cost, GitHub-native** stress testing and synthetic data seeding engine. No cloud infrastructure needed. No monthly subscriptions. Just GitHub Actions, a PAT, and a private `.maskito-storage` repository.

A mosquito is annoying. A **swarm of mosquitoes** is devastating. That's exactly what Maskito does to your infrastructure — in a controlled, measurable, and completely free way.

---

## 🧬 BREED — Synthetic Data Seeding

| Test | Description |
|:-----|:-----------|
| 🦟 **Antenna** | Reads your OpenAPI/Swagger spec and generates a `maskito-seed.yaml` config automatically |
| 🦟 **Larva Forge** | Generates statistically coherent datasets with real distributions (Gaussian, Poisson, temporal) and relational consistency |
| 🦟 **Venom Seed** | Generates adversarial payloads — schema-guided fuzzing at boundary values, unicode edge cases, and injection patterns |

## 🌊 HORDE — Load Testing

| Test | Description |
|:-----|:-----------|
| 🦟 **Horde** | Distributed load test across N parallel GitHub Actions — more mosquitos, more pressure |
| 🦟 **Siege** | Endurance/soak test lasting **days** via the Relay mechanism — each Action self-triggers the next before expiring |
| 🦟 **Colony** | Simultaneous test from multiple GitHub runner locations — auto-detects and reports actual region per mosquito |
| 🦟 **Phantom** | Playwright headless browser load test — finds frontend bugs that HTTP tests miss |
| 🦟 **Echo** | Replay production traffic patterns against staging — the most realistic test possible |

## 💥 CHAOS — Chaos Engineering

| Test | Description |
|:-----|:-----------|
| 🦟 **Toxin** | Inject latency, malformed requests (Gremlins), dependency blackouts, or bandwidth throttling |
| 🦟 **Epidemic** | The most realistic attack profile: configurable % of swarm doing normal load, latency injection, adversarial data, and blackouts — simultaneously |
| 🦟 **Cascade** | Automatically maps failure propagation across your microservices — what SRE teams spend weeks building manually |

## 🎯 HUNTER — Advanced Scenarios

| Test | Description |
|:-----|:-----------|
| 🦟 **Hunter** | Stateful user journey testing — each mosquito simulates a complete real user (login → browse → cart → checkout → logout) with session state maintained across all steps |

---

## ✨ Swarm Engine

Every test suite is powered by the **Swarm Engine** — a configurable number of GitHub Actions running in parallel. More mosquitos = more load, more geographic diversity, harder to rate-limit.

```yaml
swarm:
  size: 20    # 20 parallel Actions attacking simultaneously
```

## ⏱️ Relay Engine (Siege)

Soak tests that last **hours or days** — free. Each Action saves state and self-triggers the next relay before the 6-hour GitHub limit. Zero external dependencies.

```yaml
siege:
  duration_hours: 48    # 48h total soak
  relay_hours: 5.5      # auto-calculated relay schedule
  load_rps: 50
```

---

## Quick Start

### Install

```bash
npm install -g terra-maskito
```

### Initialize

```bash
export GITHUB_TOKEN=ghp_yourtoken
maskito init
```

### Generate a load test

```bash
# Create config
cat > horde-config.json << 'EOF'
{
  "name": "My API Load Test",
  "target": { "url": "https://my-api.com" },
  "scenarios": [
    { "name": "homepage", "endpoint": "/", "method": "GET" }
  ],
  "duration": "10m",
  "swarm": { "size": 10 }
}
EOF

# Generate GitHub Actions workflow
maskito horde run --config horde-config.json --output .github/workflows/
# Commit and trigger from GitHub Actions → 10 mosquitos swarm your API
```

### Generate synthetic data

```bash
# Parse your OpenAPI spec
maskito breed antenna --spec openapi.json --output maskito-seed.yaml

# Generate 10,000 coherent records
maskito breed larva --config maskito-seed.yaml --format sql --output seed.sql
```

### Launch local console

```bash
maskito console --port 7410
# → http://localhost:7410
```

---

## SDK Usage

```typescript
import { Maskito } from 'terra-maskito';

const maskito = new Maskito({ githubToken: process.env.GITHUB_TOKEN! });
await maskito.init();

// Generate a Hunter (stateful journey) workflow
const yaml = maskito.generateHunterWorkflow({
  name: 'E-commerce User Journey',
  target: { url: 'https://my-shop.com' },
  journey: [
    { name: 'Login',        action: 'request',  endpoint: '/api/auth/login', method: 'POST', body: { email: 'user@test.com', password: 'pass' } },
    { name: 'Save Token',   action: 'extract',  extract_from: 'body', extract_path: '$.token', save_as: 'auth_token' },
    { name: 'Browse',       action: 'request',  endpoint: '/api/products', method: 'GET' },
    { name: 'Add to Cart',  action: 'request',  endpoint: '/api/cart', method: 'POST', body: { product_id: 1, qty: 2 } },
    { name: 'Checkout',     action: 'request',  endpoint: '/api/checkout', method: 'POST' },
    { name: 'Assert Order', action: 'assert',   assert_status: 200 },
  ],
  swarm: { size: 25 },  // 25 concurrent user journeys
});

// Write to file
writeFileSync('.github/workflows/maskito-hunter.yml', yaml);
```

---

## Config Examples

### Siege (48h soak test)
```json
{
  "name": "Weekend Soak Test",
  "target": { "url": "https://my-api.com" },
  "scenarios": [{ "name": "health", "endpoint": "/health", "method": "GET" }],
  "duration_hours": 48,
  "relay_hours": 5.5,
  "load_rps": 100
}
```

### Epidemic (chaos swarm)
```json
{
  "name": "Black Friday Simulation",
  "target": { "url": "https://my-shop.com" },
  "swarm_size": 50,
  "composition": {
    "normal_load": 60,
    "latency_inject": 20,
    "venom_data": 10,
    "blackout": 10
  },
  "duration": "30m"
}
```

### Larva Forge (synthetic users)
```yaml
# maskito-seed.yaml
entities:
  User:
    count: 10000
    fields:
      - name: id
        type: uuid
      - name: email
        type: email
      - name: plan
        type: enum
        distribution:
          type: enum
          values: { premium: 20, free: 80 }
      - name: age
        type: number
        distribution:
          type: gaussian
          mean: 32
          std: 8
          min: 18
          max: 70
  Order:
    count: 50000
    fields:
      - name: id
        type: uuid
      - name: user_id
        type: uuid
        foreign_key: User.id
      - name: total
        type: number
        distribution:
          type: poisson
          lambda: 85
      - name: created_at
        type: date
        distribution:
          type: temporal
          pattern: higher_in_december
```

---

## Architecture

```
.maskito-storage (private GitHub repo)
├── maskito-state.json     → all runs, configs, relay states
├── results/               → historical test results
└── seeds/                 → generated datasets

GitHub Actions (the "mosquitos")
├── Swarm Controller       → orchestrates parallel jobs
├── Mosquito #0..N         → each runs the actual test
└── Aggregator             → collects and reports results

Compound Eye (GitHub Pages)
└── Visual dashboard, metrics, run history
```

---

## Part of the Terra Ecosystem

Maskito is part of **Terra** — a suite of $0 GitHub-native infrastructure tools.

| App | Description |
|:----|:-----------|
| [Formica](https://github.com/amglogicalis/Formica) | Event Mesh, K/V Cache, Telemetry, WAF |
| [Waisp](https://github.com/amglogicalis/Waisp) | Secrets Vault & Config Management |
| [Grillout](https://github.com/amglogicalis/Grillout) | Async Queues & Notifications |
| **Maskito** | Stress Testing & Synthetic Data |

---

<div align="center">
  <sub>Built with ❤️ by AMG Logicalis — Terra Ecosystem</sub><br>
  <sub>MIT License — $0 Cost — GitHub Native</sub>
</div>
