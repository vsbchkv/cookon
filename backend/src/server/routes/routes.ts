import { StateManager, createManagers } from '../../config/managers';
import { FastifyInstance } from 'fastify';
import { Item } from '../../config/shared-data/types';
import { createUtils } from '../../config/utils/utils';
import { handleCreateNewItem } from './handlers/handle-create-new-item';
import { handleGetDataById } from './handlers/handle-get-by-id';
import { handleRoot } from './handlers/handle-root';
import { utilsDependencies } from '../../config/dependencies/dependencies';

const createRouter = async () => {
  const stateManager: StateManager = await createManagers(createUtils(utilsDependencies));

  const router = (server: FastifyInstance): void => {
    server.get('/', handleRoot(stateManager));
    server.get('/:category/:id', handleGetDataById(stateManager));
    server.post('/create/:category/', handleCreateNewItem<Item>(stateManager));

    // server.delete('/:directory/:id', handleGetDataById(utils, DIRS));
  };

  return router;
};

export { createRouter };
