import { useEffect, useMemo } from 'react';

import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useLocation, Outlet, Link } from 'react-router-dom';

import {
  selectCurrentView,
  selectCubeTransition,
  setCurrentView,
  selectLayoutElements,
  setLayoutElements
} from '../../features/ui-slice/ui-slice';
import { useAppDispatch } from '../../utils/hooks';
import { Nav } from '../nav/Nav';
import './Layout.css';

type LayoutViews = 'home' | 'recipes' | 'shopping' | 'calculator' | 'ingredients' | 'error';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const currentView = useSelector(selectCurrentView) as LayoutViews;
  const isCubeAnimated = useSelector(selectCubeTransition);
  const layoutElementsState = useSelector(selectLayoutElements);
  const pageTitle = layoutElementsState.pageTitle;

  const title = pageTitle ? pageTitle : currentView;
  const pageSlug = useMemo(() => {
    const [, page, item] = pathname.split('/');
    const pagename = page === '' ? 'home' : page;
    const itemName = item ? item : '';
    return { pagename, itemName };
  }, [pathname]);

  useEffect(() => {
    if (currentView !== pageSlug.pagename) {
      dispatch(setCurrentView(pageSlug.pagename));
    }
    if (!pageSlug.itemName) {
      dispatch(setLayoutElements({ ...layoutElementsState, pageTitle: pageSlug.pagename }));
    }
  }, [dispatch, pageSlug]);

  const layoutClassName = clsx('layout', currentView);
  return (
    <div className={layoutClassName}>
      <header className="header">
        <Link to="/" className="logo">
          <h1>
            {(() => {
              if (pageSlug.pagename === 'home') {
                return 'CookOn';
              }
              return pageSlug.itemName ? 'Cook' : 'On';
            })()}
          </h1>
        </Link>
        <h2 className="page-title glow">{title}</h2>
      </header>

      <section className="content content--r">
        <Outlet />
      </section>
      <Nav view="text" className="layout-nav" setDisabled={isCubeAnimated} />
    </div>
  );
};

export { Layout };
