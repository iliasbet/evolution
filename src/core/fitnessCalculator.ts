import { Grid, FitnessFunction } from '../types/evolution';

export class FitnessCalculator {
  private static instance: FitnessCalculator;
  private functions: Map<string, FitnessFunction>;

  private constructor() {
    this.functions = new Map();
    this.initializeFunctions();
  }

  public static getInstance(): FitnessCalculator {
    if (!FitnessCalculator.instance) {
      FitnessCalculator.instance = new FitnessCalculator();
    }
    return FitnessCalculator.instance;
  }

  private initializeFunctions() {
    this.registerFunction({
      id: 'maxHeight',
      name: 'Maximum Height',
      calculate: (grid: Grid) => {
        for (let y = grid.length - 1; y >= 0; y--) {
          if (grid[y].some(cell => cell === 1)) {
            return y + 1;
          }
        }
        return 0;
      }
    });

    this.registerFunction({
      id: 'maxWidth',
      name: 'Maximum Width',
      calculate: (grid: Grid) => {
        let maxWidth = 0;
        for (let y = 0; y < grid.length; y++) {
          const width = grid[y].filter(cell => cell === 1).length;
          maxWidth = Math.max(maxWidth, width);
        }
        return maxWidth;
      }
    });

    this.registerFunction({
      id: 'aspectRatio',
      name: 'Golden Ratio',
      calculate: (grid: Grid) => {
        let minY = grid.length, maxY = 0;
        let minX = grid[0].length, maxX = 0;
        let hasLiveCells = false;

        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === 1) {
              hasLiveCells = true;
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
            }
          }
        }

        if (!hasLiveCells) return 0;

        const height = maxY - minY + 1;
        const width = maxX - minX + 1;
        const goldenRatio = 1.618033988749895;
        return 1 / (1 + Math.abs(height / width - goldenRatio));
      }
    });

    this.registerFunction({
      id: 'density',
      name: 'Pattern Density',
      calculate: (grid: Grid) => {
        let liveCells = 0;
        let total = grid.length * grid[0].length;
        
        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === 1) liveCells++;
          }
        }

        return liveCells / total;
      }
    });

    this.registerFunction({
      id: 'symmetry',
      name: 'Symmetry Score',
      calculate: (grid: Grid) => {
        let score = 0;
        const height = grid.length;
        const width = grid[0].length;

        // Horizontal symmetry
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width / 2; x++) {
            if (grid[y][x] === grid[y][width - 1 - x]) score++;
          }
        }

        // Vertical symmetry
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height / 2; y++) {
            if (grid[y][x] === grid[height - 1 - y][x]) score++;
          }
        }

        const maxScore = (height * width) / 2;
        return score / maxScore;
      }
    });
  }

  public registerFunction(func: FitnessFunction) {
    this.functions.set(func.id, func);
  }

  public getFunction(id: string): FitnessFunction | undefined {
    return this.functions.get(id);
  }

  public getAllFunctions(): FitnessFunction[] {
    return Array.from(this.functions.values());
  }

  public calculateFitness(grid: Grid, functionId: string): number {
    const func = this.functions.get(functionId);
    if (!func) throw new Error(`Fitness function ${functionId} not found`);
    return func.calculate(grid);
  }
} 