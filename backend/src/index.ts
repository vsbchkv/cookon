import { createAppDependencies } from './config/dependencies/dependencies';
import { startServer } from './server/server';

(function () {
  const dependencies = { ...createAppDependencies() };
  startServer(dependencies);
})();
