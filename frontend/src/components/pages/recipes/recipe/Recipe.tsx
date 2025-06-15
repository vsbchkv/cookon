import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { RecipeMethod } from './recipe-method/RecipeMethod';
import { useFetchItemByIdQuery } from '../../../../features/data-api/data-api-slice';
import { selectLayoutElements, setLayoutElements } from '../../../../features/ui-slice/ui-slice';
import { useAppDispatch } from '../../../../utils/hooks';
import './Recipe.css';
import { ActionPanel } from '../../../action-panel/ActionPanel';
import { Input } from '../../../input/Input';

import type { Recipe } from '../../../../shared-data/types';

const Recipe: React.FC = () => {
  const isUrl = (str: string): boolean => /^(http|https):\/\//.test(str);

  const dispatch = useAppDispatch();
  const { id = '' } = useParams();

  const { isLoading, data } = useFetchItemByIdQuery(id);
  const [multyplier, setMultiplier] = useState(1);
  const [list, setList] = useState({});

  const createShopList = () => {
    if (data?.ingredients && data.ingredients.length) {
      const sl = data.ingredients.reduce((acc, ingredient) => {}, {});
      console.log('create', list);
    }
  };

  const currentLayoutElemnts = useSelector(selectLayoutElements);
  useEffect(() => {
    if (data && data.name) {
      console.log(data);
      dispatch(setLayoutElements({ ...currentLayoutElemnts, pageTitle: data.name }));
    }
  }, [dispatch, data]);

  return isLoading ? (
    '...load'
  ) : (
    <div className="recipe">
      <section className="section recipe-section glow">
        <h3 id="overview" className="recipe-title">
          Overview
        </h3>

        {'description' in data && <div className="recipe-description">{data.description}</div>}

        <dl className="section-content list list--dictionary recipe-list">
          {['author', 'source'].reduce((acc: React.ReactNode[], prop: string) => {
            if (data && data[prop as keyof Recipe]) {
              return [
                ...acc,
                <dt
                  key={`dt-${prop}`}
                  className={clsx('list-term recipe-list-term', prop == 'description' && 'visually-hidden')}
                >
                  {prop}&nbsp;:
                </dt>,
                <dd
                  key={`dd-${prop}`}
                  className={clsx('list-description', 'recipe-list-description', {
                    'is-url': typeof data[prop] === 'string' && isUrl(data[prop])
                  })}
                >
                  {isUrl(data[prop]) ? (
                    <a href={data[prop]}>{data[prop as keyof typeof data]}</a>
                  ) : (
                    data[prop as keyof typeof data]
                  )}
                </dd>
              ];
            } else {
              return acc;
            }
          }, [] as React.ReactNode[])}
        </dl>
      </section>
      <section className="recipe-section glow">
        <h3 id="ingredients" className="recipe-title">
          <span>Ingredients</span>
          {
            <div className="recipe-mutiplilier" aria-label="set ingredients multiplier">
              <Input
                type="number"
                value={multyplier.toString()}
                onChange={(value) => {
                  setMultiplier(+value);
                }}
                min="1"
              ></Input>
            </div>
          }
        </h3>

        <dl className="list recipe-list list--dictionary">
          {data?.ingredients ? (
            data?.ingredients.map((ingredient: Recipe['ingredients'][number]) => (
              <>
                <dt key={ingredient.id} className="recipe-list-term">
                  {ingredient.name} :
                </dt>
                <dd className="recipe-list-description">
                  {ingredient.amount ? `${ingredient.amount * multyplier} ${ingredient.unit}` : '~~'}
                </dd>
              </>
            ))
          ) : (
            <li>No ingredients found</li>
          )}
        </dl>
        <ActionPanel className="shopping" collapsable onOpen={() => console.log('Open')}>
          <button
            type="button"
            className="shopping"
            onClick={() => {
              console.log('ADD');
              createShopList();
            }}
          >
            Add to shopping list
          </button>
        </ActionPanel>
      </section>

      <section className="recipe-section glow">
        <h3 id="ingredients" className="recipe-title">
          Method
        </h3>

        <ul className="list recipe-list recipe-list--method">
          {data?.method ? (
            data?.method.map((method: Recipe['method'][number]) => <RecipeMethod method={method} key={method.step} />)
          ) : (
            <li>No method found</li>
          )}
        </ul>
      </section>
    </div>
  );
};

export { Recipe };
