import React, { useRef } from 'react';
import { AppBg } from './components/AppBg';
import './App.less';
import { Home } from '../home/Home';
import { Avatar } from '../avatar/Avatar';
import { Tree } from '../tree/Tree';
import { Poster } from '../poster/Poster';

export const App = () => {
    return (
        <div className='app'>
            <AppBg />
            <div className='logo'></div>
            <div className='links'></div>
            <div className='nav'></div>
            <div className='content'>
                <Home />
                <Avatar />
                <Tree />
                <Poster />
            </div>
        </div>
    );
};
