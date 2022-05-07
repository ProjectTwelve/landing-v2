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
                <div className='tree__details'>
                    <div className='tree__detail'>→ Swap</div>
                    <div className='tree__detail'>→ CastDelay</div>
                    <div className='tree__detail'>→ Meritocracy</div>
                    <div className='tree__detail'>→ GameMaster</div>
                </div>
            </div>
            <div className='tree__extra'>
                <div className='tree__extra-info'>
                    For in-depth discussion on
                    <br />
                    the Econs, refer to the
                </div>
                <div className='tree__extra-desc'>P12 Economic Whitepaper</div>
                <a
                    className='tree__extra-link'
                    href='https://baidu.com'
                    target='_blank'
                ></a>
            </div>
        </div>
    );
};
