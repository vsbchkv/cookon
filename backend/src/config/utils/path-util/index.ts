import { UtilsDependencies } from '../../dependencies/dependencies';
type PathUtils = {
  resolvePath: (...dirs: string[]) => string;
};

const createPathUtils = ({ path, fileURLToPath }: UtilsDependencies): PathUtils => {
  const { dirname } = path;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const resolvePath = (...dirs: string[]) => path.resolve(__dirname, ...dirs);
  return { resolvePath };
};

export type { PathUtils };

export { createPathUtils };
