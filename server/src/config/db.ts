import mongoose from 'mongoose';
import { env } from './env';

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 5;

export async function connectDB(retriesLeft = MAX_RETRIES): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`[DB] Connected → ${env.MONGODB_URI}`);
  } catch (err) {
    if (retriesLeft > 0) {
      console.warn(
        `[DB] Connection failed — retrying in ${RETRY_DELAY_MS / 1000}s (${retriesLeft} left)`,
      );
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return connectDB(retriesLeft - 1);
    }
    console.error('[DB] Could not connect after all retries. Aborting.');
    throw err;
  }
}

mongoose.connection.on('disconnected', () =>
  console.warn('[DB] Disconnected from MongoDB'),
);
mongoose.connection.on('reconnected', () =>
  console.info('[DB] Reconnected to MongoDB'),
);
