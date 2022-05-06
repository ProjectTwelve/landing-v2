import React, { useContext, useEffect, useRef, useState } from 'react';
import { HomeGL, HomeGLRef } from './components/HomeGL';
import './Home.less';
import { gsap } from 'gsap';
import { usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';

export const Home: React.FC = () => {
    const homeGLRef = useRef<HomeGLRef>(null);

    usePageVisible(PageType.Home, () => {
        return {
            onVisible: () => {
                const tl = gsap.timeline();
                tl.set('.page-wrap-home', {
                    display: 'block',
                });
                tl.fromTo(
                    '.home-gl',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 2,
                        opacity: 1,
                    }
                );
                homeGLRef.current?.ballModel &&
                    tl.fromTo(
                        homeGLRef.current?.ballModel.scale,
                        {
                            x: 0.45 * 10,
                            y: 0.45 * 10,
                            z: 0.45 * 10,
                        },
                        {
                            duration: 2,
                            ease: 'power2.out',
                            delay: -1.9,
                            x: 0.25 * 10,
                            y: 0.25 * 10,
                            z: 0.25 * 10,
                        }
                    );
                homeGLRef.current?.ballModel &&
                    tl.fromTo(
                        [homeGLRef.current?.ballModel.rotation],
                        {
                            y: Math.PI * -1,
                        },
                        {
                            duration: 3,
                            delay: -2,
                            ease: 'power2.out',
                            y: 0,
                        }
                    );
                tl.fromTo(
                    ['.home__info', '.home-gl .home-label-canvas'],
                    {
                        opacity: 0,
                    },
                    {
                        duration: 0.5,
                        opacity: 1,
                    }
                );
            },
            onHide: () => {
                gsap.set('.page-wrap-home', {
                    display: 'none',
                });
            },
            onDestroy: () => {},
        };
    });

    return (
        <div className='home'>
            <HomeGL ref={homeGLRef} />
            <div className='home__info'>
                <div className='home__slogan'></div>
                <div className='app-sub-title home__sub-title'>Metaworld</div>
                <div className='app-small-title home__small-title'>
                    NOMOCRAC
                </div>
                <div className='app-small-text home__small-text-1'>
                    A Metaverse Economy Backbone.
                </div>
                <div className='app-small-text home__small-text-2'>
                    A complete set of technologies, tools,and services-
                    <br />
                    for developers, players,and merchants alike
                </div>
            </div>
        </div>
    );
};
