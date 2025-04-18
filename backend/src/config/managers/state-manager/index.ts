import { Item, ItemTypes } from '../../shared-data/types';
import { Managers } from '..';

type ItemIndex = {
  idIndex: Record<string, Item | Partial<Item>>;
  dataIndex: (Item | Partial<Item>)[];
};

type CategoryIndexes = {
  recipes: ItemIndex;
  ingredients: ItemIndex;
};

type Categories = keyof CategoryIndexes;

type StateType = {
  indexes: CategoryIndexes;
};

type StateManager = {
  getState: () => StateType;
  setState: (newState: object) => object;
  getItemsByID: (id: string) => Promise<Item | Item[]>;
  createItem: (category: keyof CategoryIndexes, incomingData: Item | Partial<Item>) => Promise<void>;
};

const createStateManager = async ({ fileManager, itemManager, idManager }: Managers): Promise<StateManager> => {
  // const strToKey = (str: string) => str.trim().toLowerCase().replace(/\s/g, '~~');
  const indexItems = (items: Item[], dir?: string) =>
    items.reduce<{ idIndex: Record<string, Item | Partial<Item>>; dataIndex: ItemTypes[] | Partial<ItemTypes>[] }>(
      (acc, item) => {
        const itemData = { id: item.id, name: item.name, tags: item.tags, dir: dir };
        return {
          ...acc,
          dataIndex: [...acc.dataIndex, itemData],
          idIndex: { ...acc.idIndex, [item.id]: itemData }
        };
      },
      { idIndex: {}, dataIndex: [] }
    );

  const initState = async () => {
    const readDataFromDir = async (
      dir: string
    ): Promise<{ idIndex: Record<string, Item | Partial<Item>>; dataIndex: (Item | Partial<Item>)[] }> =>
      await fileManager.read(dir).then((res) => indexItems(res, dir));
    const [recipesIndex, ingredientsIndex] = await Promise.all([
      readDataFromDir('recipes'),
      readDataFromDir('ingredients')
    ]);

    return { indexes: { recipes: recipesIndex, ingredients: ingredientsIndex } };
  };
  await initState();

  let currentState: StateType = await initState();

  const getState = () => ({ ...currentState });
  const setState = (newState: object) => {
    currentState = { ...currentState, ...newState };
    return { ...currentState };
  };

  const getItemsByID = async (id: string) => {
    const getCategory = (id: string): keyof CategoryIndexes | '' => {
      const { indexes } = getState();
      const categoriesList = Object.keys(indexes) as Array<keyof CategoryIndexes>;

      const substr = id.split('_')[0] as keyof CategoryIndexes;
      if (substr && categoriesList.includes(substr as keyof CategoryIndexes)) {
        return substr;
      } else {
        const category = categoriesList.find((categorie) => indexes[categorie].idIndex[id]) || '';
        return category;
      }
    };
    const categorie = getCategory(id);
    const [result] = await fileManager.read(categorie, id);
    return result;
  };

  const getItemByName = (category: keyof CategoryIndexes, name: string) => {
    const { indexes } = getState();
    return indexes[category].dataIndex.find((obj) => obj.name === name);
  };

  const createItem = async (category: keyof CategoryIndexes, incomingData: ItemTypes | Partial<ItemTypes>) => {
    const [draft, draftId] = await Promise.all([
      itemManager.create(category, {
        ...incomingData,
        name: incomingData.name || '',
        id: incomingData.id || '',
        category: category
      } as ItemTypes),
      idManager.generateID(category)
    ]);

    if (draft && draftId) {
      if ('ingredients' in draft) {
        const ingredientsList = [...draft.ingredients]
          .filter((ingredient) => {
            return !getItemByName('ingredients', ingredient.name);
          })
          .map((ingredient) => {
            return createItem('ingredients', {
              name: ingredient.name,
              category,
              id: ingredient.id
            });
          });
        await Promise.all(ingredientsList);
        console.log('Promise.all END');
      }
      const newItem: ItemTypes = { ...draft, id: draftId };

      const mutateItemObject = (newItem: ItemTypes): ItemTypes => {
        const keyList: string[] = ['name', 'category', 'tags', 'ingredients'];
        return Object.keys(newItem).reduce(
          (acc, key) => {
            const k = key as keyof ItemTypes;

            const shouldBeProcessed: boolean = !!(newItem[k] && keyList.includes(k));
            if ('ingredients' in newItem) {
              if (shouldBeProcessed && newItem[k] && Array.isArray(newItem[k])) {
                acc = {
                  ...acc,
                  [k]: newItem[k].map((ingredient) => ({
                    ...ingredient,
                    id: getItemByName('ingredients', ingredient?.name)?.id ?? ingredient.id
                  }))
                };
              }
            }
            if (shouldBeProcessed && typeof newItem[k] === 'string') {
              acc = { ...acc, [k]: (newItem[k] as string).toLowerCase() };
            } else if (shouldBeProcessed && Array.isArray(newItem[k])) {
              acc = {
                ...acc,
                [k]: (newItem[k] as string[]).map((val) =>
                  typeof val === 'object' ? mutateItemObject(val) : val.toLowerCase()
                )
              };
            } else if (shouldBeProcessed && typeof newItem[k] === 'object') {
              acc = { ...acc, [k]: mutateItemObject(newItem[k] as unknown as ItemTypes) };
            } else {
              return acc;
            }
            return acc;
          },
          { ...newItem }
        );
      };

      await fileManager.write(category, mutateItemObject({ ...newItem }));
    } else {
      console.log('Something went wrong', incomingData.name);
    }
  };

  return { getState, setState, getItemsByID, createItem };
};
export type {};
export { createStateManager, StateManager, StateType, Categories };
