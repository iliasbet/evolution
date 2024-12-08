import { configureStore } from '@reduxjs/toolkit';
import evolutionReducer from './evolutionSlice';

export const store = configureStore({
  reducer: {
    evolution: evolutionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 