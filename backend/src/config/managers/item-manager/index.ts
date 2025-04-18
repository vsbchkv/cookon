import { ItemTypes } from '../../shared-data/types';
import { Categories } from '../state-manager';
import { JSONSchemaType } from 'ajv';
import { Utils } from '../../utils/utils';

type ItemManager = {
  create: (category: Categories, item: ItemTypes) => Promise<ItemTypes | null>;
  validateItem: () => boolean;
  deleteItem: (id: string) => boolean;
};

const createItemManager = ({ usePrompt, jsonSchemas, extractJsonFromString, validate }: Utils) => {
  const create = async (category: Categories, item: ItemTypes) => {
    const schemaMap: Record<Categories, JSONSchemaType<ItemTypes>> = {
      ingredients: jsonSchemas.ingredientSchema as JSONSchemaType<ItemTypes>,
      recipes: jsonSchemas.recipeSchema as JSONSchemaType<ItemTypes>
    };
    const schema = schemaMap[category];
    const aiAllowed = 1;
    console.log('create', item.name);

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

          return await create(category, draftObj);
        } catch (error) {
          console.error('Error generating item:', error);
          return null;
        }
      } else {
        return null;
      }
    }
  };
  const validateItem = (): boolean => {
    return true;
  };
  const deleteItem = (id: string): boolean => true;

  return { create, validateItem, deleteItem };
};
export type { ItemManager };
export { createItemManager };
