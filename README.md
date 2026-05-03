# GridWars — Real-Time Multiplayer Grid Game

A real-time multiplayer game where players compete to claim tiles on a shared 50×50 grid. Built with the MERN stack and Socket.io.

## Live Demo

Deployed on Render: [https://inboxkit.onrender.com](https://inboxkit.onrender.com)

## Features

- **Real-time tile claiming** — changes broadcast instantly to all connected players via Socket.io
- **Persistent grid** — 50×50 grid (2,500 tiles) stored in MongoDB
- **Leaderboard** — ranked by total tiles claimed
- **Auto color assignment** — each player gets a unique color on join
- **Reconnection handling** — socket reconnects automatically on drop

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| State | Zustand |
| Backend | Node.js, Express, TypeScript |
| Real-time | Socket.io |
| Database | MongoDB (Mongoose) |
| Deploy | Render (monorepo, single service) |

## Project Structure

```
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Grid, Tile, UI components
│   │   ├── hooks/        # useGrid, useSocket
│   │   ├── pages/        # GamePage
│   │   ├── services/     # axios API client, socket service
│   │   ├── store/        # Zustand stores
│   │   └── types/        # Shared TypeScript types
│   └── vite.config.ts    # Builds into ../server/public
│
├── server/               # Express + Socket.io backend
│   ├── src/
│   │   ├── config/       # DB connection, env config
│   │   ├── controllers/  # Grid, user controllers
│   │   ├── models/       # Tile, User Mongoose models
│   │   ├── routes/       # /api/grid, /api/users
│   │   ├── services/     # Grid, user, seed services
│   │   └── sockets/      # Socket.io event handlers
│   └── tsconfig.json
│
└── package.json          # Root scripts for Render deploy
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Local Development

1. Clone the repo:
   ```bash
   git clone https://github.com/saurabh-singh740/inboxkit.git
   cd inboxkit
   ```

2. Start the backend:
   ```bash
   cd server
   cp .env.example .env   # fill in your MONGODB_URI
   npm install
   npm run dev
   ```

3. Start the frontend (new terminal):
   ```bash
   cd client
   cp .env.example .env   # VITE_API_URL=http://localhost:5000
   npm install
   npm run dev
   ```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

### Environment Variables

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/sharedgrid
NODE_ENV=development
```

**client/.env** (dev only — not needed in production)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Deployment (Render)

The frontend is built into `server/public/` and served by Express via a wildcard route — single Render service, single URL.

| Setting | Value |
|---|---|
| Build Command | `npm run build:full` |
| Start Command | `node server/dist/index.js` |
| `MONGODB_URI` | your Atlas URI |

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/grid` | Fetch all 2,500 tiles |
| POST | `/api/grid/claim` | Claim a tile `{ x, y, userId, username, color }` |
| GET | `/api/grid/leaderboard` | Top players by tile count |
| POST | `/api/users` | Get or create user by username |

## Socket Events

| Event | Direction | Payload |
|---|---|---|
| `tile:claimed` | server → clients | Updated tile data |
| `user:joined` | server → clients | User info |
| `user:left` | server → clients | User ID |
