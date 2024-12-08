import { Grid, Organism, Rule, MutationConfig } from '../types/evolution';
import { v4 as uuidv4 } from 'uuid';

export class SimulationEngine {
  private static instance: SimulationEngine;
  
  private constructor() {}
  
  public static getInstance(): SimulationEngine {
    if (!SimulationEngine.instance) {
      SimulationEngine.instance = new SimulationEngine();
    }
    return SimulationEngine.instance;
  }

  public createInitialGrid(width: number, height: number): Grid {
    return Array(height).fill(0).map(() => 
      Array(width).fill(0).map(() => Math.random() > 0.8 ? 1 : 0)
    );
  }

  public createRandomRules(count: number): Rule[] {
    return Array(count).fill(0).map(() => ({
      id: uuidv4(),
      pattern: Array(8).fill(0).map(() => Math.random() > 0.5 ? 1 : 0),
      nextState: Math.random() > 0.5 ? 1 : 0
    }));
  }

  public evolveGrid(grid: Grid, rules: Rule[]): Grid {
    const newGrid: Grid = Array(grid.length).fill(0)
      .map(() => Array(grid[0].length).fill(0));

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        const neighborhood = this.getNeighborhood(grid, x, y);
        const matchingRule = this.findMatchingRule(neighborhood, rules);
        newGrid[y][x] = matchingRule ? matchingRule.nextState : 0;
      }
    }

    return newGrid;
  }

  private getNeighborhood(grid: Grid, x: number, y: number): number[] {
    const neighborhood: number[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const ny = (y + dy + grid.length) % grid.length;
        const nx = (x + dx + grid[0].length) % grid[0].length;
        neighborhood.push(grid[ny][nx]);
      }
    }
    return neighborhood;
  }

  private findMatchingRule(neighborhood: number[], rules: Rule[]): Rule | null {
    return rules.find(rule => 
      rule.pattern.every((bit, i) => bit === neighborhood[i])
    ) || null;
  }

  public mutateRules(rules: Rule[], config: MutationConfig): Rule[] {
    return rules.map(rule => {
      if (Math.random() > config.rate) return rule;

      const newPattern = [...rule.pattern];
      const mutations = Math.floor(Math.random() * config.stepSize) + 1;
      
      for (let i = 0; i < mutations && config.allowMultiPoint; i++) {
        const index = Math.floor(Math.random() * newPattern.length);
        newPattern[index] = newPattern[index] === 0 ? 1 : 0;
      }

      return {
        id: uuidv4(),
        pattern: newPattern,
        nextState: Math.random() < 0.1 ? (rule.nextState === 0 ? 1 : 0) : rule.nextState
      };
    });
  }

  public createOrganism(grid: Grid, rules: Rule[], generation: number = 0, fitness: number = 0): Organism {
    return {
      id: uuidv4(),
      grid,
      rules,
      generation,
      fitness
    };
  }
} 