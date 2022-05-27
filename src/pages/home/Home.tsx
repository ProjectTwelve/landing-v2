import React, { useContext, useEffect, useRef, useState } from 'react';
import { HomeGL, HomeGLRef } from './components/HomeGL';
import './Home.less';
import { gsap } from 'gsap';
import { AppContext, usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';
import { ButterflyGL } from '../../components/butterfly-gl/ButterflyGL';
import { GAevent } from '../../utils';

export const Home: React.FC = () => {
    const homeGLRef = useRef<HomeGLRef>(null);

    usePageVisible(PageType.Home, () => {
        return {
            onVisible: () => {
                GAevent('webview', 'Vision-webview');
                const tl = gsap.timeline();
                tl.set('.page-wrap-home', {
                    display: 'block',
                    opacity: 1,
                    scale: 1,
                });
                tl.fromTo(
                    '.home-gl',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 1,
                        opacity: 1,
                    }
                );
                homeGLRef.current?.group &&
                    tl.fromTo(
                        homeGLRef.current?.group.scale,
                        {
                            x: 2,
                            y: 2,
                            z: 2,
                        },
                        {
                            duration: 1,
                            ease: 'power2.out',
                            delay: -1,
                            x: 1,
                            y: 1,
                            z: 1,
                        }
                    );
                const initRotation = {
                    x: 1.96,
                    y: 0.38,
                    z: 1.06,
                };
                homeGLRef.current?.group &&
                    tl.fromTo(
                        [homeGLRef.current?.group.rotation],
                        {
                            x: initRotation.x + Math.PI * 0.5,
                            y: initRotation.y,
                            z: initRotation.z - Math.PI * 0.75,
                        },
                        {
                            ...initRotation,
                            duration: 2,
                            delay: -1,
                            ease: 'power2.out',
                        }
                    );
                tl.fromTo(
                    ['.home__info', '.home-gl .home-label-canvas'],
                    {
                        opacity: 0,
                    },
                    {
                        duration: 2,
                        opacity: 1,
                    }
                );
                return tl.then();
            },
            onHide: () => {
                const tl = gsap.timeline();
                tl.fromTo(
                    '.page-wrap-home',
                    {
                        display: 'block',
                        opacity: 1,
                    },
                    {
                        duration: 0.8,
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
        <div className='home'>
            <ButterflyGL page={PageType.Home} />
            <HomeGL ref={homeGLRef} />
            <div className='home__info'>
                <div className='home__slogan'></div>
                <div className='app-sub-title home__sub-title'>
                    EDITOR<i className='app-sub-title__block'></i>INFRA
                    <i className='app-sub-title__block'></i>ECONS
                </div>
                <div className='app-small-title app-small-title--with-block home__small-title'>
                    Empowering Metaworlds
                </div>
                <div className='app-small-text home__small-text-1'>
                    Project Twelve, P12 in short, is a GameFi ecosystem
                    <br /> with sustainable economy
                </div>
                <div className='app-small-text home__small-text-2'>
                    The scope of the project covers the Editor, the Infra,
                    <br /> and the Econs
                </div>
            </div>
        </div>
    );
};
