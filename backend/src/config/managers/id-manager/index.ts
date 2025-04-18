import { NodeUtils } from '../../utils/utils';

type IdManager = {
  generateID: (prefix: string) => Promise<string | null>;
  releaseID: (id: string) => boolean;
};

const createIDManager = ({ readdir, resolvePath }: NodeUtils): IdManager => {
  const ID_PREFIXES = ['recipes', 'ingredients'];
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const parts = [2, 3, 8, 15];
  const idset = new Set<string>();

  (async () => {
    const list = await Promise.all([await readdir(resolvePath('../databases/recipes'))]);
    list.reduce((acc, curr) => [...acc, ...curr], []).forEach((id) => idset.add(id));
  })();

  const validateID = (id: string): boolean => {
    if (!id || idset.has(id)) {
      return false;
    }

    const idRegex =
      /^[0-9a-zA-Z]{parts[0]}-[0-9a-zA-Z]{parts[1]}-[0-9a-zA-Z]{parts[2]}-[0-9a-zA-Z]{parts[3]}-[0-9a-zA-Z]{parts[4]}$/;
    const isPrefix = id.includes('_');

    if (isPrefix) {
      const [prefix, idStr] = id.split('_');
      if (ID_PREFIXES.includes(prefix) || idRegex.test(idStr)) {
        return true;
      }
    }
    if (!idRegex.test(id)) {
      return false;
    }

    return true;
  };

  const generateID = async (prefix = ''): Promise<string | null> => {
    let count = 0;
    const generateChar = () => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      return Math.random() > 0.5 ? char.toUpperCase() : char;
    };

    const generate = async (): Promise<string | null> => {
      if (count > 10) {
        return null;
      }
      const newId = parts.reduce((str, part, index) => {
        const arr = new Array(part).fill('').map(generateChar);
        const separator = index === 0 ? `${prefix && '_'}` : '-';

        return (str += `${separator}${arr.join('')}`);
      }, prefix);

      if (validateID(newId)) {
        idset.add(newId);
        return newId;
      } else {
        count++;
        return generate();
      }
    };

    return generate();
  };

  const releaseID = (id: string): boolean => idset.delete(id);

  return { generateID, releaseID };
};
export type { IdManager };
export { createIDManager };
