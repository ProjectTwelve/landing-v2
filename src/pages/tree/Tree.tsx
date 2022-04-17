import React, { useEffect, useRef, useState } from 'react';
import './Tree.less';

export const Tree: React.FC = () => {
    return (
        <div className='tree'>
            <div className='tree__content'></div>
            <div className='tree__info'></div>
        </div>
    );
};
