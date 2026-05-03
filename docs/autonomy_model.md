# Autonomy Model

## Modes

Phoenix Swarm‑OS operates in two mutually exclusive modes:

| Mode | Trigger | Behavior |
|------|---------|----------|
| `MANUAL` | Default | Every agent dispatch requires explicit user approval |
| `AUTONOMOUS` | User command | Full pipeline executes without confirmation prompts |

---

## 🔐 Mode Security Considerations

### MANUAL (Default)

- User retains full control
- Each `dispatch` action returns a confirmation payload
- Orchestrator blocks execution until user responds with `confirm: true`
- **Safe by default** — accidental API exposure does not trigger agents

### AUTONOMOUS

- System executes the entire pipeline end‑to‑end without pausing
- **Warning:** Only enable when:
  - `AUTH_TOKEN` is securely stored and not exposed to untrusted networks
  - Agent code has been audited
  - Rate limiting is in place
- Toggle with: `POST /command` → `{"action": "set_mode", "mode": "AUTONOMOUS"}`
- In AUTONOMOUS mode, all events are still logged and broadcast via WS

---

## State Machine

```
         [startup]
              ↓
         MANUAL ←→ AUTONOMOUS
              ↑          ↑
    set_mode     set_mode
    (user cmd)   (user cmd)
```

State is in‑memory (per‑process). On restart → MANUAL. For multi‑instance: store state in Redis.

---

## Command Flow

### MANUAL

```
User → POST /command {action: "dispatch", agent: "tjotjo", prompt: "..."}
     ← {status: "pending_confirmation", action_id: "abc123"}

User → POST /command {action: "confirm", action_id: "abc123"}
     ← {status: "ok", events: [...], result: {...}}
```

### AUTONOMOUS

```
User → POST /command {action: "set_mode", mode: "AUTONOMOUS"}
     ← {status: "ok", mode: "AUTONOMOUS", events: ["mode:changed"]}

User → POST /command {action: "dispatch", agent: "tjotjo", prompt: "..."}
     ← {status: "ok", events: [...], result: {...}}
     (no confirmation step)
```

---

## Mode‑Sensitive Event Blocking

| Event | MANUAL | AUTONOMOUS |
|-------|--------|------------|
| `agent:dispatched` | Emitted on confirm | Emitted immediately |
| `agent:completed` | Emitted after confirm | Emitted immediately |
| `mode:changed` | Always emitted | Always emitted |
| `error:auth_failed` | Always emitted | Always emitted |

---

## Inter‑Mode Transitions

Transitions are logged with:
- `mode:changing` event (before)
- `mode:changed` event (after)
- Old mode, new mode, trigger (user/system)
- Actor IP (from WS connection metadata)

---

## Audit Trail

All mode transitions are written to structured logs:

```json
{
  "event": "mode:changed",
  "from": "MANUAL",
  "to": "AUTONOMOUS",
  "trigger": "user",
  "timestamp": "2024-01-01T00:00:00Z",
  "ip": "192.168.1.1"
}
```

Retrieve with: `docker-compose logs backend | grep '"mode:changed"'`