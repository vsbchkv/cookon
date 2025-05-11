import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialData } from '../../types';

type DataState = {
  data: null | InitialData;
  isLoading: boolean;
};

const initialState: DataState = {
  data: null,
  isLoading: false
};

// TODO: name for the slice should be more specific?
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<InitialData>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

const { setData, setLoading } = dataSlice.actions;
const selectData = (state: { data: DataState }) => state.data.data;
const selectDataLoading = (state: { data: DataState }) => state.data.isLoading;
export { dataSlice, setData, setLoading, selectData, selectDataLoading };
