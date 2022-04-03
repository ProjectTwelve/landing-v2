import React from 'react';
import styled from 'styled-components';
import { Home } from '../home/Home';

const StyledApp = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
`;

export const App = () => {
    return (
        <StyledApp>
            <Home />
        </StyledApp>
    );
};
