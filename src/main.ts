import { Logger } from '@nestjs/common';
import { createApp } from './bootstrap';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await createApp();
  app.enableShutdownHooks();

  // Handle shutdown signals
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM signal received: closing HTTP server');
    await app.close();
    logger.log('HTTP server closed');
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT signal received: closing HTTP server');
    await app.close();
    logger.log('HTTP server closed');
    process.exit(0);
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 GraphQL API running on http://localhost:${port}/graphql`);
  logger.log(`🔒 Security: Helmet, CORS (open), Rate Limiting enabled`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

  if (!isProduction) {
    logger.log(`🎮 GraphQL Playground: http://localhost:${port}/graphql`);
  } else {
    logger.log(`🔐 GraphQL Playground: DISABLED (production mode)`);
    logger.log(`🔐 GraphQL Introspection: DISABLED (production mode)`);
  }
}

bootstrap();
