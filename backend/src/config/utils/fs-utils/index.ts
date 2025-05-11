import { readFile, readdir, unlink, writeFile } from 'fs/promises';
import { UtilsDependencies } from '../../dependencies/dependencies';

type FSUtils = {
  readFile: typeof readFile;
  writeFile: typeof writeFile;
  unlink: typeof unlink;
  readdir: typeof readdir;
  testAccess: (dirPath: string) => Promise<boolean | Error>;
  readJson: <T>(path: string) => Promise<T>;
};

const createFSutils = ({ fs }: UtilsDependencies): FSUtils => {
  const { readFile, writeFile, access, constants } = fs;

  const isValidData = <T>(data: unknown): data is T => {
    return data !== null && typeof data === 'object';
  };

  const testAccess = async (dirPath: string): Promise<boolean> => {
    let bool: boolean = false;
    await access(dirPath, constants.R_OK | constants.W_OK)
      .then(() => (bool = true))
      .catch(() => (bool = false));
    return bool;
  };

  const readJson = async <T>(path: string): Promise<T> => {
    try {
      const parsedData = JSON.parse(await readFile(path, { encoding: 'utf8' }));
      if (isValidData<T>(parsedData)) {
        return parsedData;
      }
      throw new Error('File read err');
    } catch (err) {
      console.log(err); // TODO: err handler
      throw new Error('File read err');
      // return null;
    }
  };

  return { readFile, writeFile, unlink, testAccess, readJson, readdir };
};

export type { FSUtils };

export { createFSutils };
