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

/**
 * Updates the view mode classes and styles
 * @param {string} mode - The current view mode ('simple' or 'realistic')
 */
function updateViewMode(mode) {
    const solarSystem = document.querySelector('.solar-system');
    const sunElement = document.querySelector('.sun');
    
    // Update classes for mode-specific styling
    solarSystem.classList.toggle('simple-mode', mode === 'simple');
    
    // Update sun size based on mode
    if (mode === 'simple') {
        sunElement.style.width = '50px';
        sunElement.style.height = '50px';
    } else {
        sunElement.style.width = '120px';
        sunElement.style.height = '120px';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('speed-slider');
    const speedLabel = document.getElementById('speed-label');
    const modeToggle = document.getElementById('orbit-mode');
    const solarSystem = document.querySelector('.solar-system');
    const zoomControl = document.getElementById('zoom-control');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomLabel = document.getElementById('zoom-label');

    // Force simple mode state immediately
    solarSystem.classList.add('simple-mode');
    
    // Initialize time controller with speed from slider
    const initialScale = calculateTimeScale(speedSlider.value);
    const timeController = new TimeController(initialScale);
    speedLabel.textContent = formatSpeedLabel(initialScale);

    // Initialize solar system
    const system = new SolarSystem(timeController);
    system.start();

    // Handle zoom changes
    function updateZoom(value) {
        const scale = value / 100;
        solarSystem.style.transform = `translate(-50%, -50%) scale(${scale})`;
        zoomLabel.textContent = `${value}% Zoom`;
    }

    zoomSlider.addEventListener('input', (e) => {
        updateZoom(e.target.value);
    });

    // Handle mode toggle
    modeToggle.addEventListener('change', (e) => {
        const newMode = e.target.checked ? 'realistic' : 'simple';
        solarSystem.classList.add('transitioning');
        
        // Show/hide zoom control based on mode
        zoomControl.style.display = newMode === 'realistic' ? 'block' : 'none';
        
        if (system.setMode(newMode)) {
            modeToggle.nextElementSibling.textContent = VIEW_MODES[newMode].name;
            solarSystem.classList.toggle('simple-mode', newMode === 'simple');
            
            // Reset transforms when switching modes
            if (newMode === 'simple') {
                zoomSlider.value = 100;
                solarSystem.style.transform = 'translate(-50%, -50%)';
            } else {
                // Start realistic mode at 25% zoom to show full system
                zoomSlider.value = 25;
                updateZoom(25);
            }
        }
        
        // Remove transitioning class after animation completes
        setTimeout(() => {
            solarSystem.classList.remove('transitioning');
        }, 1000);
    });

    // Handle speed changes
    speedSlider.addEventListener('input', (e) => {
        const newScale = calculateTimeScale(e.target.value);
        timeController.setScale(newScale);
        speedLabel.textContent = formatSpeedLabel(newScale);
    });
});