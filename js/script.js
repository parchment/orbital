/**
 * Orbital Solar System v0.1.3
 * JavaScript-based orbital motion implementation
 */

const config = {
    scale: 1,
    speed: 1,
    showOrbits: true,
    idealizedOrbits: true,  // true for circular, false for elliptical
    fps: 60
};

// Planet configurations with orbit radii matching CSS
const planets = {
    mercury: { orbitRadius: 100 / 2, period: 3, size: 10 },  // CSS width 100px
    venus: { orbitRadius: 180 / 2, period: 7, size: 15 },    // CSS width 180px
    earth: { orbitRadius: 260 / 2, period: 12, size: 16 },   // CSS width 260px
    mars: { orbitRadius: 340 / 2, period: 22, size: 12 }     // CSS width 340px
};

class Planet {
    constructor(name, config) {
        this.name = name;
        this.element = document.getElementById(name);
        this.orbitRadius = config.orbitRadius;
        this.period = config.period;
        this.angle = Math.random() * Math.PI * 2; // Random starting position
        this.lastUpdate = performance.now();
    }

    update(now) {
        const delta = (now - this.lastUpdate) / 1000; // Convert to seconds
        this.lastUpdate = now;
        
        // Update angle based on period (complete 360° in 'period' seconds)
        const angleSpeed = (2 * Math.PI) / this.period;
        this.angle += angleSpeed * delta;

        // Calculate position
        // Calculate position relative to orbit center
        const x = Math.cos(this.angle) * this.orbitRadius;
        const y = Math.sin(this.angle) * this.orbitRadius;

        // Update planet position, offsetting by -50% to account for the planet's center point
        // Since we're using position: absolute and top/left: 50%, this centers the planet on its orbital path
        this.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
}

class SolarSystem {
    constructor() {
        this.planets = Object.entries(planets).map(([name, config]) => 
            new Planet(name, config)
        );
        this.animationFrame = null;
        this.lastUpdate = performance.now();
    }

    update(now) {
        // Update each planet
        for (const planet of this.planets) {
            planet.update(now);
        }

        // Request next frame
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
});