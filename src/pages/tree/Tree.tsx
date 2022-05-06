import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import './Tree.less';

export const Tree: React.FC = () => {
    usePageVisible(PageType.Tree, () => {
        return {
            onVisible: () => {
                gsap.set('.page-wrap-tree', {
                    display: 'block',
                });
            },
            onHide: () => {
                gsap.set('.page-wrap-tree', {
                    display: 'none',
                });
            },
            onDestroy: () => {},
        };
    });
    return (
        <div className='tree'>
            <div className='tree__content'></div>
            <div className='tree__info'>
                <div className='tree__slogan'></div>
                <div className='app-small-title app-small-title--with-block tree__small-title'>
                    FOR SUSTAINABILITY AND PROSPERITY
                </div>
                <div className='app-small-text tree__small-text-1'>
                    A series of economic and governmental rules have been
                    <br />
                    implemented in the P12 Econs. Key mechanisms are:
                </div>
            </div>
        </div>
    );
};
