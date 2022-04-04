import React, { useEffect, useRef, useState } from 'react';
import { AvatarGL } from './components/AvatarGL';
import './Avatar.less';

export const Avatar: React.FC = () => {
    return (
        <div className='avatar'>
            <div className='avatar__info'></div>
            <AvatarGL />
        </div>
    );
};
