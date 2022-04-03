import React from 'react';
import styled from 'styled-components';
import { Home } from '../home/Home';

const StyledApp = styled.div`
    width: 100%;
    height: 100%;
    position: relative;

    .logo {
        position: absolute;
        width: 112px;
        height: 55px;
        left: 56px;
        top: 57px;
        background: url(${require('../../images/logo.png')});
        z-index: 99;
    }

    .content {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
    }
`;

export const App = () => {
    return (
        <StyledApp>
            <div className='logo'></div>
            <div className='links'></div>
            <div className='nav'></div>
            <div className='content'>
                <Home />
            </div>
        </StyledApp>
    );
};
