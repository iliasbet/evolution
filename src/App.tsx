import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import NavigationBar from './components/NavigationBar';
import ControlPanel from './components/ControlPanel';
import SimulationCanvas from './components/SimulationCanvas';
import { RootState } from './store/store';
import { SimulationEngine } from './core/simulationEngine';
import { FitnessCalculator } from './core/fitnessCalculator';
import { setCurrentOrganism, addToHistory } from './store/evolutionSlice';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const App: React.FC = () => {
  const dispatch = useDispatch();
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  
  const {
    currentOrganism,
    paused,
    speed,
    selectedFitnessFunction,
    mutationConfig
  } = useSelector((state: RootState) => state.evolution);

  const simulationEngine = SimulationEngine.getInstance();
  const fitnessCalculator = FitnessCalculator.getInstance();

  useEffect(() => {
    // Initialize with a random organism
    if (!currentOrganism) {
      const grid = simulationEngine.createInitialGrid(30, 30);
      const rules = simulationEngine.createRandomRules(8);
      const organism = simulationEngine.createOrganism(grid, rules);
      dispatch(setCurrentOrganism(organism));
    }
  }, []);

  useEffect(() => {
    const updateSimulation = (timestamp: number) => {
      if (!currentOrganism || paused) {
        animationFrameRef.current = requestAnimationFrame(updateSimulation);
        return;
      }

      const deltaTime = timestamp - lastUpdateTimeRef.current;
      const updateInterval = 1000 / speed; // Convert speed to milliseconds

      if (deltaTime >= updateInterval) {
        // Evolve the current organism
        const newGrid = simulationEngine.evolveGrid(currentOrganism.grid, currentOrganism.rules);
        
        // Calculate fitness
        const fitness = fitnessCalculator.calculateFitness(newGrid, selectedFitnessFunction);
        
        // Create new organism
        const newOrganism = simulationEngine.createOrganism(
          newGrid,
          simulationEngine.mutateRules(currentOrganism.rules, mutationConfig),
          currentOrganism.generation + 1,
          fitness
        );

        // Update state
        dispatch(setCurrentOrganism(newOrganism));
        dispatch(addToHistory(newOrganism));
        
        lastUpdateTimeRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    };

    animationFrameRef.current = requestAnimationFrame(updateSimulation);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentOrganism, paused, speed, selectedFitnessFunction, mutationConfig]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <NavigationBar />
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <SimulationCanvas
              width={window.innerWidth - 300}
              height={window.innerHeight - 64}
            />
          </Box>
          <ControlPanel />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
