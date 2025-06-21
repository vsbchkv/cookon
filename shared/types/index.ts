import type { JSONSchemaType } from "ajv";

export type Item = {
  name: string;
  id: string;
  category: "ingredients" | "recipes" | "shopping";
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
    unit: "min" | "h";
  };
  ingredients: {
    name: string;
    id: string;
    amount: number;
    unit:
      | "g"
      | "l"
      | "ml"
      | "tsp"
      | "tbsp"
      | "piece"
      | "pieces"
      | "clove"
      | "cloves"
      | "pinch";
    notes?: string;
  }[];
  method: {
    step: number;
    description?: string;
    time?: number;
    temperature?: {
      value: number;
      unit: "C" | "F";
    };
  }[];
  author?: string; // Author's name
  source?: string; // Book or Article or URL to the source of the recipe
};

export type Shopping = Item & {
  list: Recipe["ingredients"];
};

export type IndexData = {
  recipes: (Item | Partial<Item>)[];
  ingredients: (Item | Partial<Item>)[];
};

export type RecipeSchema = JSONSchemaType<Recipe>;
export type IngredientSchema = JSONSchemaType<Ingredient>;
export type ShoppingSchema = JSONSchemaType<Shopping>;
export interface Schemas {
  recipeSchema: RecipeSchema;
  ingredientSchema: IngredientSchema;
  shoppingSchema: ShoppingSchema;
}

export type ItemTypes = Recipe | Ingredient | Shopping;
export type ItemSchema = JSONSchemaType<Item>;
export type { JSONSchemaType };
