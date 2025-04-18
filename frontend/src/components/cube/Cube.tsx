import './Cube.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../utils/hooks';
import { selectCubeTransition, setCubeTransition } from '../../features/ui-slice/ui-slice';
import clsx from 'clsx';

type LayoutViews = 'home' | 'recipes' | 'shopping' | 'calculator' | 'ingredients' | 'error';

const Cube: React.FC<{
  view: LayoutViews;
  children: React.ReactElement[];
}> = ({ view, children }) => {
  const dispatch = useAppDispatch();
  const cubeTransition = useSelector(selectCubeTransition);

  const handleAnimationEnd = () => {
    dispatch(setCubeTransition(false));
  };

  useEffect(() => {
    dispatch(setCubeTransition(true));
  }, [view, dispatch]);

  const sides = children.map((component: React.ReactElement) => {
    const keyStr = typeof component.type === 'function' ? component.type.name?.toLowerCase() : '';
    return (
      <div key={keyStr} className={clsx('cube-side', `cube-side--${keyStr}`, 'glow')}>
        {component}
      </div>
    );
  });

  return (
    <div className={clsx('cube', view && view, cubeTransition && 'cube--transition')}>
      <div className="cube-box" onAnimationEnd={handleAnimationEnd}>
        {sides}
      </div>
    </div>
  );
};

export { Cube };
