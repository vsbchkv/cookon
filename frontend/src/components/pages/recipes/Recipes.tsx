import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectData, selectDataLoading } from '../../../features/data-slice/data-slice';
import { Item } from '../../../types';
import './Recipes.css';

const Recipes: React.FC = () => {
  const isLoading = useSelector(selectDataLoading);
  const recipes = useSelector(selectData)?.recipes;

  const recipesLinksList = recipes?.map((el: Item | Partial<Item>) => {
    return (
      <li className="list-item" key={el.id}>
        <Link to={`/recipes/${el.id}`}>
          <h2>{el.name}</h2>
        </Link>
      </li>
    );
  });

  return <>{isLoading || !recipes ? '...loading' : <ul className="list recipes-list">{recipesLinksList}</ul>}</>;
};

export { Recipes };
