import { useSize } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Parallax from 'parallax-js';
import Swiper, { Autoplay } from 'swiper';
import 'swiper/css';
// import SwiperCore, { Autoplay } from 'swiper';
// import { Swiper, SwiperSlide } from 'swiper/react';
import './Poster.less';
import { loadingEE, LoadingSourceType, usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';
import gsap from 'gsap';
Swiper.use([Autoplay]);

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
        let swiper: Swiper;

        return {
            onVisible: () => {
                gsap.set('.page-wrap-poster', {
                    display: 'block',
                });

                parallax?.enable();
                swiper = new Swiper('.poster-swiper-container', {
                    autoplay: true,
                    loop: true,
                    direction: 'vertical',
                });
            },
            onHide: () => {
                gsap.set('.page-wrap-poster', {
                    display: 'none',
                });

                parallax?.disable();
                swiper?.destroy();
            },
            onDestroy: () => {
                parallax?.destroy();
            },
        };
    });

    // 根据原画宽高比计算出 cover 的宽高
    useEffect(() => {
        if (!bgRef.current) {
            return;
        }
        let left = 0;
        let top = 0;
        let width = 0;
        let height = 0;
        const ratio = 4196 / 2160;
        const containerW = containerSize?.width || window.innerWidth || 1;
        const containerH = containerSize?.height || window.innerHeight || 1;
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
    }, [containerSize]);

    return (
        <div className='poster' ref={containerRef}>
            <div className='poster__bg' ref={bgRef}>
                <div className='poster__img-wrap poster__img-wrap--0'>
                    <img
                        className='poster__img'
                        alt='poster-img'
                        src={require('../../assets/poster/0.jpg')}
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
                        src={require('../../assets/poster/1.png')}
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
                        src={require('../../assets/poster/2.png')}
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
                        src={require('../../assets/poster/3.png')}
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
                        src={require('../../assets/poster/4.png')}
                        onLoad={() =>
                            loadingEE.emit(
                                `progress.${LoadingSourceType.POSTER_IMG_4}`,
                                1
                            )
                        }
                    />
                    <div className='poster-swiper-container swiper-container'>
                        <div className='swiper-wrapper'>
                            <div className='swiper-slide swiper-slide--1'></div>
                            <div className='swiper-slide swiper-slide--2'></div>
                            <div className='swiper-slide swiper-slide--3'></div>
                            <div className='swiper-slide swiper-slide--4'></div>
                            <div className='swiper-slide swiper-slide--5'></div>
                            <div className='swiper-slide swiper-slide--6'></div>
                            <div className='swiper-slide swiper-slide--7'></div>
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
                        src={require('../../assets/poster/5.png')}
                        onLoad={() =>
                            loadingEE.emit(
                                `progress.${LoadingSourceType.POSTER_IMG_5}`,
                                1
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};
