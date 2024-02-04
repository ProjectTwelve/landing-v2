import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import React, { useRef } from 'react';
import { currentPageAtom } from '../../store/app/state';
import { GAevent } from '../../utils';
import { PageType } from '../app/App.config';
import { loadingEE, usePageVisible } from '../app/App.utils';
import './Loading.less';
import { LoadingGL } from './components/LoadingGL';

const loadingProgressObj = { num: 0 };

export const Loading: React.FC = () => {
    const progressTextRef = useRef<HTMLSpanElement>(null);
    let tween: gsap.core.Tween;
    const setCurrent = useSetAtom(currentPageAtom);
    let animationStartTime: number; // 记录动画开始时间

    const handleProgress = (progress, dur = 0.6) => {
        tween?.kill();
        tween = gsap.to(loadingProgressObj, {
            duration: dur,
            num: progress * 100,
            onUpdate: function () {
                progressTextRef.current!.innerHTML = `${Math.floor(loadingProgressObj.num)}`;
            },
            onComplete: function () {
                const animationEndTime = Date.now(); // 动画完成时记录时间戳
                const animationDuration = (animationEndTime - animationStartTime) / 1000; // 计算动画持续时间（秒）
                console.log(`Animation duration: ${animationDuration} seconds`); // 打印动画持续时间
                setCurrent(PageType.Home);
            },
        });
    };

    usePageVisible(PageType.Loading, () => {
        return {
            onVisible: () => {
                GAevent('webview', 'loadin-webview');
                animationStartTime = Date.now(); // 动画开始时记录时间戳
                handleProgress(1, 12);
                console.log(`( handleProgress 1, 12 )===============>`);
                loadingEE.on('loaded', () => {
                    console.log('loaded!');
                    if (loadingProgressObj.num === 100) return;
                    console.log(`( loadingProgressObj )===============>`, loadingProgressObj);
                    // 提前结束则用 1秒 = 100% 的速度涨到100%
                    const currentProgress = loadingProgressObj.num / 100;
                    console.log(`( currentProgress )===============>`, currentProgress);
                    const remainingTime = 1 * (1 - currentProgress); // Calculate remaining time to reach 100%
                    console.log(`( remainingTime )===============>`, remainingTime);
                    handleProgress(1, remainingTime);
                });
                gsap.set('.page-wrap-loading', {
                    display: 'block',
                    opacity: 1,
                });
            },
            onHide: () => {
                loadingEE.off('loaded');
                gsap.to('.page-wrap-loading', {
                    duration: 2.4,
                    display: 'none',
                    opacity: 0,
                    ease: 'power1.inOut',
                });
            },
            onDestroy: () => {},
        };
    });

    const handleSkip = () => {
        console.log('skip!');
        // 提前结束则用 1秒 = 100% 的速度涨到100%
        const currentProgress = loadingProgressObj.num / 100;
        console.log(`( currentProgress )===============>`, currentProgress);
        const remainingTime = 1 * (1 - currentProgress); // Calculate remaining time to reach 100%
        console.log(`( remainingTime )===============>`, remainingTime);
        handleProgress(1, remainingTime); // Immediately go to 100% in 2 seconds
    };

    return (
        <div className="loading">
            <LoadingGL />
            <div className="loading__rotate">
                Please rotate to horizontal
                <br /> to experience P12 site
            </div>
            <div className="loading__progress">
                <div className="loading__progress-dot loading__progress-dot--1"></div>
                <div className="loading__progress-dot loading__progress-dot--2"></div>
                <div className="loading__progress-dot loading__progress-dot--3"></div>
                <div className="loading__progress-text">
                    <span ref={progressTextRef}>0</span>%
                </div>
                <div className="loading__progress-dot loading__progress-dot--4"></div>
                <div className="loading__progress-dot loading__progress-dot--5"></div>
                <div className="loading__progress-dot loading__progress-dot--6"></div>
            </div>
            <div className="loading__skip" onClick={handleSkip}>
                Skip →
            </div>
            <div className="loading__logo">
                <img id="loading-icon" src={require('../../assets/loading/loading-icon.png')} alt="P12" />
            </div>

            <div className="loading__links">
                <a className="loading__icon-link" target="_blank" href="https://mirror.xyz/p12.eth" rel="noreferrer">
                    <svg
                        className="mirror-icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => GAevent('event', 'loadin-tele')}
                    >
                        <path
                            d="M938.666667 512c0-235.648-191.018667-426.666667-426.666667-426.666667S85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667zM344.405333 454.997333c0-94.72 75.050667-171.562667 167.594667-171.562666 92.586667 0 167.637333 76.8 167.637333 171.52v249.173333a20.992 20.992 0 0 1-20.736 21.205333H365.141333a20.992 20.992 0 0 1-20.736-21.248v-249.088z"
                            p-id="1397"
                        ></path>
                    </svg>
                </a>
                <a
                    className="loading__icon-link"
                    target="_blank"
                    href="https://twitter.com/_p12_"
                    onClick={() => GAevent('event', 'loadin-twi')}
                >
                    <svg className="twitter-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.1761 4H19.9362L13.9061 10.7774L21 20H15.4456L11.0951 14.4066L6.11723 20H3.35544L9.80517 12.7508L3 4H8.69545L12.6279 9.11262L17.1761 4ZM16.2073 18.3754H17.7368L7.86441 5.53928H6.2232L16.2073 18.3754Z"
                            fill="white"
                        />
                    </svg>
                </a>
                <a
                    className="loading__icon-link"
                    target="_blank"
                    href="https://discord.gg/EMrbsZPbxs"
                    rel="noreferrer"
                    onClick={() => GAevent('event', 'loadin-discord')}
                >
                    <svg className="discord-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                        <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                    </svg>
                </a>
            </div>
        </div>
    );
};
