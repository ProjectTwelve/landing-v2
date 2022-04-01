import React from "react";
import { PageHome } from "./pages/home/PageHome";
import styled from "styled-components";

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
        </StyledApp>
    );
}

export default App;
