import React from 'react';
import styled from 'styled-components';
import { PageHome } from './pages/home/PageHome';
import { PageTree } from './pages/tree/PageTree';

const StyledApp = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
`;

function App() {
    return (
        <StyledApp>
            <PageHome />
            <PageTree />
        </StyledApp>
    );
}

export default App;
