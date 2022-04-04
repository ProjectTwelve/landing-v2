import React, { useEffect, useRef, useState } from 'react';
import { HomeGL } from './components/HomeGL';
import './Home.less';

export const Home: React.FC = () => {
    return (
        <div className='home'>
            <canvas
                id='canvas'
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                }}
            ></canvas>
            <HomeGL />
        </div>
    );
};
