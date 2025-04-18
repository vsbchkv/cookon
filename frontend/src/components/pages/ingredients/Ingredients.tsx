import './Ingredients.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectData, selectDataLoading } from '../../../features/data-slice/data-slice';
import { Item } from '../../../types';

const Ingredients: React.FC = () => {
  const isLoading = useSelector(selectDataLoading);
  const ingredients = useSelector(selectData)?.ingredients;

  const ingredientLinksList = ingredients?.map((el: Item | Partial<Item>) => {
    return (
      <li className="list-item" key={el.id}>
        <Link to={`/ingredients/${el.id}`}>
          <h2>{el.name}</h2>
        </Link>
      </li>
    );
  });

  return (
    <>{isLoading || !ingredients ? '...loading' : <ul className="list ingredient-list">{ingredientLinksList}</ul>}</>
  );
};

export { Ingredients };
