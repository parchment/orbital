import { ORBITAL_PARAMETERS, CALCULATION_CONSTANTS } from './constants.js';

/**
 * Planet class handles individual planet visualization and orbital calculations
 */
export class Planet {
    /**
     * @param {string} name - Planet identifier
     * @param {Object} config - Planet configuration object
     * @param {Object} mode - Current view mode settings
     */
    constructor(name, config, mode) {
        this.name = name;
        this.element = document.getElementById(name);
        this.orbitElement = document.getElementById(`${name}-orbit`);
        this.baseConfig = config;
        this.element.style.opacity = '1';
        
        this.createOrbitPaths();
        this.updateMode(mode);
        this.angle = Math.random() * Math.PI * 2;
        this.lastUpdate = performance.now();
        this.meanAnomaly = 0;
    }

    /**
     * Creates SVG paths for orbit visualization
     * @private
     */
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

    /**
     * Calculates points for orbit path visualization
     * @param {boolean} useElliptical - Whether to use elliptical orbit calculations
     * @returns {Array} Array of [x, y] coordinates for orbit path
     * @private
     */
    calculateOrbitPoints(useElliptical = false) {
        const points = [];
        const steps = CALCULATION_CONSTANTS.ORBIT_PATH_RESOLUTION;
        
        if (useElliptical) {
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
                
                const rotatedX = x * Math.cos(this.longitudeOfPerihelion) - 
                               y * Math.sin(this.longitudeOfPerihelion);
                const rotatedY = x * Math.sin(this.longitudeOfPerihelion) + 
                               y * Math.cos(this.longitudeOfPerihelion);
                
                const finalY = rotatedY * Math.cos(this.inclination);
                
                points.push([rotatedX, finalY]);
            }
        } else {
            for (let i = 0; i < steps; i++) {
                const angle = (i / steps) * 2 * Math.PI;
                const x = Math.cos(angle) * this.orbitRadius;
                const y = Math.sin(angle) * this.orbitRadius;
                points.push([x, y]);
            }
        }
        
        return points;
    }

    /**
     * Updates the SVG path for orbit visualization
     * @private
     */
    updateOrbitPath() {
        const circularPoints = this.calculateOrbitPoints(false);
        const ellipticalPoints = this.calculateOrbitPoints(true);
        
        const center = this.useElliptical ? 
            this.semiMajorAxis : 
            this.orbitRadius;
        
        const points = this.useElliptical ? ellipticalPoints : circularPoints;
        
        const d = points.map((point, i) => {
            const [x, y] = point;
            return `${i === 0 ? 'M' : 'L'} ${x + center} ${y + center}`;
        }).join(' ') + 'Z';
        
        this.orbitPath.setAttribute('d', d);
    }

    /**
     * Updates planet properties based on view mode
     * @param {Object} mode - Current view mode settings
     */
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

        this.semiMajorAxis = this.orbitRadius;
        this.semiMinorAxis = this.semiMajorAxis * Math.sqrt(1 - this.eccentricity * this.eccentricity);
        this.focalPoint = this.semiMajorAxis * this.eccentricity;

        requestAnimationFrame(() => {
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
            this.element.style.background = this.color;
            
            const orbitSize = Math.max(
                this.semiMajorAxis * 2,
                this.semiMinorAxis * 2
            );
            this.orbitElement.style.width = `${orbitSize}px`;
            this.orbitElement.style.height = `${orbitSize}px`;
            this.orbitElement.style.transform = 'translate(-50%, -50%)';
            this.orbitElement.style.border = 'none';
            
            this.updateOrbitPath();
            this.orbitPath.style.display = mode.showOrbits ? '' : 'none';
        });
    }

    /**
     * Updates planet position based on orbital calculations
     */
    updatePosition() {
        if (this.useElliptical) {
            const E = this.solveKeplersEquation(this.meanAnomaly, this.eccentricity);
            
            const cosE = Math.cos(E);
            const sinE = Math.sin(E);
            const trueAnomaly = Math.atan2(
                Math.sqrt(1 - this.eccentricity * this.eccentricity) * sinE,
                cosE - this.eccentricity
            );
            
            const r = this.semiMajorAxis * (1 - this.eccentricity * cosE);
            
            let x = r * Math.cos(trueAnomaly);
            let y = r * Math.sin(trueAnomaly);
            
            const rotatedX = x * Math.cos(this.longitudeOfPerihelion) - 
                           y * Math.sin(this.longitudeOfPerihelion);
            const rotatedY = x * Math.sin(this.longitudeOfPerihelion) + 
                           y * Math.cos(this.longitudeOfPerihelion);
            
            const finalY = rotatedY * Math.cos(this.inclination);
            
            this.element.style.transform = `translate(calc(-50% + ${rotatedX}px), calc(-50% + ${finalY}px))`;
        } else {
            const x = Math.cos(this.angle) * this.orbitRadius;
            const y = Math.sin(this.angle) * this.orbitRadius;
            this.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
    }

    /**
     * Solves Kepler's equation using Newton-Raphson iteration
     * @param {number} meanAnomaly - Mean anomaly
     * @param {number} e - Orbital eccentricity
     * @returns {number} Eccentric anomaly
     * @private
     */
    solveKeplersEquation(meanAnomaly, e) {
        let E = meanAnomaly;
        
        for (let i = 0; i < CALCULATION_CONSTANTS.KEPLER_MAX_ITERATIONS; i++) {
            const delta = (E - e * Math.sin(E) - meanAnomaly) / (1 - e * Math.cos(E));
            E -= delta;
            if (Math.abs(delta) < CALCULATION_CONSTANTS.KEPLER_CONVERGENCE_THRESHOLD) break;
        }
        
        return E;
    }

    /**
     * Updates planet position and orbital parameters based on time delta
     * @param {number} now - Current timestamp
     */
    update(now) {
        const delta = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        
        const scaledDelta = this.timeController ? this.timeController.getDelta(delta) : delta;
        
        if (this.useElliptical) {
            const meanMotion = (2 * Math.PI) / this.period;
            this.meanAnomaly += meanMotion * scaledDelta;
            this.meanAnomaly %= (2 * Math.PI);
        } else {
            const angleSpeed = (2 * Math.PI) / this.period;
            this.angle += angleSpeed * scaledDelta;
        }
        
        this.updatePosition();
    }
}