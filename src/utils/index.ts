
/** hack raf */
const vendors = ['ms', 'moz', 'webkit', 'o'];
for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

export function sleep (ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
