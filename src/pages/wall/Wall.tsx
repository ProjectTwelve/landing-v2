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
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-wall',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 0.5,
                        display: 'block',
                        opacity: 1,
                    }
                );
                return tl.then();
            },
            onHide: () => {
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-wall',
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
        };
    });
    return (
        <div className='wall'>
            <WallGL />
            <div className='wall__info'>
                <div className='wall__title-1'>Investors &amp; Partners</div>
                <div className='wall__dot-1'></div>
                <div className='wall__logo-1'></div>
                <div className='wall__title-2'>Security Auditors</div>
                <div className='wall__dot-2'></div>
                <div className='wall__logo-2'></div>
            </div>
        </div>
    );
};
