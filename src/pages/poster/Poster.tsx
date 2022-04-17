import { useSize } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Parallax from 'parallax-js';
import './Poster.less';

export const Poster: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerRef);

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
                width = containerSize.width + 100;
                height = width / ratio;
            } else {
                // 补充点宽高，防止视差滚动时露馅
                height = containerSize.height + 70;
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

    useEffect(() => {
        if (!bgRef.current) {
            return;
        }
        const parallaxInstance = new Parallax(bgRef.current, {});
        return () => {
            parallaxInstance.destroy();
        };
    }, []);

    return (
        <div className='poster' ref={containerRef}>
            <div className='poster__bg' ref={bgRef}>
                <div
                    data-depth-x='0.05'
                    data-depth-y='0.05'
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
                <div
                    data-depth='-0.08'
                    className='poster__img poster__img--4'
                ></div>
                <div
                    data-depth-x='0.08'
                    data-depth-y='0.08'
                    className='poster__img poster__img--5'
                ></div>
            </div>
        </div>
    );
};
