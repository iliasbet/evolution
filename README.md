# Evolution Explorer

A web-based simulation of cellular automaton-based evolution, demonstrating the principles of computational irreducibility and adaptive systems.

## Features

- **Interactive Evolution Simulation**: Watch cellular patterns evolve in real-time
- **Multiple Fitness Functions**: Choose from various criteria to guide evolution
- **Customizable Mutations**: Control mutation rates and complexity
- **Multiple Visualization Modes**:
  - Pattern View: Direct visualization of cellular automata
  - Graph View: Evolutionary relationships
  - Morphospace: Pattern space exploration
- **Preset Scenarios**: Start with pre-configured evolutionary setups
- **Real-time Statistics**: Track fitness improvements and evolutionary progress

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/evolution-explorer.git
cd evolution-explorer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Usage Guide

### Basic Controls

- **Play/Pause**: Start or stop the evolution simulation
- **Speed Control**: Adjust the rate of evolution
- **Reset**: Start fresh with a new population

### Fitness Functions

- **Maximum Height**: Favors tall patterns
- **Maximum Width**: Favors wide patterns
- **Golden Ratio**: Favors patterns with proportions close to the golden ratio
- **Pattern Density**: Favors specific cell densities
- **Symmetry Score**: Favors symmetrical patterns

### Mutation Settings

- **Mutation Rate**: Controls how often rules change
- **Step Size**: Determines how many bits can change in one mutation
- **Multi-point Mutations**: Enables complex rule changes

### Views

- **Pattern View**: Direct visualization of the cellular automaton
- **Graph View**: Shows evolutionary relationships between organisms
- **Morphospace**: Visualizes the space of possible forms

## Technical Details

### Architecture

- **Frontend**: React with TypeScript
- **State Management**: Redux Toolkit
- **Visualization**: Pixi.js for efficient canvas rendering
- **UI Components**: Material-UI (MUI)

### Core Components

- `SimulationEngine`: Handles cellular automaton evolution
- `FitnessCalculator`: Computes fitness scores
- `NavigationBar`: Main app navigation and scenario selection
- `ControlPanel`: Evolution parameters and visualization controls
- `SimulationCanvas`: Main visualization area

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Stephen Wolfram's work on cellular automata and evolution
- Built with modern web technologies and open-source libraries
