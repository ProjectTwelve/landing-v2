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
                tl.set('.home', {
                    display: 'block',
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
                homeGLRef.current?.ballModel &&
                    tl.fromTo(
                        homeGLRef.current?.ballModel.scale,
                        {
                            x: 0.45 * 10,
                            y: 0.45 * 10,
                            z: 0.45 * 10,
                        },
                        {
                            duration: 1,
                            delay: -1,
                            x: 0.25 * 10,
                            y: 0.25 * 10,
                            z: 0.25 * 10,
                        }
                    );
                homeGLRef.current?.ballModel &&
                    tl.fromTo(
                        [homeGLRef.current?.ballModel.rotation],
                        {
                            y: Math.PI * -2.5,
                        },
                        {
                            duration: 2,
                            delay: -1,
                            ease: 'power2.out',
                            y: 0,
                        }
                    );
                tl.fromTo(
                    '.home-gl',
                    { x: 0 },
                    {
                        duration: 1.5,
                        delay: -0.5,
                        x: '15%',
                    }
                );
                tl.fromTo(
                    '.home__slogan',
                    {
                        y: 200,
                        opacity: 0,
                    },
                    {
                        duration: 0.4,
                        delay: -0.38,
                        y: 0,
                        opacity: 1,
                    }
                );
                tl.fromTo(
                    '.home__subtitle',
                    {
                        y: 200,
                        opacity: 0,
                    },
                    {
                        duration: 0.4,
                        delay: -0.2,
                        y: 0,
                        opacity: 1,
                    }
                );
                tl.fromTo(
                    '.home__text',
                    {
                        y: 200,
                        opacity: 0,
                    },
                    {
                        duration: 0.4,
                        delay: -0.2,
                        y: 0,
                        opacity: 1,
                    }
                );
                tl.fromTo(
                    ['.home__small-text-1', '.home__small-text-2'],
                    {
                        y: 200,
                        opacity: 0,
                    },
                    {
                        duration: 0.4,
                        delay: -0.2,
                        y: 0,
                        opacity: 1,
                    }
                );
                tl.fromTo(
                    '.home-gl .home-label-canvas',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 0.6,
                        opacity: 1,
                    }
                );
            },
            onHide: () => {
                gsap.set('.home', {
                    display: 'none',
                });
            },
        };
    });

    return (
        <div className='home'>
            <HomeGL ref={homeGLRef} />
            <div className='home__info'>
                <div className='home__slogan'></div>
                <div className='home__subtitle'>Empowering Metaworld</div>
                <div className='home__text'>
                    NOMOCRAC
                    <i className='home__text-block'></i>
                </div>
                <div className='home__small-text-1'>
                    A Metaverse Economy Backbone.
                </div>
                <div className='home__small-text-2'>
                    A complete set of technologies, tools,and services-
                    <br />
                    for developers, players,and merchants alike
                </div>
            </div>
        </div>
    );
};
