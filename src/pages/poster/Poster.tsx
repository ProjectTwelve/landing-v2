import { useSize } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Parallax from 'parallax-js';
import Swiper, { Autoplay, EffectFade } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import './Poster.less';
import { loadingEE, LoadingSourceType, usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';
import gsap from 'gsap';
import { POSTER_FEATURES } from './Poster.config';
import { IS_MOBILE, GAevent, requestOrientationPermission } from '../../utils';
Swiper.use([Autoplay, EffectFade]);

export const Poster: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerRef);

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

        // 后台默默渲染，性能优化用
        document
            .getElementsByClassName('page-wrap-poster')[0]
            ?.classList.add('back-render');
        setTimeout(() => {
            document
                .getElementsByClassName('.page-wrap-poster')[0]
                ?.classList.remove('back-render');
        }, 1000);
        return {
            onVisible: () => {
                GAevent('webview', 'Editor-webview');
                gsap.set('.page-wrap-poster', {
                    visibility: 'visible',
                });

                handleResize();

                requestOrientationPermission().then(() => {
                    parallax?.enable();
                });
                logosSwiper = new Swiper('.poster-logos-swiper-container', {
                    autoplay: true,
                    loop: true,
                    direction: 'vertical',
                    mousewheel: false,
                });
                featuresSwiper = new Swiper(
                    '.poster-features-swiper-container',
                    {
                        autoplay: true,
                        effect: 'fade',
                        fadeEffect: {
                            crossFade: true,
                        },
                        mousewheel: false,
                    }
                );

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
                    }
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
                    }
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
        <div className='poster' ref={containerRef}>
            <div className='poster__bg' ref={bgRef}>
                <div className='poster__img-wrap poster__img-wrap--0'>
                    <img
                        className='poster__img'
                        alt='poster-img'
                        src={
                            IS_MOBILE
                                ? require('../../assets/poster/0@0.2x.jpg')
                                : require('../../assets/poster/0@2x.jpg')
                        }
                        onLoad={() =>
                            loadingEE.emit(
                                `progress.${LoadingSourceType.POSTER_IMG_0}`,
                                1
                            )
                        }
                    />
                </div>
                <div
                    data-depth-x='0.05'
                    data-depth-y='-0.1'
                    className='poster__img-wrap poster__img-wrap--1'
                >
                    <img
                        className='poster__img'
                        alt='poster-img'
                        src={
                            IS_MOBILE
                                ? require('../../assets/poster/1@0.2x.png')
                                : require('../../assets/poster/1@2x.png')
                        }
                        onLoad={() =>
                            loadingEE.emit(
                                `progress.${LoadingSourceType.POSTER_IMG_1}`,
                                1
                            )
                        }
                    />
                </div>
                <div
                    data-depth-x='-0.05'
                    className='poster__img-wrap poster__img-wrap--2'
                >
                    <img
                        className='poster__img'
                        alt='poster-img'
                        src={
                            IS_MOBILE
                                ? require('../../assets/poster/2@0.2x.png')
                                : require('../../assets/poster/2@2x.png')
                        }
                        onLoad={() =>
                            loadingEE.emit(
                                `progress.${LoadingSourceType.POSTER_IMG_2}`,
                                1
                            )
                        }
                    />
                </div>
                <div
                    data-depth-x='0.1'
                    className='poster__img-wrap poster__img-wrap--3'
                >
                    <img
                        className='poster__img'
                        alt='poster-img'
                        src={
                            IS_MOBILE
                                ? require('../../assets/poster/3@0.2x.png')
                                : require('../../assets/poster/3@2x.png')
                        }
                        onLoad={() =>
                            loadingEE.emit(
                                `progress.${LoadingSourceType.POSTER_IMG_3}`,
                                1
                            )
                        }
                    />
                </div>
                <div
                    data-depth='-0.08'
                    className='poster__img-wrap poster__img-wrap--4'
                >
                    <img
                        className='poster__img'
                        alt='poster-img'
                        src={
                            IS_MOBILE
                                ? require('../../assets/poster/4@0.2x.png')
                                : require('../../assets/poster/4@2x.png')
                        }
                        onLoad={() =>
                            loadingEE.emit(
                                `progress.${LoadingSourceType.POSTER_IMG_4}`,
                                1
                            )
                        }
                    />
                    <div className='poster-logos-swiper-container swiper-container'>
                        <div className='swiper-wrapper '>
                            <div className='swiper-slide swiper-slide--1'></div>
                            <div className='swiper-slide swiper-slide--2'></div>
                            <div className='swiper-slide swiper-slide--3'></div>
                            <div className='swiper-slide swiper-slide--4'></div>
                            <div className='swiper-slide swiper-slide--5'></div>
                            <div className='swiper-slide swiper-slide--6'></div>
                            <div className='swiper-slide swiper-slide--7'></div>
                            <div className='swiper-slide swiper-slide--8'></div>
                            <div className='swiper-slide swiper-slide--9'></div>
                            <div className='swiper-slide swiper-slide--10'></div>
                        </div>
                        <div className='swiper-pagination'></div>
                    </div>
                </div>
                <div
                    data-depth-x='0.08'
                    data-depth-y='0.08'
                    className='poster__img-wrap poster__img-wrap--5'
                >
                    <img
                        className='poster__img'
                        alt='poster-img'
                        src={
                            IS_MOBILE
                                ? require('../../assets/poster/5@0.2x.png')
                                : require('../../assets/poster/5@2x.png')
                        }
                        onLoad={() =>
                            loadingEE.emit(
                                `progress.${LoadingSourceType.POSTER_IMG_5}`,
                                1
                            )
                        }
                    />
                </div>
            </div>
            <div className='poster__info-wrap'>
                <div className='poster__info'>
                    <div className='poster__slogan'></div>
                    <div className='app-sub-title poster__sub-title'>
                        BEST METAVERSE EDITOR IN WEB3
                    </div>
                    <div className='app-small-text poster__small-text-1'>
                        by a top R&amp;D team with 500+ people that built a 12
                        million DAU gaming platform
                    </div>
                    <div className='app-small-text poster__small-text-2'>
                        The Editor is backed by a strong R&amp;D team with
                        proven track record in gaming.
                    </div>
                    <div className='poster__features'>
                        <div className='poster__features-title'>Features</div>
                        <div className='poster-features-swiper-container swiper-container swiper-no-swiping'>
                            <div className='swiper-wrapper'>
                                {POSTER_FEATURES.map((feature, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className='swiper-slide poster__features-item'
                                        >
                                            <div className='poster__features-item-title'>
                                                {feature.title}
                                            </div>
                                            <div className='poster__features-item-desc'>
                                                {feature.desc}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='swiper-pagination'></div>
                        </div>
                    </div>
                </div>
            </div>
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
        const ratio = 4196 / 2160;
        const containerW =
            containerSize?.width ||
            rootDom?.offsetWidth ||
            window.innerWidth ||
            1;
        const containerH =
            containerSize?.height ||
            rootDom?.offsetHeight ||
            window.innerHeight ||
            1;
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
