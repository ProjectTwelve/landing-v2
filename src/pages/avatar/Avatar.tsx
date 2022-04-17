import React, { useEffect, useRef, useState } from 'react';
import { AvatarGL, AvatarGLRef } from './components/AvatarGL';
import './Avatar.less';
import { AvatarType } from './Avatar.config';

export const Avatar: React.FC = () => {
    const avatarGLRef = useRef<AvatarGLRef>(null);
    const [currentAvatar, setCurrentAvatar] = useState<AvatarType>(
        AvatarType.NORMAL
    );

    useEffect(() => {
        avatarGLRef.current?.switchTo(currentAvatar);
    }, [currentAvatar]);

    return (
        <div className='avatar'>
            <AvatarGL ref={avatarGLRef} />
        </div>
    );
};
