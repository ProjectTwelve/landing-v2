import React from 'react';
import styled from 'styled-components';
import { Home } from './pages/home/Home';

const StyledApp = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
`;

function App() {
    return (
        <StyledApp>
            <Home />
        </StyledApp>
    );
}

export default App;
