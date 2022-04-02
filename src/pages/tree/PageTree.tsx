import React, { useEffect, useRef, useState } from 'react';
import { PageTreeGL } from './PageTreeGL';
import { StyledPageTree } from './styled/StyledPageTree';

export const PageTree: React.FC = () => {
    return (
        <StyledPageTree>
            <PageTreeGL />
        </StyledPageTree>
    );
};
