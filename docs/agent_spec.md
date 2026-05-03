# Agent Specifications

## Overview

Phoenix Swarm‑OS ships with five specialized agents. Each agent is a stateless Python class with a `.run(prompt)` method that returns a list of result objects.

---

## 🔐 Agent Security Model

- **Input sanitization** — prompt strings are validated before processing
- **No shell execution** — agent code cannot spawn subprocesses
- **Sandboxed execution** — future: run each agent in an isolated process/container
- **Audit logging** — every `.run()` call is logged with input + output summary

---

## Agent Registry

| Name | File | Role | Skills | Output Schema |
|------|------|------|--------|---------------|
| `tjotjo` | `agents/tjotjo.py` | Product Architect | Idea generation, market analysis | `{title, score}` |
| `bra_killer` | `agents/bra_killer.py` | Competitor Analyst | Feature comparison, gap analysis | `{feature, score}` |
| `uncle_vusi` | `agents/uncle_vusi.py` | Backend Engineer | API design, database, scaling | `{component, spec}` |
| `auntie_cashflow` | `agents/auntie_cashflow.py` | Revenue Strategist | Monetization, pricing, growth | `{model, projection}` |
| `og_mkhulu` | `agents/og_mkhulu.py` | Integration Lead | Third‑party APIs, webhooks, infra | `{integration, complexity}` |

---

## Interface

```python
class Agent:
    def run(self, prompt: str) -> list[dict]:
        """Execute agent logic. Returns list of result objects."""
```

### Result Schema

```json
[
  {
    "type": "<result_type>",
    "title": "<display title>",
    "score": 0.0-1.0,
    "metadata": {}
  }
]
```

---

## Tjotjo — Product Architect

**Responsibility:** Transform raw prompts into viable SaaS product concepts.

**Logic:**
1. Parse prompt for market segment, pain point, delivery model
2. Generate 3 idea variants with scoring
3. Return ranked list

**Stub output:**
```python
[{"title": f"Idea: {prompt}", "score": 0.9, "type": "idea"}]
```

**Production path:** LLM call to OpenAI/Anthropic with product framing system prompt.

---

## Bra Killer — Competitor Analyst

**Responsibility:** Analyze existing solutions, identify gaps, surface differentiation opportunities.

**Logic:**
1. Take product idea from Tjotjo
2. Map 5–10 known competitors
3. Score on feature dimensions
4. Return gap matrix

**Stub output:**
```python
[{"competitor": "...", "feature_gap": "...", "score": 0.7}]
```

**Production path:** Web scraping + LLM summarization.

---

## Uncle Vusi — Backend Engineer

**Responsibility:** Generate backend architecture, API specs, and data models.

**Logic:**
1. Take feature requirements
2. Design REST/GraphQL API surface
3. Define database schema (PostgreSQL/SQLite)
4. Output OpenAPI spec + migration scripts

**Stub output:**
```python
[{"component": "AuthAPI", "spec": "...", "technology": "FastAPI"}]
```

**Production path:** LLM with architecture system prompt + code generation.

---

## Auntie Cashflow — Revenue Strategist

**Responsibility:** Define and project monetization for the product concept.

**Logic:**
1. Take product concept
2. Evaluate 5 pricing models (subscription, usage, hybrid, etc.)
3. Project 12‑month revenue under 3 scenarios
4. Recommend pricing + packaging

**Stub output:**
```python
[{"model": "tiered_subscription", "monthly_revenue_12m": 15000}]
```

**Production path:** Financial modeling LLM + market benchmarks.

---

## Og Mkhulu — Integration Lead

**Responsibility:** Identify third‑party integrations and design integration architecture.

**Logic:**
1. Parse feature requirements
2. Map to relevant APIs (Stripe, Twilio, OpenAI, etc.)
3. Score integration complexity
4. Design webhook + event handling patterns

**Stub output:**
```python
[{"integration": "stripe", "complexity": "medium", "events": ["payment.succeeded"]}]
```

**Production path:** LLM with integration catalog RAG.

---

## Event Emissions

Each agent emits events to the EventBus:

```
agent:dispatched  {agent, prompt, timestamp}
agent:completed   {agent, results, duration_ms, timestamp}
agent:error       {agent, error, timestamp}
```

Events are broadcast to all WebSocket subscribers in real time.

---

## Adding a New Agent

1. Create `app/agents/<new_agent>.py`:
   ```python
   import logging
   logger = logging.getLogger(__name__)

   class NewAgent:
       def run(self, prompt: str) -> list:
           logger.info(f"NewAgent running: {prompt}")
           return [{"type": "result", "value": "..."}]
   ```

2. Register in `app/runtime/swarm_engine.py` → `AGENTS` dict

3. (Optional) Add event types in `docs/event_catalog.md`