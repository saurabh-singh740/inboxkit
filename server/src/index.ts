import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';

import { connectDB } from './config/db';
import { env } from './config/env';
import { seedGridIfEmpty } from './services/seedService';
import { setupSocketHandlers } from './sockets/socketHandler';
import gridRoutes from './routes/grid';
import userRoutes from './routes/user';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

async function bootstrap(): Promise<void> {
  await connectDB();
  await seedGridIfEmpty();

  const app = express();
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: env.isDev ? /^http:\/\/localhost:\d+$/ : false,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60_000,
    pingInterval: 25_000,
  });

  app.use(cors({
    origin: env.isDev ? /^http:\/\/localhost:\d+$/ : false,
    credentials: true,
  }));
  app.use(express.json({ limit: '10kb' }));

  // ── Routes ─────────────────────────────────────────────────────────────
  app.get('/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() }),
  );
  app.use('/api/grid', gridRoutes);
  app.use('/api/users', userRoutes);

  // ── Serve frontend ─────────────────────────────────────────────────────
  const publicDir = path.join(__dirname, '../public');
  app.use(express.static(publicDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  // ── Error handling ─────────────────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  // ── Socket.io ──────────────────────────────────────────────────────────
  setupSocketHandlers(io);

  // ── Listen ─────────────────────────────────────────────────────────────
  httpServer.listen(env.PORT, () => {
    console.log(`[Server] http://localhost:${env.PORT}  (${env.NODE_ENV})`);
  });

  process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM — shutting down gracefully');
    httpServer.close(() => process.exit(0));
  });
}

bootstrap().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
