/* eslint-disable */
import React, { useEffect, useRef } from 'react';
import { getPublicAssetPath } from '../../../utils';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import './WallGL.less';

export const WallGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    usePageVisible(PageType.Wall, () => {
        if (!containerRef.current) {
            return;
        }
        const container = containerRef.current;
        // 处理加载等逻辑

        return {
            onVisible: () => {
                // 界面显示的逻辑，加载副作用
            },
            onHide: () => {
                // 界面隐藏的逻辑，清除负作用
            },
            onDestroy: () => {
                // 组件 unMount
            },
        };
    });

    return <div className='wall-gl' ref={containerRef} />;
};
