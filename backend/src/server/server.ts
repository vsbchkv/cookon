import { AppDependencies } from '../config/dependencies/dependencies';
import { createRouter } from './routes/routes';

export const startServer = async (dependencies: AppDependencies): Promise<void> => {
  const { createServer, logger } = dependencies;

  const server = createServer();
  const router = await createRouter();

  router(server);

  try {
    await server.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
      if (err) {
        logger.error(err as unknown as string); // Logger should be ready at this point
        process.exit(1);
      }
    });

    logger.info('Server started successfully');
  } catch (err) {
    logger.error(err as string);
    process.exit(1);
  }
};
