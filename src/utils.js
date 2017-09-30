export function rand(min = null, max = null) {
    if (!min && !max) { return Math.random(); }

    let nMin = max === null ? 0 : min;
    let nMax = max === null ? min : max;

    return Math.random() * (nMax - nMin + 1) + nMin;
}

export function randInt(min, max = null) {
    if (Array.isArray(min)) {
        return min[randInt(0, min.length)];
    }

    let nMin = max === null ? 0 : min;
    let nMax = max === null ? min : max;

    return Math.floor(Math.random() * (nMax - nMin + 1)) + nMin;
}

export function distance(thingA, thingB) {
    return Math.sqrt(Math.pow(thingA.x - thingB.x, 2) + Math.pow(thingA.y - thingB.y, 2));
}
