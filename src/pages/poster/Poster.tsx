import { Placement } from '@floating-ui/react';
import { useSize } from 'ahooks';
import classNames from 'classnames';
import gsap from 'gsap';
import Parallax from 'parallax-js';
import React, { useEffect, useMemo, useRef } from 'react';
import YouTube from 'react-youtube';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import { Autoplay, EffectFade } from 'swiper/modules';
import PosterDialog from '../../components/dialog/PosterDialog';
import Popover from '../../components/popover';
import { useIsPortrait } from '../../hooks/useIsPortrait';
import { GAevent } from '../../utils';
import { PageType } from '../app/App.config';
import { LoadingSourceType, loadingEE, usePageVisible } from '../app/App.utils';
import { POSTER_FEATURES } from './Poster.config';
import './Poster.less';
import { PosterBg } from './components/PosterBg';
import PosterSummary from './components/PosterSummary';

Swiper.use([Autoplay, EffectFade]);
export const Poster: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerRef);
    const isPortrait = useIsPortrait();

    const posterBgConfig: {
        className?: string;
        src: string;
        onLoad?: () => void;
        depthX?: string;
        depthY?: string;
        children?: JSX.Element;
        dots?: {
            dotX?: string;
            dotY?: string;
            type?: 'dialog' | 'popover';
            placement?: Placement;
            render?: (data: { close: () => void }) => React.ReactNode;
        }[];
    }[] = useMemo(
        () => [
            {
                className: 'poster__img-wrap--0',
                src: require('../../assets/poster/0@2x.png'),
                onLoad: () => loadingEE.emit(`progress.${LoadingSourceType.POSTER_IMG_0}`, 1),
            },
            {
                className: 'poster__img-wrap--1',
                src: require('../../assets/poster/1@2x.png'),
                onLoad: () => loadingEE.emit(`progress.${LoadingSourceType.POSTER_IMG_1}`, 1),
                depthX: '0.05',
                depthY: '-0.1',
                dots: [
                    // {
                    //     dotX: '53%',
                    //     dotY: '20%',
                    //     render: ({ close }) => <div>Developers: 3645</div>,
                    // },
                ],
            },
            {
                className: 'poster__img-wrap--2',
                src: require('../../assets/poster/2@2x.png'),
                onLoad: () => loadingEE.emit(`progress.${LoadingSourceType.POSTER_IMG_2}`, 1),
                depthX: '-0.05',
                dots: [
                    {
                        dotX: '39%',
                        dotY: '52%',
                        type: 'popover',
                        placement: 'top',
                        render: ({ close }) => <PosterSummary />,
                    },
                ],
            },
            {
                className: 'poster__img-wrap--3',
                src: require('../../assets/poster/3@2x.png'),
                onLoad: () => loadingEE.emit(`progress.${LoadingSourceType.POSTER_IMG_3}`, 1),
                depthX: '0.1',
            },
            {
                className: 'poster__img-wrap--4',
                src: require('../../assets/poster/4@2x.png'),
                onLoad: () => loadingEE.emit(`progress.${LoadingSourceType.POSTER_IMG_4}`, 1),
                depthX: '-0.08',
                children: (
                    <div className="poster-logos-swiper-container swiper">
                        <div className="swiper-wrapper">
                            <div className="swiper-slide swiper-slide--1"></div>
                            <div className="swiper-slide swiper-slide--2"></div>
                            <div className="swiper-slide swiper-slide--3"></div>
                            <div className="swiper-slide swiper-slide--4"></div>
                            <div className="swiper-slide swiper-slide--5"></div>
                            <div className="swiper-slide swiper-slide--6"></div>
                            <div className="swiper-slide swiper-slide--7"></div>
                            <div className="swiper-slide swiper-slide--8"></div>
                            <div className="swiper-slide swiper-slide--9"></div>
                            <div className="swiper-slide swiper-slide--10"></div>
                            <div className="swiper-slide swiper-slide--11"></div>
                            <div className="swiper-slide swiper-slide--12"></div>
                            <div className="swiper-slide swiper-slide--13"></div>
                            <div className="swiper-slide swiper-slide--14"></div>
                            <div className="swiper-slide swiper-slide--15"></div>
                            <div className="swiper-slide swiper-slide--16"></div>
                            <div className="swiper-slide swiper-slide--17"></div>
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                ),
                dots: [
                    // {
                    //     dotX: '52%',
                    //     dotY: '77%',
                    // },
                ],
            },
            {
                className: 'poster__img-wrap--5',
                src: require('../../assets/poster/5@2x.png'),
                onLoad: () => loadingEE.emit(`progress.${LoadingSourceType.POSTER_IMG_5}`, 1),
                depthX: '0.08',
                depthY: '0.08',
                dots: [
                    {
                        dotX: '17%',
                        dotY: '45%',
                        type: 'dialog',
                        render: ({ close }) => <YouTube className="poster__video" videoId={'wZ5KAc-M4Oc'} />,
                    },
                ],
            },
        ],
        [],
    );

    usePageVisible(PageType.Poster, () => {
        if (!bgRef.current) {
            return;
        }
        // 视差滚动
        const parallax = new Parallax(bgRef.current, {});
        parallax?.disable();
        // swiper
        let logosSwiper: Swiper;
        let featuresSwiper: Swiper;
        return {
            onVisible: () => {
                GAevent('webview', 'Editor-webview');
                gsap.set('.page-wrap-poster', {
                    visibility: 'visible',
                });
                handleResize();
                parallax?.enable();
                logosSwiper = new Swiper('.poster-logos-swiper-container', {
                    autoplay: true,
                    loop: true,
                    direction: 'vertical',
                    mousewheel: false,
                });
                featuresSwiper = new Swiper('.poster-features-swiper-container', {
                    autoplay: { delay: 5000 },
                    effect: 'fade',
                    fadeEffect: {
                        crossFade: true,
                    },
                    mousewheel: false,
                });

                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-poster',
                    {
                        opacity: 0,
                        // scale: 3,
                    },
                    {
                        duration: 0.5,
                        display: 'block',
                        opacity: 1,
                        // scale: 1,
                    },
                );
                return tl.then();
            },
            onHide: () => {
                parallax?.disable();
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-poster',
                    {
                        display: 'block',
                        opacity: 1,
                    },
                    {
                        duration: 0.5,
                        display: 'none',
                        opacity: 0,
                    },
                );
                return tl.then();
            },
            onDestroy: () => {
                logosSwiper?.destroy();
                featuresSwiper?.destroy();
            },
        };
    });

    // 根据原画宽高比计算出 cover 的宽高
    useEffect(() => {
        handleResize();
    }, [containerSize]);

    return (
        <div className="poster" ref={containerRef}>
            {isPortrait && <PosterBg />}
            <div className="poster__bg" ref={bgRef}>
                {posterBgConfig.map(({ className, src, children, onLoad, depthX, depthY, dots }, idx) => {
                    return (
                        <div
                            className={classNames('poster__img-wrap', className)}
                            key={idx}
                            data-depth-x={depthX}
                            data-depth-y={depthY}
                        >
                            <img className="poster__img" alt="poster-img" src={src} onLoad={onLoad} />
                            {children}
                            {dots?.length
                                ? dots.map(({ dotX, dotY, type, render, placement }, i) =>
                                      render ? (
                                          type === 'dialog' ? (
                                              <PosterDialog key={i} render={render}>
                                                  <div className="poster__point" style={{ left: dotX, top: dotY }}></div>
                                              </PosterDialog>
                                          ) : (
                                              <Popover key={i} placement={placement} render={render} hoverOpen>
                                                  <div className="poster__point" style={{ left: dotX, top: dotY }}></div>
                                              </Popover>
                                          )
                                      ) : (
                                          <div key={i} className="poster__point" style={{ left: dotX, top: dotY }}></div>
                                      ),
                                  )
                                : null}
                        </div>
                    );
                })}
            </div>
            <div className="poster__info-wrap">
                <div className="poster__info">
                    <div className="poster__slogan"></div>
                    <div className="app-sub-title poster__sub-title">THE FIRST AND ONLY GUI ONCHAIN ENGINE</div>
                    <div className="app-small-text poster__small-text-1">
                        Empowers developers to achieve composable games creation,
                        <br />
                        seamless assets deployment and permissionless open economies.
                    </div>
                    <div className="poster__features">
                        <div className="poster__features-title">Features</div>
                        <div className="poster-features-swiper-container swiper swiper-no-swiping">
                            <div className="swiper-wrapper">
                                {POSTER_FEATURES.map((feature, i) => {
                                    return (
                                        <div key={i} className="swiper-slide poster__features-item">
                                            <div className="poster__features-item-title">{feature.title}</div>
                                            <div className="poster__features-item-desc">{feature.desc}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="swiper-pagination"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <About /> */}
        </div>
    );

    function handleResize() {
        if (!bgRef.current) {
            return;
        }
        const rootDom = document.getElementById('root');
        let left = 0;
        let top = 0;
        let width = 0;
        let height = 0;
        const ratio = isPortrait ? 1 : 4196 / 2160;
        const containerW = containerSize?.width || rootDom?.offsetWidth || window.innerWidth || 1;
        const containerH = containerSize?.height || rootDom?.offsetHeight || window.innerHeight || 1;
        if (containerW / containerH >= ratio) {
            // 补充点宽高，防止视差滚动时露馅
            width = containerW + 60;
            height = width / ratio;
        } else {
            // 补充点宽高，防止视差滚动时露馅
            height = containerH + 30;
            width = ratio * height;
        }
        left = (width - containerW) / -2;
        top = (height - containerH) / -2;
        bgRef.current.style.left = `${left}px`;
        bgRef.current.style.top = `${top}px`;
        bgRef.current.style.width = `${width}px`;
        bgRef.current.style.height = `${height}px`;
    }
};
