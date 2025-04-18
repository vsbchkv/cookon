import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { useAppDispatch } from '../../utils/hooks';
import { selectCurrentView, selectCubeTransition, setCurrentView } from '../../features/ui-slice/ui-slice';
import { Nav } from '../nav/Nav';
import clsx from 'clsx';
import './Layout.css';

type LayoutViews = 'home' | 'recipes' | 'shopping' | 'calculator' | 'ingredients' | 'error';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const currentView = useSelector(selectCurrentView) as LayoutViews;
  const isCubeAnimated = useSelector(selectCubeTransition);
  const view = useMemo(() => {
    const [, pathRoot] = pathname.split('/');
    return pathRoot === '' ? 'home' : pathRoot;
  }, [pathname]);

  useEffect(() => {
    dispatch(setCurrentView(view));
  }, [dispatch, view]);

  const layoutClassName = clsx('layout', currentView);

  return (
    <div className={layoutClassName}>
      <Link to="/" className="logo">
        <h1>cookON</h1>
      </Link>
      <h2 className="page-title glow">{currentView}</h2>
      <section className="content content--r">
        <Outlet />
      </section>
      <Nav view="text" setDisabled={isCubeAnimated} />
    </div>
  );
};

export { Layout };
