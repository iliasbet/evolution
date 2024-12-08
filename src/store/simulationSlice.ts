import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulationState, Organism, MutationConfig } from '../types/evolution';

const initialState: SimulationState = {
  currentOrganism: null,
  generation: 0,
  history: [],
  fitnessHistory: [],
  paused: true,
  speed: 1,
  selectedFitnessFunction: 'maxHeight',
  mutationConfig: {
    rate: 0.1,
    stepSize: 1,
    allowMultiPoint: false
  }
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setCurrentOrganism: (state, action: PayloadAction<Organism>) => {
      state.currentOrganism = action.payload;
    },
    addToHistory: (state, action: PayloadAction<Organism>) => {
      state.history.push(action.payload);
      state.fitnessHistory.push(action.payload.fitness);
      state.generation = action.payload.generation;
    },
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.paused = action.payload;
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    setSelectedFitnessFunction: (state, action: PayloadAction<string>) => {
      state.selectedFitnessFunction = action.payload;
    },
    setMutationConfig: (state, action: PayloadAction<Partial<MutationConfig>>) => {
      state.mutationConfig = { ...state.mutationConfig, ...action.payload };
    },
    resetSimulation: () => {
      return initialState;
    },
  },
});

export const {
  setCurrentOrganism,
  addToHistory,
  setPaused,
  setSpeed,
  setSelectedFitnessFunction,
  setMutationConfig,
  resetSimulation,
} = simulationSlice.actions;

export default simulationSlice.reducer; 