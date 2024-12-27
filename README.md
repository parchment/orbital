# Orbital 💫

A web-based visualization of our solar system built with plain HTML, CSS, and JavaScript. The project aims to create both idealized and accurate representations of planetary motions, with interactive features for exploration and education. The visualization uses time scaling optimized for visual clarity rather than astronomical accuracy, allowing users to observe planetary motions at comfortable speeds while maintaining correct relative orbital periods.

## Current State

Version 0.2.3 implements:
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

## Directory Structure
```plaintext
orbital/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── README.md
└── LICENSE
```

## Project Goals

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

### Moon Systems
- [ ] Earth-Moon system
- [ ] Mars and its moons (Phobos, Deimos)
- [ ] Jupiter's Galilean moons
- [ ] Saturn's major moons
- [ ] "Zoom to detail" feature for examining moon systems

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

### Version 0.2.7 Changes
The current implementation adds:
- Accurate Keplerian orbital mechanics:
  - True elliptical orbits using polar form equations
  - Varying orbital speeds following Kepler's Second Law
  - Proper orbital inclinations and orientations
- Enhanced orbit visualization:
  - SVG-based orbit paths calculated from orbital parameters
  - 360-point path approximation for smooth curves
  - Smooth transitions between circular and elliptical modes
  - Proper orbital alignment with focal points
- Improved animation performance:
  - Optimized path calculation and updates
  - Smooth CSS transitions for mode changes
  - Efficient SVG path morphing

## Real-World Accuracy Notes

Key solar system characteristics implemented:

1. Orbital Distances (AU from Sun)
   - Mercury: 0.4
   - Venus: 0.7
   - Earth: 1.0
   - Mars: 1.5
   - Jupiter: 5.2
   - Saturn: 9.5
   - Uranus: 19.2
   - Neptune: 30.1

2. Orbital Periods (Earth years)
   - Mercury: 0.24
   - Venus: 0.62
   - Earth: 1.00
   - Mars: 1.88
   - Jupiter: 11.86
   - Saturn: 29.46
   - Uranus: 84.01
   - Neptune: 164.79

3. Orbital Eccentricities (now accurately visualized)
   - Mercury: 0.206 (most eccentric)
   - Venus: 0.007 (most circular)
   - Earth: 0.017
   - Mars: 0.093

## License

MIT License - Free to use, modify, and distribute with attribution