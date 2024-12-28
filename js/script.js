/**
 * Orbital Solar System v0.2.4
 * Main entry point for the application
 */

import { TIME_CONSTANTS, VIEW_MODES } from './constants.js';
import { TimeController } from './time.js';
import { SolarSystem } from './system.js';

/**
 * Calculates time scale based on slider value
 * @param {number} sliderValue - Value from the speed slider (0-100)
 * @returns {number} Calculated time scale
 */
function calculateTimeScale(sliderValue) {
    const ratio = sliderValue / 100;
    const earthOrbitSeconds = TIME_CONSTANTS.MIN_EARTH_ORBIT_SECONDS + 
        (TIME_CONSTANTS.MAX_EARTH_ORBIT_SECONDS - TIME_CONSTANTS.MIN_EARTH_ORBIT_SECONDS) * ratio;
    return 1 / earthOrbitSeconds; // Convert period to frequency
}

/**
 * Formats the speed label based on time scale
 * @param {number} scale - Current time scale
 * @returns {string} Formatted speed label
 */
function formatSpeedLabel(scale) {
    const secondsPerOrbit = 1 / scale;
    if (secondsPerOrbit >= 60) {
        return `${(secondsPerOrbit / 60).toFixed(1)}m/orbit`;
    } else {
        return `${secondsPerOrbit.toFixed(1)}s/orbit`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('speed-slider');
    const speedLabel = document.getElementById('speed-label');
    const modeToggle = document.getElementById('orbit-mode');

    // Initialize time controller with speed from slider
    const initialScale = calculateTimeScale(speedSlider.value);
    const timeController = new TimeController(initialScale);
    speedLabel.textContent = formatSpeedLabel(initialScale);

    // Initialize solar system
    const solarSystem = new SolarSystem(timeController);
    solarSystem.start();

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
        timeController.setScale(newScale);
        speedLabel.textContent = formatSpeedLabel(newScale);
    });
});