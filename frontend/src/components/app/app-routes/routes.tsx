import { RouteObject } from 'react-router-dom';
import { Layout } from '../../layout/Layout';
import { Home } from '../../pages/home/Home';
import { Ingredients } from '../../pages/ingredients/Ingredients';
import { Recipes } from '../../pages/recipes/Recipes';
import { Shopping } from '../../pages/shopping/Shopping';
import { Calculator } from '../../pages/calculator/Calculator';
import { NotFound } from '../../pages/error-page/ErrorPage';
import { Recipe } from '../../pages/recipes/recipe/Recipe';
import { Ingredient } from '../../pages/ingredients/ingredient/Ingredient';
import { Cube, CubeSides } from '../../cube/Cube';
import React from 'react';

type AppRoute = {
  path: string;
  label: string;
};

const mainViews = ['home', 'recipes', 'shopping', 'calculator', 'ingredients'] as const;
// Define route configurations
const mainRoutes = [
  { path: '', index: true, Component: Home },
  { path: 'recipes', Component: Recipes },
  { path: 'shopping', Component: Shopping },
  { path: 'calculator', Component: Calculator },
  { path: 'ingredients', Component: Ingredients }
];
const routeToCubeSideMap = new Map([
  ['', CubeSides.Front], // Home route
  ['home', CubeSides.Front],
  ['recipes', CubeSides.Back],
  ['shopping', CubeSides.Left],
  ['calculator', CubeSides.Right],
  ['ingredients', CubeSides.Bottom],
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
          <Cube active={getActiveSideForRoute(path)}>
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
          <Cube active={getActiveSideForRoute('recipes/:id')}>
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
          <Cube active={getActiveSideForRoute('ingredients/:id')}>
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
