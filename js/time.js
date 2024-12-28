/**
 * TimeController class handles simulation time management
 * Controls speed scaling and pause/resume functionality
 */
export class TimeController {
    /**
     * @param {number} initialScale - Initial time scale factor
     */
    constructor(initialScale) {
        this.scale = initialScale;
        this.isPaused = false;
        this.baseScale = initialScale;
    }

    /**
     * Sets a new time scale
     * @param {number} newScale - New time scale factor
     * @returns {number} The updated scale
     */
    setScale(newScale) {
        this.scale = newScale;
        return this.scale;
    }

    /**
     * Adjusts current scale by a multiplier
     * @param {number} factor - Multiplier for current scale
     * @returns {number} The updated scale
     */
    adjustScale(factor) {
        this.scale *= factor;
        return this.scale;
    }

    /**
     * Pauses the simulation
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resumes the simulation
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Toggles pause state
     * @returns {boolean} Current pause state
     */
    toggle() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    /**
     * Resets controller to initial state
     */
    reset() {
        this.scale = this.baseScale;
        this.isPaused = false;
    }

    /**
     * Calculates scaled time delta based on current settings
     * @param {number} actualDelta - Real time delta in seconds
     * @returns {number} Scaled time delta
     */
    getDelta(actualDelta) {
        return this.isPaused ? 0 : actualDelta * this.scale;
    }
}