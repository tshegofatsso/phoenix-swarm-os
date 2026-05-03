# Architecture

## Overview

Phoenix Swarm‑OS is a multi‑agent autonomous SaaS generation system built on an event‑driven, service‑oriented architecture with real‑time WebSocket telemetry.

---

## 🔐 Security Architecture

### Authentication Layer

Every API request is gated by Bearer token validation in `app/core/auth.py`:

```
Client → HTTP Header: "Authorization: Bearer <AUTH_TOKEN>"
       → auth.py: require_token() → 401 or pass
       → Handler
```

**Hardened behavior:**
- Invalid/missing token → `401 Unauthorized` before any handler runs
- Token compared using constant‑time comparison (no timing leaks)
- Auth failures logged with client IP and timestamp

### WebSocket Security

WS connections authenticate during HTTP upgrade handshake:
```
GET /ws → headers contain Authorization → validate → upgrade to WS
```

Connection rejected before upgrade if token invalid — prevents WS hijacking.

### Defense in Depth

| Layer | Mechanism |
|-------|-----------|
| Network | Docker network isolation, no exposed ports except 3000/8000 |
| Transport | HTTPS (reverse proxy — add in production) |
| Application | Token auth on every request |
| Logging | Structured logs, no raw user input |
| Container | Non‑root user, minimal image, no secrets in image |

---

## 🔄 Event‑Driven Core

### EventBus (`app/core/event_bus.py`)

Pub/sub central nervous system:

```
Publisher (Orchestrator) → EventBus.publish(event) → Subscribers (WS clients)
                                         ↓
                              Redis pub/sub (future: cross‑service)
```

Subscribers:
- WebSocketManager (pushes to dashboard)
- Future: Redis bridge (multi‑instance scaling)

### Orchestrator (`app/core/orchestrator.py`)

Command router — maps `action` string to agent dispatch:

```python
dispatch({action: "dispatch", agent: "tjotjo", prompt: "..."})
  → SwarmEngine.run(agent, prompt) → event:published → WS broadcast
```

### ModeController (`app/core/mode_controller.py`)

```
MANUAL  → user must confirm each agent dispatch
AUTONOMOUS → full pipeline runs without prompting
```

Mode stored in memory (per‑instance). In production: Redis for multi‑instance sync.

---

## 🕸️ Agent Pipeline

```
User Command
    ↓
Orchestrator.dispatch()
    ↓
SwarmEngine.run(agent, prompt)
    ↓
EventBus.publish("agent:dispatched")
    ↓
Agent.run(prompt) → [result]
    ↓
EventBus.publish("agent:completed")
    ↓
WS broadcast to all connected dashboards
```

---

## 📁 Core Modules

| Module | File | Responsibility |
|--------|------|----------------|
| Auth | `core/auth.py` | Bearer token validation |
| EventBus | `core/event_bus.py` | Pub/sub broadcasting |
| Orchestrator | `core/orchestrator.py` | Command → action routing |
| ModeController | `core/mode_controller.py` | MANUAL/AUTONOMOUS state |
| Health | `core/health.py` | Liveness/readiness probe |
| Logger | `core/logger.py` | Structured JSON logging |
| SwarmEngine | `runtime/swarm_engine.py` | Agent orchestration |
| WebSocketManager | `ws/websocket_manager.py` | WS client lifecycle |

---

## 🐳 Container Architecture

```
infra/docker-compose.yml
├── backend (FastAPI/uvicorn)  :8000
├── frontend (Next.js)         :3000
└── redis                      :6379
```

All services share a Docker network. Backend and frontend are stateless — scale by adding replicas behind the orchestrator (future).

---

## 🔧 Extension Points

1. **New Agent** → add `app/agents/<name>.py`, implement `.run(prompt)`
2. **New Action** → add handler in `orchestrator.py`
3. **Persistence** → add `asyncpg` + PostgreSQL, replace in‑memory state
4. **Rate Limiting** → add `slowapi` middleware to FastAPI
5. **Token Refresh** → extend `auth.py` with JWT refresh flow