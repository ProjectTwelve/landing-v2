import { useEffect, useRef, useState } from 'react';
import * as Stats from 'stats.js';

// debug
// {
//     if (globalThis.$$stats0) {
//         console.error('不要同时使用多种 useTick');
//     }
//     globalThis.$$stats0 = new Stats();
//     globalThis.$$stats0.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
//     globalThis.$$stats0.dom.style.left = '100px';
//     document.body.appendChild(globalThis.$$stats0.dom);
//     globalThis.$$stats1 = new Stats();
//     globalThis.$$stats1.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
//     document.body.appendChild(globalThis.$$stats1.dom);
//     globalThis.$$stats1.dom.style.top = '50px';
//     globalThis.$$stats1.dom.style.left = '100px';
// }

// settings

/** max fps */
const FPSCap = 20;
/** min interval */
const intervalCap = 1000 / FPSCap - 5;

type FrameCallback = (timestamp: number, interval: number) => void;

const callbacks = new Set<FrameCallback>();

let lastFrame = performance.now();

const tick = (timestamp: number) => {
    const interval = timestamp - lastFrame;
    if (interval < intervalCap) {
        requestAnimationFrame(tick);
        return;
    }

    lastFrame = timestamp;

    // tick
    if (globalThis.$$stats0) globalThis.$$stats0.begin();
    if (globalThis.$$stats1) globalThis.$$stats1.begin();

    callbacks.forEach((callback) => callback(timestamp, interval));

    if (globalThis.$$stats0) globalThis.$$stats0.end();
    if (globalThis.$$stats1) globalThis.$$stats1.end();

    requestAnimationFrame(tick);
};

// start
requestAnimationFrame(tick);

export function useTick(callback: FrameCallback, dep: any[] = []) {
    useEffect(() => {
        // console.log('add frame callback');
        callbacks.add(callback);
        return () => {
            callbacks.delete(callback);
            // console.log('cleanup frame callback');
        };
    }, dep);
}
