import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
  CLIENT_ORIGIN: string;
  NODE_ENV: string;
  isDev: boolean;
  isProd: boolean;
}

export const env: EnvConfig = {
  PORT: parseInt(process.env.PORT ?? '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/sharedgrid',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  get isDev() { return this.NODE_ENV === 'development'; },
  get isProd() { return this.NODE_ENV === 'production'; },
};
