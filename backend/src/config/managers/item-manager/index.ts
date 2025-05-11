import { ItemTypes, JSONSchemaType } from '../../shared-data/types';
import { Categories } from '../state-manager';
import { Utils } from '../../utils/utils';

type ItemManager = {
  createItemDraft: (category: Categories, item: ItemTypes) => Promise<ItemTypes | null>;
  deleteItem: (id: string) => boolean;
};

const createItemManager = ({ usePrompt, jsonSchemas, extractJsonFromString, validate }: Utils) => {
  const createItemDraft = async (category: Categories, item: ItemTypes) => {
    const schemaMap: Record<Categories, JSONSchemaType<ItemTypes>> = {
      ingredients: jsonSchemas.ingredientSchema as JSONSchemaType<ItemTypes>,
      recipes: jsonSchemas.recipeSchema as JSONSchemaType<ItemTypes>
    };
    const schema = schemaMap[category];
    const aiAllowed = 1;
    const isValidItem = validate(schema)(item);
    if (isValidItem) {
      return item;
    } else {
      if (aiAllowed) {
        try {
          const createPromptOptions = () => {
            const optionsObj: { schema: JSONSchemaType<ItemTypes>; source?: string } = {
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
