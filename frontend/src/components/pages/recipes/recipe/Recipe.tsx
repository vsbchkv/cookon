import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../../utils/hooks';
import { useFetchItemByIdQuery } from '../../../../features/data-api/data-api-slice';
import { selectLayoutElements, setLayoutElements } from '../../../../features/ui-slice/ui-slice';
import './Recipe.css';
import type { Recipe } from '../../../../types';
import { RecipeMethod } from './recipe-method/RecipeMethod';

const Recipe: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id = '' } = useParams();
  const { isLoading, data } = useFetchItemByIdQuery(id);
  const currentLayoutElemnts = useSelector(selectLayoutElements);

  useEffect(() => {
    if (data && data.name) {
      dispatch(setLayoutElements({ ...currentLayoutElemnts, pageTitle: data.name }));
    }
  }, [dispatch, data]);

  data && console.log(data);

  return isLoading ? (
    '...load'
  ) : (
    <div className="recipe">
      <section className="recipe-section glow">
        <h3 id="overview" className="recipe-title">
          Overview
        </h3>

        <div>{data?.name}</div>
      </section>
      <section className="recipe-section glow">
        <h3 id="ingredients" className="recipe-title">
          Ingredients <button onClick={() => console.log('Ingredients button clicked')}>Edit</button>
        </h3>

        <dl className="list recipe-list recipe-list--ingredients">
          {data?.ingredients ? (
            data?.ingredients.map((ingredient: Recipe['ingredients'][number]) => (
              <>
                <dt key={ingredient.id} className="recipe-list-term">
                  {ingredient.name}
                </dt>
                <dd className="recipe-list-description">
                  {ingredient.amount} {ingredient.unit}
                </dd>
              </>
            ))
          ) : (
            <li>No ingredients found</li>
          )}
        </dl>
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
