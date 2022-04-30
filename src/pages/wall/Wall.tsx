import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import { WallGL } from './components/WallGL';
import './Wall.less';

export const Wall: React.FC = () => {
    usePageVisible(PageType.Wall, () => {
        return {
            onVisible: () => {
                gsap.set('.page-wrap-wall', {
                    display: 'block',
                });
            },
            onHide: () => {
                gsap.set('.page-wrap-wall', {});
            },
        };
    });
    return (
        <div className='wall'>
            <WallGL />
            <div className='wall__info'>
                <div className='wall__title-1'>Investor &amp; Partners</div>
                <div className='wall__dot-1'></div>
                <div className='wall__logo-1'></div>
                <div className='wall__title-2'>Security Auditors</div>
                <div className='wall__dot-2'></div>
                <div className='wall__logo-2'></div>
            </div>
        </div>
    );
};
