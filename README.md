# Orbital 💫

A web-based visualization of our solar system built with plain HTML, CSS, and JavaScript. The project aims to create both idealized and accurate representations of planetary motions, with interactive features for exploration and education. The visualization uses time scaling optimized for visual clarity rather than astronomical accuracy, allowing users to observe planetary motions at comfortable speeds while maintaining correct relative orbital periods.

## Current State

Version 0.2.4 implements:
- Modular architecture with separated concerns
- Interactive time control slider for orbit speed adjustment
- Visualization-focused time scaling (4 minutes to 12 seconds per Earth orbit)
- Linear speed progression for intuitive control
- Time display in minutes/seconds per orbit
- Smooth transitions between view modes with coordinated animations
- Centralized configuration system for different view modes
- Enhanced planet property management
- Accurate Keplerian orbital motion
- Precise elliptical orbit visualization with SVG paths
- All inner planets (Mercury through Mars)
- Mode toggle between simple and realistic views

## Project Structure

```plaintext
orbital/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── constants.js     (Configuration and constants)
│   ├── time.js         (Time management)
│   ├── planet.js       (Planet visualization and physics)
│   ├── system.js (Overall system management)
│   └── script.js       (Entry point and initialization)
├── README.md
└── LICENSE
```

### Module Organization

The project now follows a modular architecture with clear separation of concerns:

- **constants.js**: Central configuration store
  - Time constants
  - Orbital parameters
  - View mode configurations
  - Calculation constants
  - Transition timing values

- **time.js**: Time management module
  - Time scaling controls
  - Pause/resume functionality
  - Delta time calculations
  - Speed adjustments

- **planet.js**: Planet management
  - Individual planet visualization
  - Orbital calculations
  - SVG path generation
  - Position updates

- **system.js**: System coordinator
  - Planet initialization
  - Mode transitions
  - Animation management
  - System-wide updates

- **script.js**: Main entry point
  - DOM initialization
  - Event handling
  - User interface controls
  - System bootstrapping

## Features

### Visual Features
- [x] Basic circular orbital motion
- [x] Smooth mode transitions with coordinated animations
- [x] Correct orbital periods and speeds
- [x] Elliptical orbits with proper Keplerian motion
- [ ] Complete solar system (all planets + dwarf planets)
- [ ] Accurate relative distances between orbits
- [ ] Accurate planet sizes (with toggle for enhanced visibility)
- [x] Proper orbital inclinations and eccentricities
- [ ] Planetary axial tilts

### Interactive Features
- [x] Toggle between idealized (circular) and realistic modes
- [x] Smooth transitions between view modes
- [x] Time control slider with intuitive speed adjustment
- [ ] Scale controls for distance/size representation
- [ ] Information panels for celestial bodies
- [ ] Camera controls for viewing angle
- [ ] Dynamic "zoom to scale" feature
- [ ] Pause/resume controls
- [ ] Preset speed buttons

### Educational Features
- [x] Comparison mode for orbit shapes
- [x] Visual representation of Kepler's laws
- [x] Orbital period relationships
- [ ] Eclipse and transit predictions
- [ ] Historical positions calculator

## Technical Implementation

### Version 0.2.4 Changes
The current implementation adds:
- Modular codebase organization:
  - Separated concerns into distinct modules
  - Clear module responsibilities
  - Improved code maintainability
  - Better testing capabilities
- Enhanced configuration management:
  - Centralized constants
  - Organized parameter groups
  - Easy customization points
- Improved transition handling:
  - Coordinated animations
  - Smooth mode changes
  - Better state management

### Real-World Accuracy

Key solar system characteristics implemented:

1. Orbital Distances (AU from Sun)
   - Mercury: 0.4
   - Venus: 0.7
   - Earth: 1.0
   - Mars: 1.5

2. Orbital Periods (Earth years)
   - Mercury: 0.24
   - Venus: 0.62
   - Earth: 1.00
   - Mars: 1.88

3. Orbital Eccentricities
   - Mercury: 0.206 (most eccentric)
   - Venus: 0.007 (most circular)
   - Earth: 0.017
   - Mars: 0.093

## Getting Started

1. Clone the repository
2. No build process required - pure HTML, CSS, and JavaScript
3. Serve the files using any web server
4. Open index.html in a modern browser

## Browser Support

The application uses modern JavaScript features including:
- ES6 Modules
- CSS Grid
- RequestAnimationFrame
- SVG Manipulation

Requires a modern browser with support for these features.

## License

MIT License - Free to use, modify, and distribute with attribution