import React, { useEffect, useRef, useState } from 'react';
import { AvatarGL, AvatarGLRef } from './components/AvatarGL';
import './Avatar.less';
import { AvatarType, AvatarTypeArray } from './Avatar.config';

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
            <div className='avatar__info'>
                <div className='avatar__slogan'></div>
                <div className='avatar__subtitle'>Game Character</div>
                <div className='avatar__text'>NOMOCRAC</div>
                <div className='avatar__small-text-1'>
                    A Metaverse Economy Backbone.
                </div>
                <div className='avatar__small-text-2'>
                    A complete set of technologies, tools,and services-
                    <br />
                    for developers, players,and merchants alike
                </div>
                <div className='avatar__btn-wrap'>
                    <div
                        className='avatar__btn avatar__btn--left'
                        onClick={handlePrev}
                    ></div>
                    <div
                        className='avatar__btn avatar__btn--right'
                        onClick={handleNext}
                    ></div>
                </div>
            </div>
        </div>
    );

    function handlePrev() {
        const newIndex =
            (AvatarTypeArray.indexOf(currentAvatar) -
                1 +
                AvatarTypeArray.length) %
                AvatarTypeArray.length || 0;
        setCurrentAvatar(AvatarTypeArray[newIndex]);
    }
    function handleNext() {
        const newIndex =
            (AvatarTypeArray.indexOf(currentAvatar) + 1) %
                AvatarTypeArray.length || 0;
        setCurrentAvatar(AvatarTypeArray[newIndex]);
    }
};
