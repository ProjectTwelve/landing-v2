import React, { useEffect, useRef, useState } from 'react';
import { AvatarGL, AvatarGLRef } from './components/AvatarGL';
import './Avatar.less';
import { AvatarType, AvatarTypeArray } from './Avatar.config';
import { playClickAudio } from '../../utils';
import classnames from 'classnames';
import { usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';
import gsap from 'gsap';

export const Avatar: React.FC = () => {
    const avatarGLRef = useRef<AvatarGLRef>(null);
    const [currentAvatar, setCurrentAvatar] = useState<AvatarType | null>(null);

    usePageVisible(PageType.Avatar, () => {
        let timeId: number;
        const handleTouchDown = () => {
            clearInterval(timeId);
        };
        const handleTouchUp = () => {
            timeId = window.setInterval(() => {
                handleNext();
            }, 8000);
        };

        return {
            onVisible: () => {
                gsap.set('.page-wrap-avatar', {
                    display: 'block',
                });

                handleTouchUp();
                window.addEventListener('pointerdown', handleTouchDown);
                window.addEventListener('pointerup', handleTouchUp);

                setCurrentAvatar(AvatarType.LOWPOLY);
            },
            onHide: () => {
                gsap.set('.page-wrap-avatar', {
                    display: 'none',
                });

                clearInterval(timeId);
                window.removeEventListener('pointerdown', handleTouchDown);
                window.removeEventListener('pointerup', handleTouchUp);

                setCurrentAvatar(null);
            },
        };
    });

    useEffect(() => {
        avatarGLRef.current?.switchTo(currentAvatar);
    }, [currentAvatar]);

    return (
        <div className='avatar'>
            <AvatarGL ref={avatarGLRef} />
            <div className='avatar__info'>
                <div className='avatar__slogan'></div>
                <div className='avatar__subtitle'>Game Character</div>
                <div className='avatar__text'>
                    NOMOCRAC
                    <i className='avatar__text-block'></i>
                </div>
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
                        onClick={() => {
                            playClickAudio();
                            handlePrev();
                        }}
                    ></div>
                    <div
                        className='avatar__btn avatar__btn--right'
                        onClick={() => {
                            playClickAudio();
                            handleNext();
                        }}
                    ></div>
                </div>
            </div>
            <div className='avatar__nav'>
                {AvatarTypeArray.map((type) => {
                    const activated = type === currentAvatar;
                    return (
                        <div
                            className={classnames('avatar__nav-item', {
                                active: activated,
                            })}
                            key={type}
                            onClick={() => {
                                setCurrentAvatar(type);
                            }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );

    function handlePrev() {
        setCurrentAvatar((old) => {
            const newIndex = old
                ? (AvatarTypeArray.indexOf(old) - 1 + AvatarTypeArray.length) %
                      AvatarTypeArray.length || 0
                : 0;
            return AvatarTypeArray[newIndex];
        });
    }

    function handleNext() {
        setCurrentAvatar((old) => {
            const newIndex = old
                ? (AvatarTypeArray.indexOf(old) + 1 + AvatarTypeArray.length) %
                      AvatarTypeArray.length || 0
                : 0;
            return AvatarTypeArray[newIndex];
        });
    }
};
