export type Item = {
  name: string;
  id: string;
  category: string;
};

export type Recepie = Item & {
  ingredients: string[] | null;
  method: string[] | null;
};

export type InitialData = {
  recipes: (Item | Partial<Item>)[] | null;
  ingredients: (Item | Partial<Item>)[] | null;
};
