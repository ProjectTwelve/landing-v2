import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import './Tree.less';

export const Tree: React.FC = () => {
    usePageVisible(PageType.Tree, () => {
        return {
            onVisible: () => {
                gsap.set('.tree', {
                    display: 'block',
                });
            },
            onHide: () => {
                gsap.set('.tree', {
                    display: 'none',
                });
            },
        };
    });
    return (
        <div className='tree'>
            <div className='tree__content'></div>
            <div className='tree__info'></div>
        </div>
    );
};
