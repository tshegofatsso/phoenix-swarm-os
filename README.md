# Phoenix Swarm‑OS

**Autonomous multi‑agent SaaS factory** — hardened, production-ready, fully containerized.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│                   Dashboard → WebSocket → API                     │
└─────────────────────────────────────────────────────────────────┘
                                  ↕
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI/Python)                      │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────────┐ │
│  │ Auth     │  │ Orchestra │  │ EventBus │  │ ModeController │ │
│  │ (Bearer) │  │ (dispatch)│  │ (pub/sub)│  │ (MANUAL/AUTO)  │ │
│  └──────────┘  └───────────┘  └──────────┘  └───────────────┘ │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌───────────────┐ │
│  │ Health   │  │ Logger   │  │Command   │  │ Scheduler    │ │
│  │ /health  │  │(struct.) │  │ Router   │  │ (async tasks) │ │
│  └──────────┘  └───────────┘  └──────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  ↕
┌─────────────────────────────────────────────────────────────────┐
│                   Swarm Agents (5 agents)                        │
│  tjotjo │ bra_killer │ uncle_vusi │ auntie_cashflow │ og_mkhulu │
└─────────────────────────────────────────────────────────────────┘
                                  ↕
┌─────────────────────────────────────────────────────────────────┐
│  Redis (pub/sub)        │        PostgreSQL (future: persistence)│
└─────────────────────────────────────────────────────────────────┘
```

## 🕹️ Modes

| Mode | Behavior |
|------|----------|
| `MANUAL` | All swarm actions require explicit user command |
| `AUTONOMOUS` | System executes full pipeline without confirmation |

Toggle via: `POST /command` → `{ "action": "set_mode", "mode": "AUTONOMOUS" }`

## 🔐 Security

See [SECURITY.md](./SECURITY.md) — covers authentication, threat model, and hardening.

**Quick auth:** All requests require `Authorization: Bearer <AUTH_TOKEN>`

## 🚀 Quick Start

```bash
cd infra
cp env.example .env
# Edit .env and set AUTH_TOKEN=<your-secret-token>

docker-compose up --build
```

- Dashboard: http://localhost:3000
- API: http://localhost:8000/command
- Health: http://localhost:8000/health

## 📁 Project Structure

```
phoenix-swarm-os/
├── backend/
│   ├── app/
│   │   ├── core/          # Auth, EventBus, Orchestrator, ModeController
│   │   ├── agents/        # 5 swarm agents (Tjotjo, BraKiller, etc.)
│   │   ├── runtime/       # SwarmEngine, TaskQueue, Scheduler
│   │   └── ws/            # WebSocket manager
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── dashboard/     # Dashboard page + components
│   │   ├── layout.tsx
│   │   └── page.tsx       # Landing redirect to /dashboard
│   ├── lib/
│   │   ├── api.ts         # REST client (postCommand)
│   │   └── websocket.ts  # WS client (SwarmSocket singleton)
│   ├── package.json
│   ├── next.config.js
│   └── Dockerfile
├── infra/
│   ├── docker-compose.yml
│   ├── env.example
│   └── redis.conf
├── docs/
│   ├── architecture.md
│   ├── agent_spec.md
│   └── autonomy_model.md
├── README.md
├── SECURITY.md
└── .gitignore
```

## 📡 API

### POST /command

```bash
curl -X POST http://localhost:8000/command \
  -H "Authorization: Bearer <AUTH_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"action": "dispatch", "agent": "tjotjo", "prompt": "Build a CRM"}'
```

**Actions:**

| Action | Parameters | Description |
|--------|-------------|-------------|
| `dispatch` | `agent`, `prompt` | Run agent with prompt |
| `set_mode` | `mode` | Switch MANUAL/AUTONOMOUS |
| `status` | — | Get swarm status |
| `event_subscribe` | — | Subscribe to events (WS) |

**Response:**
```json
{
  "status": "ok",
  "events": ["agent:dispatched", "agent:completed"],
  "result": {...}
}
```

## 🔌 WebSocket (Real‑Time Events)

Connect to: `ws://localhost:8000/ws`

Events broadcast:
- `agent:dispatched` — agent started
- `agent:completed` — agent finished
- `mode:changed` — mode switch
- `error:auth_failed` — auth failure

## 👥 Agents

| Agent | Role | Skills |
|-------|------|--------|
| `tjotjo` | Product Architect | Idea generation, market analysis |
| `bra_killer` | Competitor Analyst | Feature comparison, gap analysis |
| `uncle_vusi` | Backend Engineer | API design, database, scaling |
| `auntie_cashflow` | Revenue Strategist | Monetization, pricing, growth |
| `og_mkhulu` | Integration Lead | Third-party APIs, webhooks, infra |

## 🧪 Development

```bash
# Backend only
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload

# Frontend only
cd frontend && npm install && npm run dev

# Full stack
cd infra && docker-compose up
```

## 📜 Documentation

- [Architecture](./docs/architecture.md) — system design
- [Agent Spec](./docs/agent_spec.md) — agent capabilities
- [Autonomy Model](./docs/autonomy_model.md) — mode behavior
- [Security](./SECURITY.md) — hardening details

## 📦 Future Work

- [ ] PostgreSQL persistence layer
- [ ] LLM integration for agents
- [ ] Rate limiting middleware
- [ ] Token refresh rotation
- [ ] Admin UI for token management
- [ ] k8s deployment manifests
- [ ] Full E2E test suite

---

**License:** MIT