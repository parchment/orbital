/**
 * Time Constants
 */
export const TIME_CONSTANTS = {
    MIN_EARTH_ORBIT_SECONDS: 240,  // 4 minutes
    MAX_EARTH_ORBIT_SECONDS: 12    // 12 seconds
};

/**
 * Orbital Parameters for Inner Planets
 * Values represent real astronomical data
 */
export const ORBITAL_PARAMETERS = {
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

/**
 * View Mode Configurations
 */
export const VIEW_MODES = {
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
        planetScale: 1,
        orbitScale: 4,
        timeScale: 1/60,
        showOrbits: true,
        useEllipticalOrbits: true,
        planets: {
            mercury: {
                baseSize: 3.2,    // 0.383 × Earth size
                baseOrbitRadius: 38.7, // 0.387 AU
                period: 0.24,
                color: '#A0522D'
            },
            venus: {
                baseSize: 8.1,    // 0.950 × Earth size
                baseOrbitRadius: 72.3, // 0.723 AU
                period: 0.62,
                color: '#DEB887'
            },
            earth: {
                baseSize: 8.5,    // Reference: 8.5px
                baseOrbitRadius: 100,  // Reference: 1 AU = 100px
                period: 1.00,
                color: '#4169E1'
            },
            mars: {
                baseSize: 4.5,    // 0.532 × Earth size
                baseOrbitRadius: 152.4, // 1.524 AU
                period: 1.88,
                color: '#CD5C5C'
            }
        }
    }
};

/**
 * Calculation Constants
 */
export const CALCULATION_CONSTANTS = {
    KEPLER_MAX_ITERATIONS: 10,
    KEPLER_CONVERGENCE_THRESHOLD: 1e-6,
    ORBIT_PATH_RESOLUTION: 360, // Points to generate for orbit path
    TRANSITION_TIMING: {
        FADE_OUT: 150,
        ORBIT_TRANSITION: 800,
        POSITION_UPDATE: 50,
        FADE_IN: 300
    }
};