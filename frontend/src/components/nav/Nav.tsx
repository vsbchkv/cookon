import { Link } from 'react-router-dom';
import { Icon, IconProps } from '../icons/Icons';
import './Nav.css';
import clsx from 'clsx';

type NavigationProps = {
  view?: 'text' | 'icon';
  className?: string;
  setDisabled?: boolean;
};

// const navList: string[] = ['recipes', 'shopping', 'calculator', 'ingredients'];
const navList: string[] = ['recipes', 'shopping', 'calculator'];

export const Nav: React.FC<NavigationProps> = ({ view, className, setDisabled }) => {
  const links = navList.map((el) => {
    return (
      <li key={el} className={clsx('nav-item', view === 'icon' && 'nav-item--icon glow')}>
        <Link to={setDisabled ? '#' : `/${el}`} className="nav-action" aria-disabled={setDisabled}>
          {view === 'icon' && <Icon name={el as IconProps['name']} className="nav-icon" />}
          <span className={clsx('nav-title', view === 'icon' && 'visually-hidden')}>{el}</span>
        </Link>
      </li>
    );
  });

  return (
    <nav className={clsx('nav', className && className)} aria-label="Main navigation">
      <ul className="nav-list">{...links}</ul>
    </nav>
  );
};
