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
                        duration: 1,
                        opacity: 1,
                    }
                );
                homeGLRef.current?.ballModel &&
                    tl.fromTo(
                        homeGLRef.current?.ballModel.scale,
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
                homeGLRef.current?.ballModel &&
                    tl.fromTo(
                        [homeGLRef.current?.ballModel.rotation],
                        {
                            y: Math.PI * -2,
                        },
                        {
                            y: Math.PI * -1,
                            duration: 1,
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
                <div className='app-sub-title home__sub-title'>
                    EDITOR<i className='app-sub-title__block'></i>INFRA
                    <i className='app-sub-title__block'></i>ECONS
                </div>
                <div className='app-small-title app-small-title--with-block home__small-title'>
                    Empowering Metaworld
                </div>
                <div className='app-small-text home__small-text-1'>
                    Project Twelve, P12 for short, is a GameFi ecosystem
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
