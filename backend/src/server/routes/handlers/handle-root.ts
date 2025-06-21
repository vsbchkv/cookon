import { FastifyReply, FastifyRequest } from 'fastify';
import { IndexData } from '../../../config/shared-data/types';
import { StateManager } from '../../../config/managers';
import { StateType } from '../../../config/managers/state-manager';
export const handleRoot = (stateManager: StateManager) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const { indexes }: StateType = stateManager.getState();
      const indexData: IndexData = { recipes: indexes.recipes.dataIndex, ingredients: indexes.ingredients.dataIndex };
      console.log('ROOT', indexData);

      reply.send({ success: true, data: indexData });
      // reply.send(indexData);
    } catch {
      reply.status(500).send({ success: false, message: 'Internal Server Error' });
    }
  };
};
