import './Cube.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../utils/hooks';
import { selectCubeTransition, setCubeTransition } from '../../features/ui-slice/ui-slice';
import clsx from 'clsx';
import { Scrollbox } from '../scrollbox/Scrollbox';

type LayoutViews = 'home' | 'recipes' | 'shopping' | 'calculator' | 'ingredients' | 'error';

enum CubeSides {
  Front = 'front',
  Back = 'back',
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom'
}

const Cube: React.FC<{
  active: CubeSides;
  children: React.ReactElement[];
}> = ({ active, children }) => {
  const dispatch = useAppDispatch();
  const cubeTransition = useSelector(selectCubeTransition);

  const handleAnimationEnd = () => {
    dispatch(setCubeTransition(false));
  };

  useEffect(() => {
    dispatch(setCubeTransition(true));
  }, [active, dispatch]);

  const sides = children.map((component: React.ReactElement, index: number) => {
    const keyStr = typeof component.type === 'function' ? component.type.name?.toLowerCase() : '';

    return (
      <Scrollbox
        key={keyStr}
        className={clsx(
          'cube-side',
          `cube-side--${Object.values(CubeSides)[index]}`,
          `cube-side--${keyStr}`,
          'glow',
          'scrollbox'
        )}
      >
        {component}
      </Scrollbox>
    );
  });

  return (
    <div className={clsx('cube', active && active, cubeTransition && 'cube--transition')}>
      <div className="cube-box" onAnimationEnd={handleAnimationEnd}>
        {sides}
      </div>
    </div>
  );
};

export { Cube, CubeSides };
