import { useEffect } from 'react';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { routes } from './app-routes/routes';
import { useFetchInitialDataQuery } from '../../features/data-api/data-api-slice';
import { setData, setLoading } from '../../features/data-slice/data-slice';
import { useAppDispatch } from '../../utils/hooks';

const App: React.FC = () => {
  const router = createBrowserRouter(routes);
  const { data: appData, isLoading } = useFetchInitialDataQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(appData);
    dispatch(setLoading(isLoading));
    if (appData?.success && appData?.data) {
      dispatch(setData(appData.data));
    }
  }, [appData, isLoading, dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
