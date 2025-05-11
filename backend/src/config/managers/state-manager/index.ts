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
  getItemByID: (id: string) => Promise<Item | Item[]>;
  createItem: (category: keyof CategoryIndexes, incomingData: Item | Partial<Item>) => Promise<Item | void>;
};

const createStateManager = async ({ fileManager, itemManager, idManager }: Managers): Promise<StateManager> => {
  const indexItemData = (item: Item | Partial<Item>) => ({
    id: item.id,
    name: item.name,
    tags: item.tags,
    category: item.category
  });

  const indexItems =
    (items: Item[]) =>
    (stateIndexObj: ItemIndex = { idIndex: {}, dataIndex: [] }) =>
      items.reduce<{
        idIndex: Record<string, Item | Partial<Item>>;
        dataIndex: ItemTypes[] | Partial<ItemTypes>[];
      }>((acc, item) => {
        const itemData = indexItemData(item);
        return {
          ...acc,
          dataIndex: [...acc.dataIndex, itemData],
          idIndex: { ...acc.idIndex, [item.id]: itemData }
        };
      }, stateIndexObj);

  const initialState = async () => {
    const readDataFromDir = async (
      dir: string
    ): Promise<{ idIndex: Record<string, Item | Partial<Item>>; dataIndex: (Item | Partial<Item>)[] }> =>
      await fileManager.read(dir).then((res) => indexItems(res)());

    const [recipesIndex, ingredientsIndex] = await Promise.all([
      readDataFromDir('recipes'),
      readDataFromDir('ingredients')
    ]);

    return { indexes: { recipes: recipesIndex, ingredients: ingredientsIndex } };
  };

  const currentState = await initialState();
  const getState = () => ({ ...currentState });

  const setState = (newState: Partial<StateType>) => {
    Object.entries(newState).forEach(([key, value]) => {
      const typedKey = key as keyof StateType;
      if (Object.prototype.hasOwnProperty.call(currentState, typedKey)) {
        (currentState[typedKey] as typeof value) = value;
      }
    });
    return { ...currentState };
  };

  const getItemByID = async (id: string) => {
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

  const getItemByName = (category: keyof CategoryIndexes, name: string = ''): Partial<Item> | null => {
    if (!name || !category) return null;
    const { indexes } = getState();
    return (
      indexes[category].dataIndex.find((obj) => obj.name?.toLowerCase().trim() === name.toLowerCase().trim()) ?? null
    );
  };

  const createItem = async (category: keyof CategoryIndexes, incomingData: ItemTypes | Partial<ItemTypes>) => {
    const { id: existingId } = getItemByName(category, incomingData.name) ?? {};

    if (existingId) {
      return await getItemByID(existingId);
    }

    return await Promise.all([
      itemManager.createItemDraft(category, {
        ...incomingData,
        name: incomingData.name || '',
        id: incomingData.id || '',
        category: category,
        source: incomingData?.source || ''
      } as ItemTypes),
      idManager.generateID(category)
    ])
      .then(async ([draft, draftId]) => {
        if (draft && draftId) {
          if ('ingredients' in draft) {
            const ingredientsList = [...draft.ingredients]
              // TODO: rm if unused
              // .filter((ingredient) => {
              //   return !getItemByName('ingredients', ingredient.name);
              // })
              .map(async (ingredient) => {
                const delay = new Promise((resolve) => setTimeout(() => resolve(true), 250));
                await delay;
                console.log(':: process', ingredient?.name);

                const newEl = await createItem('ingredients', {
                  name: ingredient.name,
                  category,
                  id: ((): Item['id'] => {
                    const existing = getItemByName('ingredients', ingredient.name);
                    if (existing && existing.id) {
                      return existing.id;
                    } else {
                      return ingredient.id;
                    }
                  })()
                });
                const newId = newEl?.id || '';
                return { ...ingredient, id: newId };
              });
            const relatedIngredients = await Promise.all(ingredientsList);
            const newItem: ItemTypes = { ...draft, id: draftId, ingredients: relatedIngredients } as ItemTypes;
            return newItem;
          } else {
            const newItem: ItemTypes = { ...draft, id: draftId } as ItemTypes;
            return newItem;
          }
        }
      })
      .then((newItem) => {
        if (!newItem) return null;

        const mutateItemObject = (newItem: ItemTypes): ItemTypes => {
          const mut: ItemTypes = Object.keys(newItem).reduce(
            (acc, key) => {
              const k = key as keyof ItemTypes;
              switch (k) {
                case 'name':
                  acc[k] = newItem[k].trim().toLowerCase();
                  break;
                case 'tags':
                  acc[k] = newItem[k]?.length ? newItem[k].map((tag: string) => tag.trim().toLowerCase()) : [];
                  break;
              }

              return acc;
            },
            { ...newItem } as ItemTypes
          );
          return mut;
        };

        return mutateItemObject(newItem as ItemTypes);
      })
      .then(async (newItem) => {
        if (newItem) {
          try {
            await fileManager.write(category, { ...newItem } as ItemTypes);
            const { indexes } = getState();
            const indexObj = indexes[category];
            const newIndex = indexItems([newItem])(indexObj);
            setState({ ...currentState, indexes: { ...indexes, [category]: newIndex } });
          } catch (error) {
            console.error('Error saving item:', error);
          }

          return newItem;
        }
      });
  };

  return { getState, setState, getItemByID, createItem };
};
export type { StateManager, StateType, Categories };
export { createStateManager };
