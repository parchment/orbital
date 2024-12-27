/**
 * Orbital Solar System v0.2.0
 * Refactored for flexible mode switching
 */

// Base configurations for different viewing modes
// Time scale: 1.0 means 1 second real time = 1 Earth year
// Can be adjusted to speed up/slow down entire simulation
const TIME_SCALE = {
    simple: 1/12,    // 1 Earth orbit = 12 seconds (easy to view)
    realistic: 1/31536000 // 1 second real time = 1 second astronomical time
};

const VIEW_MODES = {
    simple: {
        name: 'Simple View',
        planetScale: 1,
        orbitScale: 1,
        timeScale: TIME_SCALE.simple,
        showOrbits: true,
        useEllipticalOrbits: false,
        planets: {
            mercury: { 
                baseSize: 10,
                baseOrbitRadius: 50,
                period: 3,
                color: '#A0522D'
            },
            venus: { 
                baseSize: 15,
                baseOrbitRadius: 90,
                period: 7,
                color: '#DEB887'
            },
            earth: { 
                baseSize: 16,
                baseOrbitRadius: 130,
                period: 12,
                color: '#4169E1'
            },
            mars: { 
                baseSize: 12,
                baseOrbitRadius: 170,
                period: 22,
                color: '#CD5C5C'
            }
        }
    },
    realistic: {
        name: 'Realistic View',
        planetScale: 0.6, // Smaller planets
        orbitScale: 1.5, // Larger orbits
        timeScale: TIME_SCALE.realistic, // Real astronomical time
        showOrbits: true,
        useEllipticalOrbits: true,
        planets: {
            mercury: {
                baseSize: 4.9,        // Relative to Earth = 1
                baseOrbitRadius: 40,  // 0.4 AU
                period: 0.24,
                color: '#A0522D',
                eccentricity: 0.206
            },
            venus: {
                baseSize: 12.1,
                baseOrbitRadius: 70,  // 0.7 AU
                period: 0.62,
                color: '#DEB887',
                eccentricity: 0.007
            },
            earth: {
                baseSize: 12.7,
                baseOrbitRadius: 100, // 1.0 AU
                period: 1.00,
                color: '#4169E1',
                eccentricity: 0.017
            },
            mars: {
                baseSize: 6.8,
                baseOrbitRadius: 150, // 1.5 AU
                period: 1.88,
                color: '#CD5C5C',
                eccentricity: 0.093
            }
        }
    }
};

class Planet {
    constructor(name, config, mode) {
        this.name = name;
        this.element = document.getElementById(name);
        this.orbitElement = document.getElementById(`${name}-orbit`);
        this.baseConfig = config;
        this.updateMode(mode);
        this.angle = Math.random() * Math.PI * 2;
        this.lastUpdate = performance.now();
    }

    updateMode(mode) {
        const planetConfig = mode.planets[this.name];
        this.size = planetConfig.baseSize * mode.planetScale;
        this.orbitRadius = planetConfig.baseOrbitRadius * mode.orbitScale;
        // Period is in Earth years, convert to seconds based on time scale
        this.period = planetConfig.period / mode.timeScale;
        this.eccentricity = planetConfig.eccentricity || 0;
        this.color = planetConfig.color;
        
        // Store the base period for time scale adjustments
        this.basePeriod = planetConfig.period;

        // Update visual properties
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.background = this.color;
        
        // Update orbit appearance
        const orbitSize = this.orbitRadius * 2;
        this.orbitElement.style.width = `${orbitSize}px`;
        this.orbitElement.style.height = `${orbitSize}px`;
        this.orbitElement.style.display = mode.showOrbits ? 'block' : 'none';
    }

    update(now) {
        const delta = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        
        // Calculate angular velocity based on period (in Earth years)
        // 2π radians per orbit * timeScale converts to real time
        const angleSpeed = (2 * Math.PI) / this.period;
        this.angle += angleSpeed * delta;

        // Position calculation (simplified for now, will add elliptical orbits later)
        const x = Math.cos(this.angle) * this.orbitRadius;
        const y = Math.sin(this.angle) * this.orbitRadius;
        
        this.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
}

/**
 * Controls for time scaling in the simulation
 */
class TimeController {
    constructor(initialScale) {
        this.scale = initialScale;
        this.isPaused = false;
        this.baseScale = initialScale;
    }

    setScale(newScale) {
        this.scale = newScale;
        return this.scale;
    }

    // Multiply current time scale by a factor
    adjustScale(factor) {
        this.scale *= factor;
        return this.scale;
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    toggle() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    reset() {
        this.scale = this.baseScale;
        this.isPaused = false;
    }

    getDelta(actualDelta) {
        return this.isPaused ? 0 : actualDelta * this.scale;
    }
}

class SolarSystem {
    constructor() {
        this.currentMode = 'simple';
        this.planets = {};
        this.animationFrame = null;
        this.timeScale = TIME_SCALE.simple;
        this.initializePlanets();
    }

    initializePlanets() {
        const mode = VIEW_MODES[this.currentMode];
        for (const [name, config] of Object.entries(mode.planets)) {
            this.planets[name] = new Planet(name, config, mode);
        }
    }

    setMode(modeName) {
        if (VIEW_MODES[modeName]) {
            this.currentMode = modeName;
            const mode = VIEW_MODES[modeName];
            
            // Update all planets with new mode settings
            for (const planet of Object.values(this.planets)) {
                planet.updateMode(mode);
            }

            // Update orbit display style based on mode
            document.querySelectorAll('.orbit').forEach(orbit => {
                orbit.style.borderStyle = mode.useEllipticalOrbits ? 'dashed' : 'solid';
                orbit.style.borderColor = mode.useEllipticalOrbits ? 
                    'rgba(255, 100, 100, 0.2)' : 
                    'rgba(255, 255, 255, 0.1)';
            });

            return true;
        }
        return false;
    }

    update(now) {
        for (const planet of Object.values(this.planets)) {
            planet.update(now);
        }
        this.animationFrame = requestAnimationFrame(time => this.update(time));
    }

    start() {
        if (!this.animationFrame) {
            this.lastUpdate = performance.now();
            this.animationFrame = requestAnimationFrame(time => this.update(time));
        }
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const solarSystem = new SolarSystem();
    solarSystem.start();

    // Mode switch handling
    const modeToggle = document.getElementById('orbit-mode');
    modeToggle.addEventListener('change', (e) => {
        const newMode = e.target.checked ? 'realistic' : 'simple';
        if (solarSystem.setMode(newMode)) {
            const mode = VIEW_MODES[newMode];
            modeToggle.nextElementSibling.textContent = mode.name;
        }
    });
});