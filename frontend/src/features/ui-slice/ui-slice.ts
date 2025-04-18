import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  currentView: string;
  cubeTransition: boolean;
};

const initialState: UiState = {
  currentView: 'home',
  cubeTransition: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    setCubeTransition: (state, action: PayloadAction<boolean>) => {
      state.cubeTransition = action.payload;
    }
  }
});

const { setCurrentView, setCubeTransition } = uiSlice.actions;
const selectCurrentView = (state: { ui: UiState }) => state.ui.currentView;
const selectCubeTransition = (state: { ui: UiState }) => state.ui.cubeTransition;
export { uiSlice, setCurrentView, setCubeTransition, selectCurrentView, selectCubeTransition };
