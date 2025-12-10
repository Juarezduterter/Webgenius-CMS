import express from 'express';
import dotenv from 'dotenv';
import { getPayload } from 'payload';
import payloadConfig from './payload.config.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is not set');
  }

  const app = express();

  const payload = await getPayload({
    config: payloadConfig,
    onInit: (pl) => {
      pl.logger.info(`Payload Admin URL: ${pl.getAdminURL?.() ?? ''}`);
    },
  });

  const router = (payload as any).router ?? (payload as any).expressRouter ?? (payload as any).express?.router;
  if (router) {
    app.use(router);
  }

  app.get('/health', (_req, res) => {
    res.send('ok');
  });

  app.listen(PORT, () => {
    payload.logger.info(`Server running at http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
