'use strict';

class Degrees {
    static sin(angle) {
        return Math.sin(angle / 180 * Math.PI);
    }
    static cos(angle) {
        return Math.cos(angle / 180 * Math.PI);
    }
}

function julianTime(timestamp) {
    return timestamp / 86400 + 2440587.5;
}

function convertEclipticEquatorial(lambda, beta, R, n) {
    const epsilon = 23.439 - 0.0000004 * n; // Obliquity of the ecliptic
    // console.log("epsilon", epsilon);
    const alpha = Math.atan2(Degrees.cos(epsilon) * Degrees.sin(lambda), Degrees.cos(lambda));
    // console.log("alpha", alpha);
    const delta = Math.asin(Degrees.sin(epsilon) * Degrees.sin(lambda)); // declination
    // console.log("delta", delta);
    return {
        epsilon,
        alpha,
        delta
    };
}

function timeToLongitude(timestamp) {
    const JD = julianTime(timestamp);
    //console.log("JD", JD);

    const n = JD - 2451545;
    //console.log("n", n);
    const L = (280.46061837 + 0.98564736629 * n) % 360;
    //console.log("L", L);
    const g = (357.52772 + 0.9856003 * n) % 360;
    //console.log("g", g);
    const lambda = (L + 1.915 * Degrees.sin(g) + 0.020 * Degrees.sin(2 * g)) % 360;
    //console.log("lambda", lambda);
    const R = 1.00014 - 0.01671 * Degrees.cos(g) - 0.00014 * Degrees.cos(2 * g); // Distance
    //console.log("R", R);

    // convertEclipticEquatorial(lambda, 0, R, n);

    return lambda;
}

module.exports = timeToLongitude;