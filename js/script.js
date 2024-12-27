/**
 * Orbital Solar System v0.2.2
 * Added smooth transitions between modes and speed control
 */

const MIN_EARTH_ORBIT_SECONDS = 240; // 4 minutes per orbit
const MAX_EARTH_ORBIT_SECONDS = 12;  // 12 seconds per orbit

function calculateTimeScale(sliderValue) {
    // Linear interpolation between min and max orbit times
    const ratio = sliderValue / 100;
    const earthOrbitSeconds = MIN_EARTH_ORBIT_SECONDS + (MAX_EARTH_ORBIT_SECONDS - MIN_EARTH_ORBIT_SECONDS) * ratio;
    return 1 / earthOrbitSeconds; // Convert period to frequency
}

function formatSpeedLabel(scale) {
    // Convert scale to seconds per earth orbit
    const secondsPerOrbit = 1 / scale;
    if (secondsPerOrbit >= 60) {
        return `${(secondsPerOrbit / 60).toFixed(1)}m/orbit`;
    } else {
        return `${secondsPerOrbit.toFixed(1)}s/orbit`;
    }
}

const VIEW_MODES = {
    simple: {
        name: 'Simple View',
        planetScale: 1,
        orbitScale: 1,
        timeScale: 1/60, // Default to 1 minute per orbit
        showOrbits: true,
        useEllipticalOrbits: false,
        planets: {
            mercury: { 
                baseSize: 10,
                baseOrbitRadius: 50,
                period: 0.24,
                color: '#A0522D'
            },
            venus: { 
                baseSize: 15,
                baseOrbitRadius: 90,
                period: 0.62,
                color: '#DEB887'
            },
            earth: { 
                baseSize: 16,
                baseOrbitRadius: 130,
                period: 1.00,
                color: '#4169E1'
            },
            mars: { 
                baseSize: 12,
                baseOrbitRadius: 170,
                period: 1.88,
                color: '#CD5C5C'
            }
        }
    },
    realistic: {
        name: 'Realistic View',
        planetScale: 0.6,
        orbitScale: 1.5,
        timeScale: 1/60, // Default to 1 minute per orbit
        showOrbits: true,
        useEllipticalOrbits: true,
        planets: {
            mercury: {
                baseSize: 4.9,
                baseOrbitRadius: 40,
                period: 0.24,
                color: '#A0522D',
                eccentricity: 0.206
            },
            venus: {
                baseSize: 12.1,
                baseOrbitRadius: 70,
                period: 0.62,
                color: '#DEB887',
                eccentricity: 0.007
            },
            earth: {
                baseSize: 12.7,
                baseOrbitRadius: 100,
                period: 1.00,
                color: '#4169E1',
                eccentricity: 0.017
            },
            mars: {
                baseSize: 6.8,
                baseOrbitRadius: 150,
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
        this.element.style.opacity = '1'; // Ensure initial opacity is set
        this.updateMode(mode);
        this.angle = Math.random() * Math.PI * 2;
        this.lastUpdate = performance.now();
    }

    updateMode(mode) {
        const planetConfig = mode.planets[this.name];
        this.size = planetConfig.baseSize * mode.planetScale;
        this.orbitRadius = planetConfig.baseOrbitRadius * mode.orbitScale;
        this.period = planetConfig.period;
        this.eccentricity = planetConfig.eccentricity || 0;
        this.color = planetConfig.color;
        this.basePeriod = planetConfig.period;

        requestAnimationFrame(() => {
            // Update size and appearance
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
            this.element.style.background = this.color;
            
            // Update orbit appearance
            const orbitSize = this.orbitRadius * 2;
            this.orbitElement.style.width = `${orbitSize}px`;
            this.orbitElement.style.height = `${orbitSize}px`;
            this.orbitElement.style.display = mode.showOrbits ? 'block' : 'none';
            this.orbitElement.style.borderStyle = mode.useEllipticalOrbits ? 'dashed' : 'solid';
            this.orbitElement.style.borderColor = mode.useEllipticalOrbits ? 
                'rgba(255, 100, 100, 0.2)' : 
                'rgba(255, 255, 255, 0.1)';
        });
    }

    updatePosition() {
        const x = Math.cos(this.angle) * this.orbitRadius;
        const y = Math.sin(this.angle) * this.orbitRadius;
        this.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }

    update(now) {
        const delta = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        
        const angleSpeed = (2 * Math.PI) / this.period;
        const scaledDelta = this.timeController ? this.timeController.getDelta(delta) : delta;
        this.angle += angleSpeed * scaledDelta;
        
        this.updatePosition();
    }
}

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
        this.timeController = null;
        this.isTransitioning = false;
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
            const solarSystem = document.querySelector('.solar-system');
            const mode = VIEW_MODES[modeName];
            
            // Add transitioning class and pause updates
            solarSystem.classList.add('transitioning');
            this.isTransitioning = true;
            
            // Quick fade out with opacity change only
            for (const planet of Object.values(this.planets)) {
                planet.element.style.opacity = '0';
            }

            // Wait for fade out, then update sizes and positions
            setTimeout(() => {
                this.currentMode = modeName;
                
                // Update sizes and orbits
                for (const planet of Object.values(this.planets)) {
                    planet.updateMode(mode);
                    planet.timeController = this.timeController;
                }
                
                // Wait for orbit transition to complete before showing planets
                setTimeout(() => {
                    // Update positions while still invisible
                    for (const planet of Object.values(this.planets)) {
                        planet.updatePosition();
                    }
                    
                    // Small delay to ensure positions are updated
                    setTimeout(() => {
                        // Resume updates and fade in
                        this.isTransitioning = false;
                        for (const planet of Object.values(this.planets)) {
                            planet.element.style.opacity = '1';
                        }
                        
                        // Remove transitioning class after fade in starts
                        setTimeout(() => {
                            solarSystem.classList.remove('transitioning');
                        }, 300);
                    }, 50);
                }, 800);
            }, 150);

            return true;
        }
        return false;
    }

    update(now) {
        if (!this.isTransitioning) {
            for (const planet of Object.values(this.planets)) {
                planet.update(now);
            }
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

    const modeToggle = document.getElementById('orbit-mode');
    const speedSlider = document.getElementById('speed-slider');
    const speedLabel = document.getElementById('speed-label');

    // Initialize speed from slider
    const initialScale = calculateTimeScale(speedSlider.value);
    solarSystem.timeController = new TimeController(initialScale);
    speedLabel.textContent = formatSpeedLabel(initialScale);

    // Set timeController for existing planets
    for (const planet of Object.values(solarSystem.planets)) {
        planet.timeController = solarSystem.timeController;
    }

    // Handle mode toggle
    modeToggle.addEventListener('change', (e) => {
        const newMode = e.target.checked ? 'realistic' : 'simple';
        if (solarSystem.setMode(newMode)) {
            modeToggle.nextElementSibling.textContent = VIEW_MODES[newMode].name;
        }
    });

    // Handle speed changes
    speedSlider.addEventListener('input', (e) => {
        const newScale = calculateTimeScale(e.target.value);
        solarSystem.timeController.setScale(newScale);
        speedLabel.textContent = formatSpeedLabel(newScale);
    });
});