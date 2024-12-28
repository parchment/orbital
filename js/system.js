import { VIEW_MODES, CALCULATION_CONSTANTS } from './constants.js';
import { Planet } from './planet.js';

/**
 * SolarSystem class manages the overall solar system simulation
 * Handles planet creation, mode transitions, and animation
 */
export class SolarSystem {
    /**
     * @param {TimeController} timeController - Time management instance
     */
    constructor(timeController) {
        this.currentMode = 'simple';
        this.planets = {};
        this.animationFrame = null;
        this.timeController = timeController;
        this.isTransitioning = false;
        this.initializePlanets();
    }

    /**
     * Creates and initializes all planets
     * @private
     */
    initializePlanets() {
        const mode = VIEW_MODES[this.currentMode];
        for (const [name, config] of Object.entries(mode.planets)) {
            this.planets[name] = new Planet(name, config, mode);
            this.planets[name].timeController = this.timeController;
        }
    }

    /**
     * Changes the visualization mode (simple/realistic)
     * @param {string} modeName - Name of the mode to switch to
     * @returns {boolean} Whether the mode change was successful
     */
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

            setTimeout(() => {
                this.currentMode = modeName;
                
                // Update sizes and orbits
                for (const planet of Object.values(this.planets)) {
                    planet.updateMode(mode);
                    planet.timeController = this.timeController;
                }
                
                setTimeout(() => {
                    // Update positions while still invisible
                    for (const planet of Object.values(this.planets)) {
                        planet.updatePosition();
                    }
                    
                    setTimeout(() => {
                        // Resume updates and fade in
                        this.isTransitioning = false;
                        for (const planet of Object.values(this.planets)) {
                            planet.element.style.opacity = '1';
                        }
                        
                        // Remove transitioning class after fade in starts
                        setTimeout(() => {
                            solarSystem.classList.remove('transitioning');
                        }, CALCULATION_CONSTANTS.TRANSITION_TIMING.FADE_IN);
                    }, CALCULATION_CONSTANTS.TRANSITION_TIMING.POSITION_UPDATE);
                }, CALCULATION_CONSTANTS.TRANSITION_TIMING.ORBIT_TRANSITION);
            }, CALCULATION_CONSTANTS.TRANSITION_TIMING.FADE_OUT);

            return true;
        }
        return false;
    }

    /**
     * Updates all planets' positions
     * @param {number} now - Current timestamp
     * @private
     */
    update(now) {
        if (!this.isTransitioning) {
            for (const planet of Object.values(this.planets)) {
                planet.update(now);
            }
        }
        this.animationFrame = requestAnimationFrame(time => this.update(time));
    }

    /**
     * Starts the solar system animation
     */
    start() {
        if (!this.animationFrame) {
            this.lastUpdate = performance.now();
            this.animationFrame = requestAnimationFrame(time => this.update(time));
        }
    }

    /**
     * Stops the solar system animation
     */
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
}