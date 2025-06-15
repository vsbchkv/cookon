import { Curry, CurriedFn } from '../utils';
import { PathLike } from 'fs';
import { UtilsDependencies } from '../../dependencies/dependencies';

type FSUtils = {
  writeFile: CurriedFn<[PathLike, string | Buffer], Promise<void>>;
  deleteFile: (path: string) => Promise<void>;
  readDir: (path: string) => Promise<string[]>;
  testAccess: (dirPath: string) => Promise<boolean | Error>;
  readJson: (path: string) => Promise<object>;
};

const createFSutils = (curry: Curry, { fs }: UtilsDependencies): FSUtils => {
  const { readdir: fsReaddir, readFile: fsReadFile, writeFile: fsWriteFile, access, constants, unlink } = fs;

  const testAccess = async (dirPath: string): Promise<boolean> => {
    let bool: boolean = false;
    await access(dirPath, constants.R_OK | constants.W_OK)
      .then(() => (bool = true))
      .catch(() => (bool = false));
    return bool;
  };

  const readDir = async (path: string): Promise<string[]> => {
    try {
      const files = await fsReaddir(path);
      return files;
    } catch {
      throw new Error('Directory read err');
    }
  };

  const readJson = async (path: string): Promise<object> => {
    try {
      const parsedData = JSON.parse(await fsReadFile(path, { encoding: 'utf8' }));
      if (parsedData) {
        return parsedData;
      }
      throw new Error('File read err');
    } catch (err) {
      console.log(err);
      throw new Error('File read err');
      // return null;
    }
  };

  const writeFile = curry(async (path: PathLike, data: string | Buffer): Promise<void> => {
    await fsWriteFile(path, data);
  });

  const deleteFile = async (path: string): Promise<void> => {
    await unlink(path);
  };

  return {
    writeFile,
    deleteFile,
    testAccess,
    readJson,
    readDir
  };
};

export type { FSUtils };

export { createFSutils };
