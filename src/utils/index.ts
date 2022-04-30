import { Howl } from 'howler';

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
