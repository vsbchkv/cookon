import { useState } from 'react';

import clsx from 'clsx';
import './ActionPanel.css';

type ActionPanelProps = {
  className?: string;
  children: React.ReactNode | string;
  collapsable?: boolean;
  onOpen?: () => void;
};
const ActionPanel: React.FC<ActionPanelProps> = ({ className, children, collapsable, onOpen }) => {
  const [opened, setOpened] = useState(false);
  return (
    <div
      className={clsx(
        'action-panel',
        collapsable && 'action-panel--collapsable',
        className,
        opened && 'action-panel--opened glow'
      )}
      {...(collapsable ? { 'aria-expanded': opened } : {})}
    >
      <div className='action-panel-content'>{children}</div>
      {collapsable && (
        <button
          type='button'
          onClick={() => {
            setOpened(!opened);
            if (!opened && onOpen) onOpen();
          }}
          className={clsx('action-panel-toggler', opened && 'action-panel--opened')}
          aria-pressed={opened}
        >
          &#8964;
        </button>
      )}
    </div>
  );
};

export { ActionPanel };
