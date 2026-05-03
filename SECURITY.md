# Security Policy

## 🔐 Authentication

All API requests must include a Bearer token:

```
Authorization: Bearer <AUTH_TOKEN>
```

**Environment variable:** `AUTH_TOKEN` (required)

- Generate a strong token: `openssl rand -hex 32`
- Never commit `.env` files — use `env.example` as a template
- Rotate tokens regularly and immediately if compromised

## 🚨 Token Exposure Response

If your token is exposed:
1. **Rotate immediately** — set new `AUTH_TOKEN` in environment
2. **Review logs** — check `/health` and API endpoints for unauthorized usage
3. **Revoke old tokens** — if using short-lived token patterns

## 🔒 Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'self'`

## 🛡️ Threat Model

| Threat | Mitigation |
|--------|------------|
| Token brute-force | Strong token + rate limiting (infrastructure-level) |
| WebSocket hijacking | Token validation on every WS connection |
| Code injection in agents | Input sanitization, sandboxed execution (future) |
| Log injection | Structured logging, no raw user input in logs |
| Unauthorized config changes | Read-only env vars at runtime |

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_TOKEN` | Yes | Bearer token for all API requests |
| `LOG_LEVEL` | No | Log verbosity (DEBUG/INFO/WARNING/ERROR). Default: INFO |
| `REDIS_URL` | No | Redis connection string. Default: `redis://redis:6379` |

## 📡 WebSocket Security

WebSocket connections authenticate via the HTTP upgrade handshake using the Bearer token in the initial request headers. If the token is invalid, the connection is rejected before upgrade completes.

## 🔍 Logging & Monitoring

All security events are logged:
- Authentication failures (IP, timestamp)
- WebSocket connection attempts
- Command dispatch events
- Mode switches (MANUAL ↔ AUTONOMOUS)

Monitor logs via: `docker-compose logs -f backend`

## 📦 Dependency Security

```bash
# Python
pip audit -r backend/requirements.txt

# Node
npm audit --prefix frontend
```

## 🚢 Container Security

- Run as non-root user in containers
- Read-only filesystem where possible
- No secrets baked into images — use env vars or secrets management
- Regular base image updates (`docker pull python:3.11-slim`)

## 📄 Reporting Vulnerabilities

For security issues, contact via GitHub Issues (private) or email directly.