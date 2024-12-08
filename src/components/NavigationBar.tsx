import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box
} from '@mui/material';
import {
  Help,
  AccountCircle,
  Science,
  MenuBook
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { SimulationEngine } from '../core/simulationEngine';
import { setCurrentOrganism, resetSimulation } from '../store/evolutionSlice';

interface ScenarioConfig {
  id: string;
  name: string;
  gridSize: number;
}

const presetScenarios: ScenarioConfig[] = [
  { id: 'simple', name: 'Simple Growth', gridSize: 20 },
  { id: 'complex', name: 'Complex Patterns', gridSize: 30 },
  { id: 'random', name: 'Random Seed', gridSize: 25 }
];

const NavigationBar: React.FC = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const simulationEngine = SimulationEngine.getInstance();

  const handleScenarioSelect = (scenario: ScenarioConfig) => {
    dispatch(resetSimulation());
    const grid = simulationEngine.createInitialGrid(scenario.gridSize, scenario.gridSize);
    const rules = simulationEngine.createRandomRules(8);
    const organism = simulationEngine.createOrganism(grid, rules);
    dispatch(setCurrentOrganism(organism));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHelpOpen = () => {
    setHelpOpen(true);
  };

  const handleHelpClose = () => {
    setHelpOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Science sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Evolution Explorer
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<MenuBook />}
              onClick={handleMenuOpen}
            >
              Scenarios
            </Button>
          </Box>

          <IconButton color="inherit" onClick={handleHelpOpen}>
            <Help />
          </IconButton>

          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Scenarios Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {presetScenarios.map((scenario) => (
          <MenuItem
            key={scenario.id}
            onClick={() => handleScenarioSelect(scenario)}
          >
            {scenario.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Help Dialog */}
      <Dialog
        open={helpOpen}
        onClose={handleHelpClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Welcome to Evolution Explorer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This application simulates evolution using cellular automata. Here's how to use it:
          </DialogContentText>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Basic Controls
          </Typography>
          <DialogContentText>
            • Play/Pause: Start or stop the simulation<br />
            • Speed: Adjust how fast the generations evolve<br />
            • Reset: Start over with a new population
          </DialogContentText>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Fitness Functions
          </Typography>
          <DialogContentText>
            • Maximum Height: Favors tall patterns<br />
            • Maximum Width: Favors wide patterns<br />
            • Golden Ratio: Favors patterns with proportions close to the golden ratio<br />
            • Pattern Density: Favors patterns with specific cell density<br />
            • Symmetry Score: Favors symmetrical patterns
          </DialogContentText>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Mutation Settings
          </Typography>
          <DialogContentText>
            • Mutation Rate: How often rules change<br />
            • Step Size: How many bits can change in one mutation<br />
            • Multi-point Mutations: Allow multiple rule changes at once
          </DialogContentText>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Views
          </Typography>
          <DialogContentText>
            • Pattern View: See the current organism<br />
            • Graph View: Visualize evolutionary relationships<br />
            • Morphospace: Explore the space of possible forms
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelpClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavigationBar; 