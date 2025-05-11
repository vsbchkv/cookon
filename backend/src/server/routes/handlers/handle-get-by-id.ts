import { FastifyReply, FastifyRequest } from 'fastify';
import { StateManager } from '../../../config/managers';

const handleGetDataById =
  ({ getItemByID: getItemByID }: StateManager) =>
  async (
    request: FastifyRequest<{ Params: { directory: string; id: string } }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { method, params } = request;
    const { id } = params;
    try {
      const result = await getItemByID(id);
      if (result) {
        reply.send(result);
      } else {
        reply.status(404).send({ error: 'Not Found' });
      }
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }

    // {
    //   return async (
    //     request: FastifyRequest<{ Params: { directory: string; id: string } }>,
    //     reply: FastifyReply
    //   ): Promise<void> => {
    //     const { method, params } = request;
    //     const { directory, id } = params;
    //     const path = resolvePath(DIRS.databases, directory, id);
    //     if (await testAccess(path)) {
    //       if (method === 'DELETE') {
    //         await unlink(path);
    //       }
    //       if (method === 'GET') {
    //         await readJson(resolvePath(`${DIRS.databases}/${directory}/${id}`))
    //           .then((data) => {
    //             reply.send(data);
    //           })
    //           .catch(() => {
    //             reply.status(404); // TODO: Err handler
    //             return;
    //           });
    //       }
    //     }
    //   };
    // }
  };

export { handleGetDataById };
