import React, { useLayoutEffect, useRef, useState } from 'react';
import { AvatarGL, AvatarGLRef, AVATAR_GL_MAP } from './components/AvatarGL';
import './Avatar.less';
import { AvatarType, AVATAR_GL_KEYS } from './Avatar.config';
import { playClickAudio, GAevent } from '../../utils';
import classnames from 'classnames';
import { usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';
import gsap from 'gsap';
import { first } from 'lodash-es';




interface AvatarProps {
    currentPage?: PageType;
}

export const Avatar: React.FC<AvatarProps> = (props) => {
    const { currentPage } = props;
    const avatarGLRef = useRef<AvatarGLRef>(null);
    const [currentAvatar, setCurrentAvatar] = useState<AvatarType | null>(AvatarType.Dokv);

    usePageVisible(PageType.Avatar, () => {
        let timeId: number;
        const handleTouchDown = () => {
            clearInterval(timeId);
        };
        const handleTouchUp = () => {
            clearInterval(timeId);
            timeId = window.setInterval(() => {
                handleNext();
            }, 8000);
        };

        function handleVisibilityChange() {
            if (document.hidden) {
                handleTouchDown();
            } else {
                handleTouchUp();
            }
        }

        return {
            onVisible: () => {
                GAevent('webview', 'Infra-webview');
                handleTouchUp();
                window.addEventListener('pointerdown', handleTouchDown);
                window.addEventListener('pointerup', handleTouchUp);
                document.addEventListener(
                    'visibilitychange',
                    handleVisibilityChange,
                    false
                );

                setCurrentAvatar(
                    first(Object.keys(AVATAR_GL_MAP)) as AvatarType
                );
                const tl = gsap.timeline({
                    onComplete: () => { },
                });
                tl.fromTo(
                    '.page-wrap-avatar',
                    {
                        opacity: 0,
                    },
                    {
                        duration: 0.5,
                        display: 'block',
                        opacity: 1,
                    }
                );
                return tl.then();
            },
            onHide: () => {
                clearInterval(timeId);
                window.removeEventListener('pointerdown', handleTouchDown);
                window.removeEventListener('pointerup', handleTouchUp);
                document.removeEventListener(
                    'visibilitychange',
                    handleVisibilityChange
                );

                const tl = gsap.timeline({
                    onComplete: () => {
                        setCurrentAvatar(null);
                    },
                });
                tl.fromTo(
                    '.page-wrap-avatar',
                    {
                        opacity: 1,
                    },
                    {
                        duration: 0.5,
                        display: 'none',
                        opacity: 0,
                    }
                );
                return tl.then();
            },
        };
    });

    useLayoutEffect(() => {
        avatarGLRef.current?.switchTo(currentAvatar, currentPage);
    }, [currentAvatar]);

    return (
        <div className='avatar'>
            <AvatarGL ref={avatarGLRef} />
            <div className='avatar__info'>
                <div className='avatar__slogan'></div>
                <div className='app-small-title app-small-title--with-block avatar__small-title'>
                    TOKENOMICS AND NFT MADE EASY
                </div>
                <div className='app-small-text avatar__small-text-1'>
                    The Infra consists of a set of API / SDK and developer
                    <br />
                    portals for bridging game content on-chain
                </div>
                <div className='avatar__btn-wrap'>
                    <div
                        className='avatar__btn avatar__btn--left'
                        onClick={() => {
                            GAevent('event', 'Infra-swap');
                            playClickAudio();
                            handlePrev();
                        }}
                    ></div>
                    <div
                        className='avatar__btn avatar__btn--right'
                        onClick={() => {
                            GAevent('event', 'Infra-swap');
                            playClickAudio();
                            handleNext();
                        }}
                    ></div>
                </div>
            </div>
            <div className='avatar__nav'>
                {AVATAR_GL_KEYS.map((type, i) => {
                    const activated = type === currentAvatar;
                    if (i <= 2) {
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
                    } else {
                        return null
                    }

                })}
            </div>
        </div>
    );

    function handlePrev() {
        setCurrentAvatar((old) => {
            const newIndex = old
                ? (AVATAR_GL_KEYS.indexOf(old) - 1 + AVATAR_GL_KEYS.length) %
                AVATAR_GL_KEYS.length || 0
                : 0;
            return AVATAR_GL_KEYS[newIndex];
        });
    }

    function handleNext() {
        setCurrentAvatar((old) => {
            const newIndex = old
                ? (AVATAR_GL_KEYS.indexOf(old) + 1 + AVATAR_GL_KEYS.length) %
                AVATAR_GL_KEYS.length || 0
                : 0;
            return AVATAR_GL_KEYS[newIndex];
        });
    }
};
