import gsap from 'gsap';
import { Howl } from 'howler';
import { throttle } from 'lodash-es';
import ReactGA from 'react-ga4';

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

// 移动端请求陀螺仪权限
let hasRequested = false;
export function requestOrientationPermission() {
    return new Promise<void>((resolve) => {
        if (
            !hasRequested &&
            window.DeviceOrientationEvent &&
            (window.DeviceOrientationEvent as any).requestPermission
        ) {
            (window.DeviceOrientationEvent as any)
                .requestPermission()
                .then((r) => {
                    hasRequested = true;
                    // 在这里调用陀螺仪事件
                    // 某些设备，授权后，刷新页面才能生效
                    console.log('DeviceOrientationEvent.requestPermission', r);
                    resolve();
                });
        } else {
            resolve();
        }
    });
}

export const resizeBodyRotation = throttle(() => {
    if (window.innerWidth > window.innerHeight) {
        document.body.classList.add('body-landscape');
        document.body.classList.remove('body-portrait');
    } else {
        document.body.classList.add('body-portrait');
        document.body.classList.remove('body-landscape');
    }
}, 100);

export function addResizeHandle(fn: Function) {
    window.addEventListener('resize', () => fn());
    window.addEventListener('orientationchange', () =>
        setTimeout(() => fn(), 100)
    );
    fn();
    setTimeout(() => {
        fn();
    }, 100);
}

/** GA **/

const GAtiming = {
    startTime: -1,
    endTime: -1,
    prevView: '',
    calcTiming: function (webview: string) {
        let diff = 0;
        if (this.startTime === -1) {
            // begin timing
            this.startTime = new Date().getTime();
        } else if (this.prevView !== webview) {
            // changed webview
            this.endTime = new Date().getTime();

            diff = this.endTime - this.startTime;
            GAevent('timing', this.prevView.split('-')[0] + '-timing', diff);

            this.startTime = this.endTime;
        }
        this.prevView = webview;
    },
};

export const initGA = () => {
    const GA_ID: string = process.env.REACT_APP_GOOGLE_ANALYTICS_ID as string;
    // initialize ga
    ReactGA.initialize(GA_ID);
};

export const GAevent = (category: string, action: string, value = -1) => {
    // event tracking
    if (value === -1) {
        ReactGA.event({
            category: category,
            action: action,
        });
    } else {
        ReactGA.event({
            category: category,
            action: action,
            value: value,
        });
    }

    if (category === 'webview') {
        GAtiming.calcTiming(action);
    }
};
