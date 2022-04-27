import React, { useEffect, useRef, useState } from 'react';
import { HomeGL } from './components/HomeGL';
import './Home.less';
import { gsap } from 'gsap';

export const Home: React.FC = () => {
    useEffect(() => {
        gsap.set('.home__info', {
            display: 'block',
        });
        gsap.set(
            [
                '.home__slogan',
                '.home__subtitle',
                '.home__text',
                '.home__small-text-1',
                '.home__small-text-2',
            ],
            {
                opacity: 0,
            }
        );
    });

    return (
        <div className='home'>
            <HomeGL onAnimated={handleEnter} />
            <div className='home__info f-dn'>
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

    function handleEnter(model: THREE.Group) {
        console.log('handleEnter');
        const tl = gsap.timeline();
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
        tl.fromTo(
            model.scale,
            {
                x: 0.45,
                y: 0.45,
                z: 0.45,
            },
            {
                duration: 1,
                delay: -1,
                x: 0.25,
                y: 0.25,
                z: 0.25,
            }
        );
        tl.fromTo(
            [model.rotation],
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
        tl.to('.home-gl', {
            duration: 1.5,
            delay: -0.5,
            x: '15%',
        });
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
        return tl;
    }
};
