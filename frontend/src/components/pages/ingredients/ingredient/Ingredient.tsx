import { useParams } from 'react-router-dom';

import { useFetchItemByIdQuery } from '../../../../features/data-api/data-api-slice';
import { Item } from '../../../../shared-data/types';

const Ingredient: React.FC = () => {
  const { id = '' } = useParams();

  const { isLoading, data } = useFetchItemByIdQuery(id);
  const ee = useFetchItemByIdQuery(id);
  console.log(ee.isLoading);
  return isLoading ? (
    '...load'
  ) : (
    <>
      <h2>{data.name}</h2>
      <div>{data.id}</div>
      <div>{data.name}</div>
    </>
  );
};

export { Ingredient };
