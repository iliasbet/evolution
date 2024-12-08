export type Cell = 0 | 1;
export type Grid = Cell[][];

export interface Rule {
  id: string;
  pattern: number[];
  nextState: Cell;
}

export interface Organism {
  id: string;
  grid: Grid;
  rules: Rule[];
  generation: number;
  fitness: number;
  parent?: string;
}

export interface FitnessFunction {
  id: string;
  name: string;
  calculate: (grid: Grid) => number;
}

export interface MutationConfig {
  rate: number;
  stepSize: number;
  allowMultiPoint: boolean;
}

export interface SimulationState {
  currentOrganism: Organism | null;
  generation: number;
  history: Organism[];
  fitnessHistory: number[];
  paused: boolean;
  speed: number;
  selectedFitnessFunction: string;
  mutationConfig: MutationConfig;
}

export interface ViewConfig {
  showBreakthroughs: boolean;
  highlightActiveRules: boolean;
  viewMode: 'phenotype' | 'multiway' | 'morphospace';
  zoom: number;
  pan: { x: number; y: number };
} 