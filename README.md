# Orbital 💫

A web-based visualization of our solar system built with plain HTML, CSS, and JavaScript. The project aims to create both idealized and accurate representations of planetary motions, with interactive features for exploration and education. The visualization uses time scaling optimized for visual clarity rather than astronomical accuracy, allowing users to observe planetary motions at comfortable speeds while maintaining correct relative orbital periods.

## Current State

Version 0.2.2 implements:
- Interactive time control slider for orbit speed adjustment
- Visualization-focused time scaling (4 minutes to 12 seconds per Earth orbit)
- Linear speed progression for intuitive control
- Time display in minutes/seconds per orbit
- Smooth transitions between view modes with coordinated animations
- Centralized configuration system for different view modes
- Enhanced planet property management
- Groundwork for elliptical orbits with eccentricity values
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
- [ ] Complete solar system (all planets + dwarf planets)
- [ ] Accurate relative distances between orbits
- [ ] Elliptical orbits (groundwork complete)
- [ ] Accurate planet sizes (with toggle for enhanced visibility)
- [ ] Proper orbital inclinations and eccentricities
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
- [ ] Comparison mode for orbit shapes
- [ ] Visual representation of Kepler's laws
- [ ] Orbital period relationships
- [ ] Eclipse and transit predictions
- [ ] Historical positions calculator

## Technical Implementation

### Version 0.2.2 Changes
The current implementation adds:
- Interactive time control system:
  - Slider-based speed adjustment
  - Linear progression from 4 minutes to 12 seconds per Earth orbit
  - Intuitive time display showing minutes/seconds per orbit
  - Consistent relative orbital periods across speed range
- Coordinated transition system for mode changes:
  - Separate handling of opacity, size, and position updates
  - Synchronized transition timings
  - Prevention of visual glitches during mode switches
- Enhanced Planet class with:
  - Transition-aware properties
  - Improved time scaling system
  - Consistent speed preservation between mode switches
- Optimized animation performance during mode changes
- Improved visual consistency during view switches

## Real-World Accuracy Notes

Key solar system characteristics to implement:

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

3. Orbital Eccentricities
   - Mercury: 0.206 (most eccentric)
   - Venus: 0.007 (most circular)
   - Earth: 0.017
   - Mars: 0.093

## License

MIT License - Free to use, modify, and distribute with attribution