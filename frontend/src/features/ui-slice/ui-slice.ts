import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  currentView: string;
  cubeTransition: boolean;
  layoutElements: {
    logo: string;
    pageTitle: string;
  };
};

const initialState: UiState = {
  currentView: 'home',
  layoutElements: {
    logo: '',
    pageTitle: ''
  },
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
    },
    setLayoutElements: (state, action: PayloadAction<{ logo: string; pageTitle: string }>) => {
      state.layoutElements = action.payload;
    }
  }
});

const { setCurrentView, setCubeTransition, setLayoutElements } = uiSlice.actions;
const selectCurrentView = (state: { ui: UiState }) => state.ui.currentView;
const selectCubeTransition = (state: { ui: UiState }) => state.ui.cubeTransition;
const selectLayoutElements = (state: { ui: UiState }) => state.ui.layoutElements;

export {
  uiSlice,
  setCurrentView,
  setCubeTransition,
  setLayoutElements,
  selectCurrentView,
  selectCubeTransition,
  selectLayoutElements
};
