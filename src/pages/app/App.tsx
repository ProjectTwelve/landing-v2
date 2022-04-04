import React from 'react';
import styled from 'styled-components';
import { Home } from '../home/Home';
import './App.less';

export const App = () => {
    return (
        <div className='app'>
            <div className='logo'></div>
            <div className='links'></div>
            <div className='nav'></div>
            <div className='content'>
                <Home />
            </div>
        </div>
    );
};
