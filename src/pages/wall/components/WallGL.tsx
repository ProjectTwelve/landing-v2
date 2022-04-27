/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { getPublicAssetPath } from '../../../utils';
import './WallGL.less';

export const WallGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        // 开始渲染 GL
        return () => {
            // 清除GL
        };
    }, []);
    return <div className='wall-gl' ref={containerRef} />;
};
