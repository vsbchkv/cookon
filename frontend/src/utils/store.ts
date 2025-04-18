import { configureStore } from '@reduxjs/toolkit';

import { dataApi } from '../features/data-api/data-api-slice';
import { dataSlice } from '../features/data-slice/data-slice';
import { uiSlice } from '../features/ui-slice/ui-slice';

export const store = configureStore({
  reducer: {
    [dataApi.reducerPath]: dataApi.reducer,
    [dataSlice.reducerPath]: dataSlice.reducer,
    [uiSlice.reducerPath]: uiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(dataApi.middleware);
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
