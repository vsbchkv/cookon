import type { JSONSchemaType } from 'ajv';

export type Item = {
  name: string;
  id: string;
  category: 'ingredients' | 'recipes';
  tags?: string[];
  source?: string; // Book or Article or URL to the dta source of the recipe
};

export type Ingredient = Item & {
  calories: number;
  macronutrients: {
    carbohydrates: {
      total: number;
      fiber?: number;
      sugars?: number;
    };
    fat: {
      total: number;
      saturated?: number;
      unsaturated?: number;
    };
    protein: number;
  };
  micronutrients?: {
    vitamins?: {
      vitaminA?: number;
      vitaminC?: number;
    };
    minerals?: {
      iron?: number;
      calcium?: number;
      potassium?: number;
    };
  };
};

export type Recipe = Item & {
  description?: string;
  preparationTime: {
    total: number;
    unit: 'min' | 'h';
  };
  ingredients: {
    name: string;
    id: string;
    amount: number;
    unit: 'g' | 'l' | 'ml' | 'tsp' | 'tbsp' | 'piece' | 'pieces' | 'clove' | 'cloves' | 'pinch';
    notes?: string;
  }[];
  method: {
    step: number;
    description?: string;
    time?: number;
    temperature?: {
      value: number;
      unit: 'C' | 'F';
    };
  }[];
  author?: string; // Author's name
};

export type RecipeSchema = JSONSchemaType<Recipe>;
export type IngredientSchema = JSONSchemaType<Ingredient>;
export interface Schemas {
  recipeSchema: RecipeSchema;
  ingredientSchema: IngredientSchema;
}

export type ItemTypes = Recipe | Ingredient;
export type { JSONSchemaType };
