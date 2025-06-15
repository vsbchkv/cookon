import { Timer } from './timer/Timer';
import { ActionPanel } from '../../../../action-panel/ActionPanel';

import type { Recipe } from '../../../../../shared-data/types';
import './RecipeMethod.css';

type RecipeMethodProps = {
  method: Recipe['method'][number];
  key: React.Key;
};

const RecipeMethod: React.FC<RecipeMethodProps> = ({ method, key }) => {
  return (
    <li key={key} className="recipe-list-item recipe-method">
      {method.description}

      <ActionPanel className="recipe-method-actions">
        {!!Number(method.time) && <Timer time={Number(method.time)} />}
        <input className="checkbox action-panel-complete" type="checkbox" />
      </ActionPanel>
    </li>
  );
};

export { RecipeMethod };
