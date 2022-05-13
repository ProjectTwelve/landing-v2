import gsap from 'gsap';
import { Howl } from 'howler';
import { throttle } from 'lodash-es';

/** hack raf */
const vendors = ['ms', 'moz', 'webkit', 'o'];
for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame'];
}
// const oldRAF = window.requestAnimationFrame;
// window.requestAnimationFrame = (fun) => {
//     console.log('window.requestAnimationFrame');
//     return oldRAF(fun);
// };

export function toRadians(angle: number) {
    return angle * (Math.PI / 180);
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPublicAssetPath(path: string) {
    return `${process.env.PUBLIC_URL}/${path}`;
}

const clickSound = new Howl({
    src: [getPublicAssetPath('files/audio/click.mp3')],
    autoplay: false,
    html5: true,
});
export function playClickAudio() {
    clickSound.play();
}

export const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
);

export const resizeMobileRoot = throttle((baseWidth = 1250) => {
    baseWidth = Math.max(window.innerWidth, baseWidth);
    const ratio = window.innerWidth / window.innerHeight;
    const baseHeight = baseWidth / ratio;
    gsap.set('#root', {
        width: baseWidth,
        height: baseHeight,
        scaleX: window.innerWidth / baseWidth,
        scaleY: window.innerWidth / baseWidth,
        left: -(baseWidth - window.innerWidth) / 2,
        top: -(baseHeight - window.innerHeight) / 2,
    });
}, 100);
