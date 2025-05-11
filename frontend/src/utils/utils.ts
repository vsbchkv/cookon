export const createFetchByIdQuery = (endpoint: string) => (id: string) => `${endpoint}${id}`;

export const createPostMutation = <T>(endpoint: string, newItem: T) => ({
  url: `/create/${endpoint}/`,
  method: 'POST',
  body: newItem
});

export const createDeleteMutation = (endpoint: string) => (id: string) => ({
  url: `${endpoint}${id}`,
  method: 'DELETE'
});
