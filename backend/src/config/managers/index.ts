import { FileManager, createFileManager } from './file-manager';
import { IdManager, createIDManager } from './id-manager';
import { ItemManager, createItemManager } from './item-manager';
import { StateManager, createStateManager } from './state-manager';
import { Utils } from '../utils/utils';

type Managers = {
  idManager: IdManager;
  itemManager: ItemManager;
  fileManager: FileManager;
};
const createManagers = (utils: Utils): Promise<StateManager> => {
  const idManager = createIDManager(utils);
  const itemManager = createItemManager(utils);
  const fileManager = createFileManager(utils);
  const stateManager = createStateManager({ idManager, itemManager, fileManager });

  return stateManager;
};

export { createManagers };
export type { Managers, StateManager };
