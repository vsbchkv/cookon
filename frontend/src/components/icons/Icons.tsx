import { FC } from 'react';
import clsx from 'clsx';
import './Icon.css';

type IconProps = {
  name: 'cocktails' | 'recipes' | 'shopping' | 'calculator';
  className?: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
};

const Icon: FC<IconProps> = ({ name, className = '', ariaLabel, ariaHidden = true }) => {
  const icons = {
    cocktails: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 463 463"
        className={clsx('icon-svg', className && `${className}-svg`)}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      >
        <path d="M403.77 72.38c3.6-4.57 4.25-10.66 1.7-15.9S397.75 48 391.93 48H335.7a31.8 31.8 0 0 0-13.66-26.45l4.44-11.3a7.5 7.5 0 0 0-13.96-5.5l-4.5 11.48A31.57 31.57 0 0 0 274.88 36l-4.68 12H71.09c-5.82 0-11.01 3.25-13.56 8.48s-1.89 11.33 1.7 15.9L224 282.1v117.4a48.55 48.55 0 0 1-48.5 48.5h-24a7.5 7.5 0 1 0 0 15h160a7.5 7.5 0 1 0 0-15h-24a48.55 48.55 0 0 1-48.5-48.5V282.1L403.77 72.38zm-135 70.62c7.8 0 11.3 1.5 15.73 3.4 5.04 2.16 10.76 4.6 21.64 4.6 9.58 0 15.16-1.9 19.8-3.83l-94.44 120.2-94.44-120.19c4.63 1.93 10.2 3.82 19.76 3.82 10.86 0 16.57-2.45 21.6-4.6 4.42-1.9 7.91-3.4 15.7-3.4 7.79 0 11.28 1.5 15.7 3.4 5.03 2.15 10.74 4.6 21.6 4.6 10.88 0 16.6-2.45 21.63-4.6 4.43-1.9 7.92-3.4 15.72-3.4zm20.09-101.54a16.53 16.53 0 0 1 21.4-9.31A16.58 16.58 0 0 1 320.7 48h-34.4l2.56-6.54zM71.08 63l320.87-.02c.02.03.06.1.03.14l-51.02 64.93c-9.25.35-14.46 2.57-19.1 4.56-4.42 1.9-7.92 3.4-15.73 3.4-7.8 0-11.3-1.5-15.73-3.4a52.4 52.4 0 0 0-10.59-3.57l15.24-38.8a7.5 7.5 0 0 0-13.96-5.48l-17.06 43.42c-7.9.59-12.64 2.6-16.89 4.43-4.42 1.9-7.92 3.4-15.71 3.4-7.79 0-11.28-1.5-15.7-3.4-5.04-2.16-10.74-4.6-21.61-4.6s-16.57 2.44-21.6 4.6c-4.43 1.9-7.92 3.4-15.7 3.4-7.8 0-11.28-1.5-15.7-3.4-4.64-1.99-9.84-4.21-19.1-4.56L71 63.11c0-.04.04-.1.09-.1zm175.5 385h-30.15a63.93 63.93 0 0 0 15.07-18.6 63.89 63.89 0 0 0 15.08 18.6z" />
        <path d="m249.66 164.76-25.14 64a7.5 7.5 0 1 0 13.96 5.48l25.14-64a7.5 7.5 0 1 0-13.96-5.48z" />
      </svg>
    ),
    recipes: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className={clsx('icon-svg', className && `${className}-svg`)}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      >
        <path
          fillRule="evenodd"
          d="M9 7.5a3 3 0 1 1 6 0h.75a3 3 0 1 1 0 6H15v2.25H9V13.5h-.75a3 3 0 1 1 0-6H9ZM7.75 6.03a4.5 4.5 0 0 1 8.5 0 4.5 4.5 0 0 1 .25 8.9v4.57l-.75.75h-7.5l-.75-.75v-4.56a4.5 4.5 0 0 1 .25-8.91ZM9 18.75v-1.5h6v1.5H9Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    calculator: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className={clsx('icon-svg', className && `${className}-svg`)}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      >
        <path
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m17.5 6.5-11 11m2-7v-4m-2 2h4m3 7h4M7.8 21h8.4c1.68 0 2.52 0 3.16-.33a3 3 0 0 0 1.31-1.3c.33-.65.33-1.49.33-3.17V7.8c0-1.68 0-2.52-.33-3.16a3 3 0 0 0-1.3-1.31C18.71 3 17.87 3 16.2 3H7.8c-1.68 0-2.52 0-3.16.33a3 3 0 0 0-1.31 1.3C3 5.29 3 6.13 3 7.8v8.4c0 1.68 0 2.52.33 3.16a3 3 0 0 0 1.3 1.31c.65.33 1.49.33 3.17.33Z"
        />
      </svg>
    ),
    shopping: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className={clsx('icon-svg', className && `${className}-svg`)}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
      >
        <path d="M30 12.75h-5.27L19.14 2.41a1.25 1.25 0 1 0-2.2 1.19l4.95 9.15H10.15l5-9.15a1.25 1.25 0 0 0-2.2-1.2L7.3 12.75H2a1.25 1.25 0 0 0 0 2.5h.95l1.86 13.92c.08.61.6 1.08 1.23 1.08h20c.64 0 1.16-.47 1.24-1.08l1.86-13.92H30a1.25 1.25 0 0 0 0-2.5zm-5.05 15H7.14l-1.67-12.5h21.15zm-8.9-11h-.01c-.69 0-1.25.56-1.25 1.24l-.04 7a1.25 1.25 0 1 0 2.5 0v.02l.04-7c0-.7-.56-1.26-1.24-1.26zm-4.98 0c-.7 0-1.26.56-1.26 1.24l-.03 7c0 .7.55 1.26 1.24 1.26.7 0 1.25-.56 1.26-1.24l.03-7V18c0-.69-.56-1.25-1.24-1.25zm9.95 0c-.7 0-1.25.56-1.26 1.24l-.03 7a1.25 1.25 0 0 0 2.5.02l.03-7V18c0-.69-.55-1.25-1.24-1.25z" />
      </svg>
    )
    // TODO: Add other icons...
  };

  return <div className={clsx('icon', className && className)}>{icons[name]}</div>;
};

export { Icon };
export type { IconProps };
