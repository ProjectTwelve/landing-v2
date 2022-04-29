import { useSize } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Parallax from 'parallax-js';
import Swiper, { Autoplay } from 'swiper';
import 'swiper/css';
// import SwiperCore, { Autoplay } from 'swiper';
// import { Swiper, SwiperSlide } from 'swiper/react';
import './Poster.less';
import { usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';
import gsap from 'gsap';
Swiper.use([Autoplay]);

export const Poster: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerRef);

    // 视差滚动
    useEffect(() => {
        if (!bgRef.current) {
            return;
        }
        // 实例化
        const swiper = new Swiper('.poster-swiper-container', {
            autoplay: true,
            loop: true,
            direction: 'vertical',
        });
        return () => {
            swiper.destroy();
        };
    }, []);

    usePageVisible(PageType.Poster, () => {
        if (!bgRef.current) {
            return;
        }
        // 视差滚动
        const parallaxInstance = new Parallax(bgRef.current, {});

        return {
            onVisible: () => {
                gsap.set('.poster', {
                    display: 'block',
                });
            },
            onHide: () => {
                gsap.set('.poster', {
                    display: 'none',
                });
            },
            onDestroy: () => {
                parallaxInstance.destroy();
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
        if (containerSize) {
            if (containerSize.width / containerSize.height >= ratio) {
                // 补充点宽高，防止视差滚动时露馅
                width = containerSize.width + 60;
                height = width / ratio;
            } else {
                // 补充点宽高，防止视差滚动时露馅
                height = containerSize.height + 30;
                width = ratio * height;
            }
            left = (width - containerSize.width) / -2;
            top = (height - containerSize.height) / -2;
        }
        bgRef.current.style.left = `${left}px`;
        bgRef.current.style.top = `${top}px`;
        bgRef.current.style.width = `${width}px`;
        bgRef.current.style.height = `${height}px`;
    }, [containerSize]);

    return (
        <div className='poster' ref={containerRef}>
            <div className='poster__bg' ref={bgRef}>
                <div className='poster__img poster__img--0'></div>
                <div
                    data-depth-x='0.05'
                    data-depth-y='-0.1'
                    className='poster__img poster__img--1'
                ></div>
                <div
                    data-depth-x='-0.05'
                    className='poster__img poster__img--2'
                ></div>
                <div
                    data-depth-x='0.1'
                    className='poster__img poster__img--3'
                ></div>
                <div data-depth='-0.08' className='poster__img poster__img--4'>
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
                    className='poster__img poster__img--5'
                ></div>
            </div>
        </div>
    );
};
