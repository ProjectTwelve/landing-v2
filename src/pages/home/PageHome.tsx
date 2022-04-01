import React, { useEffect, useRef, useState } from "react";
import { PageHomeGL } from "./PageHomeGL";
import { StyledPageHome } from "./styled/StyledPageHome";

export const PageHome: React.FC = () => {
    return (
        <StyledPageHome>
            <PageHomeGL />
        </StyledPageHome>
    );
};
