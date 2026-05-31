import serverless from 'serverless-http';
import { createApp } from '../src/bootstrap';

let cachedHandler: ((req: any, res: any) => Promise<any>) | null = null;

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    const app = await createApp();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    cachedHandler = serverless(expressApp);
  }

  return cachedHandler(req, res);
}
