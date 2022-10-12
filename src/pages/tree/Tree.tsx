import gsap from 'gsap';
import React, { lazy, useEffect, useRef, useState } from 'react';
import { playClickAudio, GAevent } from '../../utils';
import { PageType } from '../app/App.config';
import { loadingEE, usePageVisible } from '../app/App.utils';
import './Tree.less';

const TreeGL = lazy(() => import('./components/TreeGL'))

export const Tree: React.FC = () => {
    const [ready, serReady] = useState(false);

    useEffect(() => {
        loadingEE.on('loaded', () => {
            setTimeout(() => {
                serReady(true);
            }, 1500);
        });
    }, []);

    usePageVisible(PageType.Tree, () => {
        return {
            onVisible: () => {
                GAevent('webview','Econs-webview');
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-tree',
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
                    '.page-wrap-tree',
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
            onDestroy: () => {},
        };
    });
    return (
        <div className='tree'>
            {/* <div className='tree__content'></div> */}
            {ready ? <TreeGL /> : null}
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
                    For in-depth discussion on Econs, refer to
                </div>
                <a
                    className='tree__extra-link'
                    href='https://p12.dev/whitepaper'
                    target='_blank'
                    onClick={() => {
                        GAevent('event','Econs-Whitepaper');
                        playClickAudio();
                    }}
                ></a>
            </div>
        </div>
    );
};
