import { FastifyReply, FastifyRequest } from 'fastify';
import { StateManager } from '../../../config/managers';
import { StateType } from '../../../config/managers/state-manager';
export const handleRoot = (stateManager: StateManager) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const { indexes }: StateType = stateManager.getState();
      const initialData = { recipes: indexes.recipes.dataIndex, ingredients: indexes.ingredients.dataIndex };
      console.log('ROOT', initialData);

      // reply.send({ success: true, data: initialData });
      reply.send(initialData);
    } catch {
      reply.status(500).send({ success: false, message: 'Internal Server Error' });
    }
  };
};
