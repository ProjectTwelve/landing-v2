import React, { useEffect, useRef, useState } from 'react';
import { WallGL } from './components/WallGL';
import './Wall.less';

export const Wall: React.FC = () => {
    return (
        <div className='wall'>
            <WallGL />
        </div>
    );
};
