import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulationState, Organism, MutationConfig, ViewConfig } from '../types/evolution';

const initialState: SimulationState & { viewConfig: ViewConfig } = {
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
  },
  viewConfig: {
    showBreakthroughs: true,
    highlightActiveRules: false,
    viewMode: 'phenotype',
    zoom: 1,
    pan: { x: 0, y: 0 }
  }
};

const evolutionSlice = createSlice({
  name: 'evolution',
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
    updateViewConfig: (state, action: PayloadAction<Partial<ViewConfig>>) => {
      state.viewConfig = { ...state.viewConfig, ...action.payload };
    },
    resetSimulation: (state) => {
      state.currentOrganism = null;
      state.generation = 0;
      state.history = [];
      state.fitnessHistory = [];
      state.paused = true;
    }
  }
});

export const {
  setCurrentOrganism,
  addToHistory,
  setPaused,
  setSpeed,
  setSelectedFitnessFunction,
  setMutationConfig,
  updateViewConfig,
  resetSimulation
} = evolutionSlice.actions;

export default evolutionSlice.reducer; 