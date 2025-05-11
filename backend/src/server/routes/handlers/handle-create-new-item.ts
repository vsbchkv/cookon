import { FastifyReply, FastifyRequest } from 'fastify';
import { Categories } from '../../../config/managers/state-manager';
import { Item } from '../../../config/shared-data/types';
import { StateManager } from '../../../config/managers';

const handleCreateNewItem = <T extends Item>({ createItem }: StateManager) => {
  return async (request: FastifyRequest<{ Params: { category: Categories } }>, reply: FastifyReply): Promise<void> => {
    const { category = 'recipes' } = request.params; // TODO: hardcoded. fix in front
    const incomingData = <T>request.body;

    const itemRequest = { ...incomingData };
    try {
      console.log('incomingData:', incomingData);

      const newItem = await createItem(category, itemRequest).catch((e) => console.log(e));
      console.log('Created: ', newItem?.id);

      reply.status(201).send({ message: 'Item created successfully', data: newItem });
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create item' });
    }
  };
};

export { handleCreateNewItem };
