import { ItemSchema, ItemTypes } from '../../shared-data/types';
import { Categories } from '../state-manager';
import { Utils } from '../../utils/utils';

type ItemManager = {
  createItemDraft: (category: Categories, item: ItemTypes) => Promise<ItemTypes | null>;
  deleteItem: (id: string) => boolean;
};

const createItemManager = ({ usePrompt, jsonSchemas, extractJsonFromString, validate }: Utils) => {
  const createItemDraft = async (category: Categories, item: ItemTypes) => {
    const schemaMap: Record<Categories, ItemSchema> = {
      ingredients: jsonSchemas.ingredientSchema as ItemSchema['Ingredient'],
      recipes: jsonSchemas.recipeSchema as ItemSchema['Recipe']
    };
    const schema = schemaMap[category];
    const aiAllowed = true;
    const isValidItem = validate(schema)(item);
    if (isValidItem) {
      return item;
    } else {
      if (aiAllowed) {
        try {
          const createPromptOptions = () => {
            const optionsObj: { schema: ItemSchema; source?: string } = {
              schema
            };
            if ('source' in item) {
              optionsObj.source = item?.source ?? '';
            }
            return optionsObj;
          };
          const generated: string = await usePrompt(item.name)(createPromptOptions());
          const draftObj = extractJsonFromString(generated) as ItemTypes;

          return await createItemDraft(category, draftObj);
        } catch (error) {
          console.error('Error generating item:', error);
          return null;
        }
      } else {
        return null;
      }
    }
  };
  const deleteItem = (id: string): boolean => true;

  return { createItemDraft, deleteItem };
};
export type { ItemManager };
export { createItemManager };
