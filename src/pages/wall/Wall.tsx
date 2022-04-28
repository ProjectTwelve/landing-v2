import React, { useEffect, useRef, useState } from 'react';
import { WallGL } from './components/WallGL';
import './Wall.less';

export const Wall: React.FC = () => {
    return (
        <div className='wall'>
            <WallGL />
            <div className='wall__info'>
                <div className='wall__title-1'>Investor &amp; Partners</div>
                <div className='wall__dot-1'></div>
                <div className='wall__logo-1'></div>
                <div className='wall__title-2'>Security Auditors</div>
                <div className='wall__dot-2'></div>
                <div className='wall__logo-2'></div>
            </div>
        </div>
    );
};
