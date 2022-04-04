import React, { useRef } from 'react';
import { Home } from '../home/Home';
import './App.less';
import { useRenderAppBg } from './hooks/useRenderAppBg';

export const App = () => {
    const bgRef = useRef<HTMLDivElement>(null);
    useRenderAppBg(bgRef);

    return (
        <div className='app'>
            <div className='app-bg' ref={bgRef}></div>
            <div className='logo'></div>
            <div className='links'></div>
            <div className='nav'></div>
            <div className='content'>
                <Home />
            </div>
        </div>
    );
};
