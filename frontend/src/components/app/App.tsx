import { Fragment, useEffect } from 'react';
import { useAppDispatch } from '../../utils/hooks';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './app-routes/routes';
import { useFetchInitialDataQuery } from '../../features/data-api/data-api-slice';
import { setData, setLoading } from '../../features/data-slice/data-slice';

const App: React.FC = () => {
  const router = createBrowserRouter(routes);
  const { data, isLoading } = useFetchInitialDataQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (data) {
      dispatch(setData(data));
    }
  }, [data, isLoading, dispatch]);

  return (
    <Fragment>
      <RouterProvider router={router} />
      {/* <div className="out">
        <div className="in"></div>
      </div> */}
    </Fragment>
  );
};

export default App;
