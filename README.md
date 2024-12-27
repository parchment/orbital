# Orbital 💫

A web-based visualization of our solar system built with plain HTML, CSS, and minimal JavaScript. The project aims to create both idealized and accurate representations of planetary motions, with interactive features for exploration and education.

## Current State

Version 0.2.0 implements:
- Refactored codebase for better mode switching and configuration
- Centralized configuration system for different view modes
- Proper astronomical time scaling
- Separate visual and time controls
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

### Accuracy Features
- [x] Basic circular orbital motion
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
- [ ] Scale controls for distance/size representation
- [ ] Time controls (pause, speed up, slow down)
- [ ] Information panels for celestial bodies
- [ ] Camera controls for viewing angle
- [ ] Dynamic "zoom to scale" feature

### Educational Features
- [ ] Comparison mode for orbit shapes
- [ ] Visual representation of Kepler's laws
- [ ] Orbital period relationships
- [ ] Eclipse and transit predictions
- [ ] Historical positions calculator

## Technical Implementation

### Version 0.2.0 Changes
The current implementation adds:
- Centralized configuration system via VIEW_MODES object
- Astronomical time scaling with TIME_SCALE constants
- Enhanced Planet class with mode-aware properties
- New TimeController class for simulation management
- Separation of visual and orbital properties
- Mode-specific configurations for planet characteristics
- Proper orbital period relationships
- Eccentricity values for future elliptical orbits

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