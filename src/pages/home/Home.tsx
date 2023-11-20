import { gsap } from 'gsap';
import React, { useRef } from 'react';
import { GAevent } from '../../utils';
import { PageType } from '../app/App.config';
import { usePageVisible } from '../app/App.utils';
import './Home.less';
import { HomeGL, HomeGLRef } from './components/HomeGL';

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
                    },
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
                        },
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
                        },
                    );
                tl.fromTo(
                    ['.home__info', '.home-gl .home-label-canvas'],
                    {
                        opacity: 0,
                    },
                    {
                        duration: 2,
                        opacity: 1,
                    },
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
                    },
                );
                return tl.then();
            },
            onDestroy: () => {},
        };
    });

    return (
        <div className="home">
            {/* <ButterflyGL page={PageType.Home} /> */}
            <HomeGL ref={homeGLRef} />
            <div className="home__info">
                <div className="home__slogan"></div>
                <div className="app-small-title app-small-title--with-block home__small-title">GUI Onchain Engine</div>
                <div className="app-small-text home__small-text-1">
                    P12 is building the first and only GUI Onchain Engine <br /> for onchain games and autonomous worlds
                </div>
            </div>
        </div>
    );
};
