import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createPostMutation, createDeleteMutation, createFetchByIdQuery } from '../../utils/utils';
import { Item, InitialData } from '../../types';

// type ApiResponse<T> = {
//   data: T;
//   // Add other potential response fields like status, message etc if needed
// };

const DATA_URL = 'http://192.168.0.15:3000/';
const ENDPOINTS = {
  root: '/',
  recipes: '/recipes/'
};

export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: DATA_URL }),
  endpoints: (builder) => ({
    fetchInitialData: builder.query<InitialData, void>({
      query: () => ENDPOINTS.root
    }),

    fetchItemById: builder.query({ query: createFetchByIdQuery(ENDPOINTS.recipes) }),
    createItem: builder.mutation<Item | Partial<Item>, { item: Item; endpoint: string }>({
      query: ({ item, endpoint }) => createPostMutation(endpoint, item)
    }),

    deleteItem: builder.mutation<void, string>({
      query: createDeleteMutation(ENDPOINTS.recipes)
    })
  })
});

export const { useFetchInitialDataQuery, useCreateItemMutation, useDeleteItemMutation, useFetchItemByIdQuery } =
  dataApi;
