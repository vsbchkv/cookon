import { RouteObject } from 'react-router-dom';

import { Cube, CubeSides } from '../../cube/Cube';
import { Layout } from '../../layout/Layout';
import { Calculator } from '../../pages/calculator/Calculator';
import { NotFound } from '../../pages/error-page/ErrorPage';
import { Home } from '../../pages/home/Home';
import { Ingredient } from '../../pages/ingredients/ingredient/Ingredient';
import { Ingredients } from '../../pages/ingredients/Ingredients';
import { Recipe } from '../../pages/recipes/recipe/Recipe';
import { Recipes } from '../../pages/recipes/Recipes';
import { Shopping } from '../../pages/shopping/Shopping';

type AppRoute = {
  path: string;
  label: string;
};

const mainRoutes = [
  { path: '', index: true, Component: Home },
  { path: 'recipes', Component: Recipes },
  { path: 'shopping', Component: Shopping },
  { path: 'calculator', Component: Calculator },
  { path: 'ingredients', Component: Ingredients },
  { path: 'add', Component: Ingredients },
  { path: 'back', Component: Recipes }
];
const routeToCubeSideMap = new Map([
  ['', CubeSides.Front], // Home route
  ['home', CubeSides.Front],
  ['recipes', CubeSides.Back],
  ['shopping', CubeSides.Left],
  ['calculator', CubeSides.Right],
  ['ingredients', CubeSides.Bottom],
  ['add', CubeSides.Top],
  ['back', CubeSides.Back],
  // Special routes
  ['recipes/:id', CubeSides.Back],
  ['ingredients/:id', CubeSides.Bottom]
]);

const getActiveSideForRoute = (path: string): CubeSides => {
  if (routeToCubeSideMap.has(path)) {
    return routeToCubeSideMap.get(path)!;
  }
  if (path.startsWith('recipes/')) {
    return routeToCubeSideMap.get('recipes/:id')!;
  }
  if (path.startsWith('ingredients/')) {
    return routeToCubeSideMap.get('ingredients/:id')!;
  }

  return CubeSides.Front;
};

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      ...mainRoutes.map(({ path, index }) => ({
        path: index ? undefined : path,
        index,
        element: (
          <Cube active={getActiveSideForRoute(path)} scrollable>
            <Home />
            <Recipes />
            <Shopping />
            <Calculator />
            <Ingredients />
          </Cube>
        )
      })),

      {
        path: 'recipes/:id',
        element: (
          <Cube active={getActiveSideForRoute('recipes/:id')} scrollable>
            <Home />
            <Recipe />
            <Shopping />
            <Calculator />
            <Ingredients />
          </Cube>
        )
      },
      {
        path: 'ingredients/:id',
        element: (
          <Cube active={getActiveSideForRoute('ingredients/:id')} scrollable>
            <Home />
            <Recipes />
            <Shopping />
            <Calculator />
            <Ingredient />
          </Cube>
        )
      },

      // 404 route
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

export { routes };
export type { AppRoute };
