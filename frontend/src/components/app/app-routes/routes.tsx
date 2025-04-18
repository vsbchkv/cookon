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
import { Cube } from '../../cube/Cube';
import React from 'react';

type AppRoute = {
  path: string;
  label: string;
};

const mainViews = ['home', 'recipes', 'shopping', 'calculator', 'ingredients'] as const;

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      ...mainViews.map((view) => ({
        path: view === 'home' ? undefined : view,
        index: view === 'home',
        element: (
          <Cube view={view}>
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
          <Cube view="recipes">
            <Home />
            <Recipe />
            <Shopping />
            <Ingredients />
          </Cube>
        )
      },
      {
        path: 'ingredients/:id',
        element: (
          <Cube view="ingredients">
            <Home />
            <Ingredient />
            <Shopping />
            <Recipes />
          </Cube>
        )
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
];

export { routes };
export type { AppRoute };
