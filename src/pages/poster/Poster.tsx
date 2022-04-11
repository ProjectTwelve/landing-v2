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
                left = 0;
                top = (containerSize.width / ratio - containerSize.height) / -2;
                width = containerSize.width;
                height = containerSize.width / ratio;
            } else {
                left =
                    (ratio * containerSize.height - containerSize.width) / -2;
                top = 0;
                width = ratio * containerSize.height;
                height = containerSize.height;
            }
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
                    data-depth-x='0'
                    className='poster__img poster__img--1'
                ></div>
                <div
                    data-depth-x='-0.15'
                    className='poster__img poster__img--2'
                ></div>
                <div
                    data-depth-x='0.1'
                    className='poster__img poster__img--3'
                ></div>
                <div
                    data-depth='-0.2'
                    className='poster__img poster__img--4'
                ></div>
                <div
                    data-depth='0.3'
                    className='poster__img poster__img--5'
                ></div>
            </div>
        </div>
    );
};
