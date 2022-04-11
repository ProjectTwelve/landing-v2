import { useSize } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Poster.less';

export const Poster: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerRef);

    // 根据原画宽高比计算出 cover 的宽高
    const coverBgSize = useMemo(() => {
        const originWidth = 4196;
        const originHeight = 2160;
        const ratio = originWidth / originHeight;
        if (!containerSize) {
            return { width: 0, height: 0 };
        } else {
            if (containerSize.width / containerSize.height >= ratio) {
                return {
                    width: containerSize.width,
                    height: containerSize.width / ratio,
                };
            } else {
                return {
                    width: ratio * containerSize.height,
                    height: containerSize.height,
                };
            }
        }
    }, [containerSize]);

    return (
        <div className='poster' ref={containerRef}>
            <div
                className='poster__bg'
                style={{ width: coverBgSize.width, height: coverBgSize.height }}
            >
                <div className='poster__img poster__img--1'></div>
                <div className='poster__img poster__img--2'></div>
                <div className='poster__img poster__img--3'></div>
                <div className='poster__img poster__img--4'></div>
                <div className='poster__img poster__img--5'></div>
            </div>
        </div>
    );
};
