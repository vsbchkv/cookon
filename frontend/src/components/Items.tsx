import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useFetchItemByIdQuery
} from '../features/data-api/data-api-slice';
import { useCallback, useState } from 'react';
import { Item } from '../types';
import { Link } from 'react-router-dom';

type listProps = {
  list: Item[];
};
const Items: React.FC<listProps> = ({ list }) => {
  const [currentId = '', setCurrentId] = useState<string | undefined>();

  const [createItem, { isError }] = useCreateItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const { data: item, error: fetchError } = useFetchItemByIdQuery(currentId, {
    skip: !currentId // Skip if no postId is provided
  });
  const handleCreateItem = useCallback(() => {
    console.log('handleCreateItem');

    const o = {
      name: 'petya',
      id: '',
      ingredients: ['pivo', 'vodka'],
      method: ['drink'],
      category: 'recipes'
    };
    createItem(o);
  }, [createItem]);

  const handleDeleteItem = useCallback(() => {
    console.log('handleDeleteItem');

    const id = 'recipes_ed-3Oq-zNmhyyEN-0VHiTeSXGsJ1zzi';
    deleteItem(id);
  }, [deleteItem]);

  if (isError) {
    console.log('ERR');
  }

  const handleGetItem = (id: string) => setCurrentId(id);

  const recipesLinksList = list.map((el) => {
    return (
      <Link to="./recipes" key={el.id}>
        <h2>{el.name}</h2>
      </Link>
    );
  });

  return (
    <>
      {/* <button type="button" onClick={handleCreateItem}>
        create!
      </button>
      <button type="button" onClick={handleDeleteItem}>
        Delete!
      </button>
      <button type="button" onClick={() => handleGetItem('recipes_m8-0g6-nI5tpNpf-Cqm81rtKoBE9G6c')}>
        get!
      </button> */}
      {recipesLinksList}
    </>
  );
};

export default Items;
