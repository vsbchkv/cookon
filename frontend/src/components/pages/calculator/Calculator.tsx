import './Calculator.css';
import { useCallback, useState } from 'react';
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useFetchItemByIdQuery
} from '../../../features/data-api/data-api-slice';

const Calculator: React.FC = () => {
  const [currentId = '', setCurrentId] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');

  const [createItem, { isError }] = useCreateItemMutation();
  const [deleteItem] = useDeleteItemMutation();
  const { data: item, error: fetchError } = useFetchItemByIdQuery(currentId, {
    skip: !currentId // Skip if no postId is provided
  });

  const handleCreateItem = useCallback(() => {
    const obj = {
      id: '',
      name: name,
      category: category ?? 'ingredients',
      source: url
    };
    createItem({ item: obj, endpoint: obj.category });
  }, [createItem, name, category, currentId]);

  const handleDeleteItem = useCallback(() => {
    console.log('handleDeleteItem');
    const id = currentId;
    deleteItem(id);
  }, [deleteItem, currentId]);

  if (isError) {
    console.log('ERR', fetchError);
  }

  const handleGetItem = (id: string) => setCurrentId(id);

  return (
    <>
      <h2>Ingredients</h2>
      <form style={{ color: '#000' }}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="text" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="button" onClick={handleCreateItem}>
          create!
        </button>
      </form>

      <button type="button" onClick={handleDeleteItem}>
        Delete!
      </button>
      <button type="button" onClick={() => handleGetItem('recipes_m8-0g6-nI5tpNpf-Cqm81rtKoBE9G6c')}>
        get!
      </button>
    </>
  );
};

export { Calculator };
