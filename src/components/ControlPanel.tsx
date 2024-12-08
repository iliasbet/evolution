import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPaused,
  setSpeed,
  setSelectedFitnessFunction,
  setMutationConfig,
  updateViewConfig,
  resetSimulation
} from '../store/evolutionSlice';
import { RootState } from '../store/store';
import { FitnessCalculator } from '../core/fitnessCalculator';
import { MutationConfig } from '../types/evolution';
import {
  Box,
  Button,
  Slider,
  Select,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  FastForward,
  FastRewind,
  RestartAlt,
  Help
} from '@mui/icons-material';

const ControlPanel: React.FC = () => {
  const dispatch = useDispatch();
  const {
    paused,
    speed,
    selectedFitnessFunction,
    mutationConfig,
    viewConfig,
    generation,
    currentOrganism,
    fitnessHistory
  } = useSelector((state: RootState) => state.evolution);

  const fitnessCalculator = FitnessCalculator.getInstance();
  const fitnessFunctions = fitnessCalculator.getAllFunctions();

  const handleSpeedChange = (_: Event, value: number | number[]) => {
    dispatch(setSpeed(value as number));
  };

  const handleMutationConfigChange = (key: keyof MutationConfig, value: number | boolean) => {
    dispatch(setMutationConfig({ [key]: value }));
  };

  const handleSliderChange = (key: keyof MutationConfig) => (_: Event, value: number | number[]) => {
    handleMutationConfigChange(key, value as number);
  };

  const handleViewModeChange = (mode: 'phenotype' | 'multiway' | 'morphospace') => {
    dispatch(updateViewConfig({ viewMode: mode }));
  };

  const handleFitnessFunctionChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSelectedFitnessFunction(event.target.value));
  };

  const handleSwitchChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateViewConfig({ [key]: event.target.checked }));
  };

  const currentFitness = currentOrganism?.fitness || 0;
  const bestFitness = Math.max(...fitnessHistory, 0);

  return (
    <Box sx={{ p: 2, width: 300, bgcolor: 'background.paper' }}>
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Evolution Controls
        </Typography>
        <Tooltip title="Help">
          <IconButton size="small" sx={{ ml: 'auto' }}>
            <Help />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Simulation Controls */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Simulation Controls
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <IconButton onClick={() => dispatch(setPaused(!paused))}>
            {paused ? <PlayArrow /> : <Pause />}
          </IconButton>
          <IconButton>
            <FastRewind />
          </IconButton>
          <IconButton>
            <FastForward />
          </IconButton>
          <IconButton onClick={() => dispatch(resetSimulation())}>
            <RestartAlt />
          </IconButton>
        </Box>
        <Typography variant="body2" gutterBottom>
          Speed
        </Typography>
        <Slider
          value={speed}
          onChange={handleSpeedChange}
          min={0.1}
          max={5}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Fitness Function */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Fitness Function
        </Typography>
        <Select
          fullWidth
          value={selectedFitnessFunction}
          onChange={handleFitnessFunctionChange}
          size="small"
        >
          {fitnessFunctions.map((func) => (
            <MenuItem key={func.id} value={func.id}>
              {func.name}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Current Fitness: {currentFitness.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Best Fitness: {bestFitness.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Mutation Controls */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Mutation Settings
        </Typography>
        <Typography variant="body2" gutterBottom>
          Mutation Rate
        </Typography>
        <Slider
          value={mutationConfig.rate}
          onChange={handleSliderChange('rate')}
          min={0}
          max={1}
          step={0.01}
          valueLabelDisplay="auto"
        />
        <Typography variant="body2" gutterBottom>
          Step Size
        </Typography>
        <Slider
          value={mutationConfig.stepSize}
          onChange={handleSliderChange('stepSize')}
          min={1}
          max={5}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
        <FormControlLabel
          control={
            <Switch
              checked={mutationConfig.allowMultiPoint}
              onChange={(e) => handleMutationConfigChange('allowMultiPoint', e.target.checked)}
            />
          }
          label="Allow Multi-point Mutations"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* View Controls */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          View Options
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Button
            variant={viewConfig.viewMode === 'phenotype' ? 'contained' : 'outlined'}
            onClick={() => handleViewModeChange('phenotype')}
            size="small"
          >
            Pattern
          </Button>
          <Button
            variant={viewConfig.viewMode === 'multiway' ? 'contained' : 'outlined'}
            onClick={() => handleViewModeChange('multiway')}
            size="small"
          >
            Graph
          </Button>
          <Button
            variant={viewConfig.viewMode === 'morphospace' ? 'contained' : 'outlined'}
            onClick={() => handleViewModeChange('morphospace')}
            size="small"
          >
            Space
          </Button>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={viewConfig.showBreakthroughs}
              onChange={handleSwitchChange('showBreakthroughs')}
            />
          }
          label="Show Breakthroughs"
        />
        <FormControlLabel
          control={
            <Switch
              checked={viewConfig.highlightActiveRules}
              onChange={handleSwitchChange('highlightActiveRules')}
            />
          }
          label="Highlight Active Rules"
        />
      </Box>

      {/* Statistics */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Statistics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generation: {generation}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Population Size: {currentOrganism ? 1 : 0}
        </Typography>
      </Box>
    </Box>
  );
};

export default ControlPanel; 