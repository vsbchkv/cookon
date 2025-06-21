import { Ingredient, Item, Recipe } from '../../shared-data/types';
import { Utils } from '../../utils/utils';

type FileManager = {
  read: <T extends Item | Recipe | Ingredient>(dir: string, id?: string) => Promise<T[]>;
  write: <T extends Item | Recipe | Ingredient>(dir: string, item: T) => Promise<void>;
};

const createFileManager = ({ testAccess, resolvePath, readDir, readJson, writeFile }: Utils): FileManager => {
  type Dirs = { readonly [key: string]: string };
  const DIRS: Dirs = {
    root: '/',
    databases: '../databases',
    recipes: '../databases/recipes',
    ingredients: '../databases/ingredients',
    schemas: './config/shared-data/schemas'
  };

  const read = async <T extends Item | Recipe | Ingredient>(dir: string, id?: string): Promise<T[]> => {
    const dirPath = resolvePath(DIRS[dir]);
    if (!DIRS[dir] || !(await testAccess(dirPath))) {
      return [] as T[];
    }

    if (id) {
      const filePath = resolvePath(dirPath, id);
      return [(await readJson(filePath)) as T];
    } else {
      const files = await readDir(dirPath);
      return await Promise.all(files.map((f) => readJson(resolvePath(dirPath, f)) as Promise<T>));
    }
  };
  const write = async <T extends Item | Recipe | Ingredient>(dir: string, item: T) => {
    const dirPath = resolvePath(DIRS[dir]);
    if (!DIRS[dir] || !(await testAccess(dirPath))) {
      return;
    }

    const filePath = resolvePath(dirPath, item.id);
    const strContent = JSON.stringify(item, null, 2); // TODO: min version after tests
    await writeFile(filePath)(strContent);
  };

  return { read, write };
};

export type { FileManager };
export { createFileManager };
