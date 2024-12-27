/**
 * Orbital Solar System v0.2.3
 * Added SVG-based elliptical orbit paths
 */

const MIN_EARTH_ORBIT_SECONDS = 240;
const MAX_EARTH_ORBIT_SECONDS = 12;

const ORBITAL_PARAMETERS = {
    mercury: {
        eccentricity: 0.206,
        inclination: 7.0,
        longitudeOfPerihelion: 77.45,
        meanLongitude: 252.25
    },
    venus: {
        eccentricity: 0.007,
        inclination: 3.4,
        longitudeOfPerihelion: 131.53,
        meanLongitude: 181.98
    },
    earth: {
        eccentricity: 0.017,
        inclination: 0.0,
        longitudeOfPerihelion: 102.94,
        meanLongitude: 100.46
    },
    mars: {
        eccentricity: 0.093,
        inclination: 1.85,
        longitudeOfPerihelion: 336.04,
        meanLongitude: 355.45
    }
};


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
        this.element.style.opacity = '1';
        
        // Create SVG for orbit paths
        this.createOrbitPaths();
        
        this.updateMode(mode);
        this.angle = Math.random() * Math.PI * 2;
        this.lastUpdate = performance.now();
        this.meanAnomaly = 0;
    }

    createOrbitPaths() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: visible;
        `;
        
        // Create a single path that we'll animate between states
        this.orbitPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.orbitPath.style.cssText = `
            fill: none;
            stroke: rgba(255, 255, 255, 0.1);
            stroke-width: 1;
            transition: d 0.8s ease-in-out;
        `;
        
        svg.appendChild(this.orbitPath);
        this.orbitElement.appendChild(svg);
    }

    calculateOrbitPoints(useElliptical = false) {
        const points = [];
        const steps = 360;
        
        if (useElliptical) {
            // Calculate elliptical orbit points
            for (let i = 0; i < steps; i++) {
                const meanAnomaly = (i / steps) * 2 * Math.PI;
                const E = this.solveKeplersEquation(meanAnomaly, this.eccentricity);
                
                const cosE = Math.cos(E);
                const sinE = Math.sin(E);
                const trueAnomaly = Math.atan2(
                    Math.sqrt(1 - this.eccentricity * this.eccentricity) * sinE,
                    cosE - this.eccentricity
                );
                
                const r = this.semiMajorAxis * (1 - this.eccentricity * cosE);
                
                let x = r * Math.cos(trueAnomaly);
                let y = r * Math.sin(trueAnomaly);
                
                // Apply orbit rotation
                const rotatedX = x * Math.cos(this.longitudeOfPerihelion) - 
                               y * Math.sin(this.longitudeOfPerihelion);
                const rotatedY = x * Math.sin(this.longitudeOfPerihelion) + 
                               y * Math.cos(this.longitudeOfPerihelion);
                
                // Apply inclination
                const finalY = rotatedY * Math.cos(this.inclination);
                
                points.push([rotatedX, finalY]);
            }
        } else {
            // Calculate circular orbit points
            for (let i = 0; i < steps; i++) {
                const angle = (i / steps) * 2 * Math.PI;
                const x = Math.cos(angle) * this.orbitRadius;
                const y = Math.sin(angle) * this.orbitRadius;
                points.push([x, y]);
            }
        }
        
        return points;
    }

    updateOrbitPath() {
        // Calculate both paths
        const circularPoints = this.calculateOrbitPoints(false);
        const ellipticalPoints = this.calculateOrbitPoints(true);
        
        // Store path data for both orbits
        const center = this.useElliptical ? 
            this.semiMajorAxis : 
            this.orbitRadius;
        
        const points = this.useElliptical ? ellipticalPoints : circularPoints;
        
        // Convert points to SVG path
        const d = points.map((point, i) => {
            const [x, y] = point;
            return `${i === 0 ? 'M' : 'L'} ${x + center} ${y + center}`;
        }).join(' ') + 'Z';
        
        // Update the path with a smooth transition
        this.orbitPath.setAttribute('d', d);
    }

    updateMode(mode) {
        const planetConfig = mode.planets[this.name];
        const orbitalParams = ORBITAL_PARAMETERS[this.name];
        
        this.size = planetConfig.baseSize * mode.planetScale;
        this.orbitRadius = planetConfig.baseOrbitRadius * mode.orbitScale;
        this.period = planetConfig.period;
        this.eccentricity = orbitalParams.eccentricity;
        this.inclination = orbitalParams.inclination * Math.PI / 180;
        this.longitudeOfPerihelion = orbitalParams.longitudeOfPerihelion * Math.PI / 180;
        this.color = planetConfig.color;
        this.useElliptical = mode.useEllipticalOrbits;

        // Calculate orbital parameters
        this.semiMajorAxis = this.orbitRadius;
        this.semiMinorAxis = this.semiMajorAxis * Math.sqrt(1 - this.eccentricity * this.eccentricity);
        this.focalPoint = this.semiMajorAxis * this.eccentricity;

        requestAnimationFrame(() => {
            // Update planet appearance
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
            this.element.style.background = this.color;
            
            // Update orbit container size
            const orbitSize = Math.max(
                this.semiMajorAxis * 2,
                this.semiMinorAxis * 2
            );
            this.orbitElement.style.width = `${orbitSize}px`;
            this.orbitElement.style.height = `${orbitSize}px`;
            this.orbitElement.style.transform = 'translate(-50%, -50%)';
            this.orbitElement.style.border = 'none';
            
            // Update orbit path with transition
            this.updateOrbitPath();
            this.orbitPath.style.display = mode.showOrbits ? '' : 'none';
        });
    }

    updatePosition() {
        if (this.useElliptical) {
            // Solve Kepler's equation to get eccentric anomaly
            const E = this.solveKeplersEquation(this.meanAnomaly, this.eccentricity);
            
            // Convert eccentric anomaly to true anomaly
            const cosE = Math.cos(E);
            const sinE = Math.sin(E);
            const trueAnomaly = Math.atan2(
                Math.sqrt(1 - this.eccentricity * this.eccentricity) * sinE,
                cosE - this.eccentricity
            );
            
            // Calculate radius vector
            const r = this.semiMajorAxis * (1 - this.eccentricity * cosE);
            
            // Calculate position
            let x = r * Math.cos(trueAnomaly);
            let y = r * Math.sin(trueAnomaly);
            
            // Apply orbit rotation
            const rotatedX = x * Math.cos(this.longitudeOfPerihelion) - 
                           y * Math.sin(this.longitudeOfPerihelion);
            const rotatedY = x * Math.sin(this.longitudeOfPerihelion) + 
                           y * Math.cos(this.longitudeOfPerihelion);
            
            // Apply inclination
            const finalY = rotatedY * Math.cos(this.inclination);
            
            this.element.style.transform = `translate(calc(-50% + ${rotatedX}px), calc(-50% + ${finalY}px))`;
        } else {
            // Circular orbit
            const x = Math.cos(this.angle) * this.orbitRadius;
            const y = Math.sin(this.angle) * this.orbitRadius;
            this.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
    }

    solveKeplersEquation(meanAnomaly, e, maxIterations = 10) {
        let E = meanAnomaly;
        
        // Newton's method to solve Kepler's equation
        for (let i = 0; i < maxIterations; i++) {
            const delta = (E - e * Math.sin(E) - meanAnomaly) / (1 - e * Math.cos(E));
            E -= delta;
            if (Math.abs(delta) < 1e-6) break;
        }
        
        return E;
    }

    update(now) {
        const delta = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        
        const scaledDelta = this.timeController ? this.timeController.getDelta(delta) : delta;
        
        if (this.useElliptical) {
            // Update mean anomaly (constant angular velocity in time)
            const meanMotion = (2 * Math.PI) / this.period;
            this.meanAnomaly += meanMotion * scaledDelta;
            this.meanAnomaly %= (2 * Math.PI);
        } else {
            // Constant angular velocity for circular orbits
            const angleSpeed = (2 * Math.PI) / this.period;
            this.angle += angleSpeed * scaledDelta;
        }
        
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