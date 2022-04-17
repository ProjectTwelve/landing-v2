import React, { useEffect, useRef, useState } from 'react';
import { HomeGL } from './components/HomeGL';
import './Home.less';

export const Home: React.FC = () => {
    return (
        <div className='home'>
            <HomeGL />
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
                <div className='home__btn-wrap'>
                    <div className='home__btn home__btn--left'></div>
                    <div className='home__btn home__btn--right'></div>
                </div>
            </div>
        </div>
    );
};
