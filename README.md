# Duo Detective

A cooperative two-player browser-based crime investigation game. Both players connect in real time, investigate different clues, and must agree on a final accusation to close the case.

---

## Table of Contents

1. [How the app works](#how-the-app-works)
2. [Local development](#local-development)
3. [Deployment](#deployment)

---

## How the app works

- **Frontend + Backend in one process** — `server.mjs` starts both the Next.js app and the Socket.io WebSocket server together on port `3000`.
- **No database** — rooms and game state are held in memory. Restarting the server clears all active sessions.
- **`NEXT_PUBLIC_SOCKET_URL`** — this environment variable tells the browser where to connect the WebSocket. It must be set to your public domain **before** running `npm run build` because Next.js bakes it into the client bundle at build time.

---

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Deployment

For full instructions on deploying to an Ubuntu home server with Cloudflare Tunnel, see [DEPLOYMENT.md](DEPLOYMENT.md).


