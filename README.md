# Orbital 💫

A web-based visualization of our solar system built with plain HTML, CSS, and minimal JavaScript. The project aims to create both idealized and accurate representations of planetary motions, with interactive features for exploration and education.

## Current State

Version 0.1.4 implements:
- Improved project structure with separate CSS and JS files
- CSS variables for easier customization
- JavaScript-based orbital motion system
- Precise timing control using requestAnimationFrame
- Inner planets (Mercury through Mars)
- Groundwork for elliptical orbits
- Relative orbit distances (not to scale)
- Minimal dependencies - pure HTML/CSS/JS implementation
- Mode toggle infrastructure for switching between simple/realistic views

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
- [ ] Complete solar system (all planets + dwarf planets)
- [ ] Accurate relative distances between orbits
- [ ] Elliptical orbits (prepared with new JS animation system)
- [ ] Correct orbital periods and speeds
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
- [ ] Toggle between idealized (circular) and realistic (elliptical) orbits
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

### Current Approach
The current implementation uses:
- HTML structure with nested elements for orbits and planets
- CSS for styling and visual properties
- JavaScript-based animation system for precise orbital motion
- CSS variables for maintainable styling
- requestAnimationFrame for smooth animations
- Proper delta time calculations for consistent motion
- Object-oriented design with Planet and SolarSystem classes

### Planned Technical Features
- Implementation of Kepler's laws for elliptical orbits
- Modular code structure for easy expansion
- Configuration system for switching between ideal/accurate modes
- Responsive design for various screen sizes
- Performance optimizations for complex calculations

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