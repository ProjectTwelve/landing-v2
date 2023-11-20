import React, { useLayoutEffect, useRef, useState, lazy, useEffect } from 'react';
// import { AVATAR_GL_MAP } from './components/AvatarGL';
import './Avatar.less';
import { AvatarType, AVATAR_GL_KEYS } from './Avatar.config';
import { playClickAudio, GAevent } from '../../utils';
import classnames from 'classnames';
import { loadingEE, usePageVisible } from '../app/App.utils';
import { PageType } from '../app/App.config';
import gsap from 'gsap';

import type { AvatarGLRef } from './components/AvatarGL';
// import { AvatarGL } from './components/AvatarGL';
const AvatarGL = lazy(() => import('./components/AvatarGL'));

export const Avatar = (props) => {
    const { currentPage } = props;
    const avatarGLRef = useRef<AvatarGLRef>(null);
    const [currentAvatar, setCurrentAvatar] = useState(AvatarType.Dokv);
    let timeId: number;

    const [ready, serReady] = useState(false);

    usePageVisible(PageType.Avatar, () => {
        const handleTouchDown = () => {
            clearInterval(timeId);
            avatarGLRef.current?.stopTimeout();
        };
        const handleTouchUp = () => {
            clearInterval(timeId);
            avatarGLRef.current?.restartTimeout();
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
                document.addEventListener('visibilitychange', handleVisibilityChange, false);

                // setCurrentAvatar(first(Object.keys(AVATAR_GL_MAP)) as AvatarType);
                const tl = gsap.timeline({
                    onComplete: () => {},
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
                    },
                );
                return tl.then();
            },
            onHide: () => {
                clearInterval(timeId);
                window.removeEventListener('pointerdown', handleTouchDown);
                window.removeEventListener('pointerup', handleTouchUp);
                document.removeEventListener('visibilitychange', handleVisibilityChange);

                const tl = gsap.timeline({
                    onComplete: () => {
                        // setCurrentAvatar(AvatarType.Dokv);
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
                    },
                );
                return tl.then();
            },
        };
    });

    const allLoaded = () => {
        clearInterval(timeId);
        timeId = window.setInterval(() => {
            handleNext();
        }, 8000);
    };

    useEffect(() => {
        loadingEE.on('loaded', () => {
            setTimeout(() => {
                serReady(true);
            }, 1000);
        });
    }, []);

    // useLayoutEffect(() => {
    //     // avatarGLRef.current?.switchTo(currentAvatar, currentPage);
    // }, [currentAvatar]);

    return (
        <div className="avatar">
            {ready ? (
                <AvatarGL ref={avatarGLRef} allLoaded={allLoaded} avatar={currentAvatar} currentPage={currentPage} />
            ) : null}

            {/* <AGL /> */}
            <div className="avatar__info">
                <div className="avatar__slogan"></div>
                <div className="app-small-title app-small-title--with-block avatar__small-title">
                    IDENTITY IN THE P12 ECOSYSTEM
                </div>
                <div className="app-small-text avatar__small-text-1">
                    The Assets consists of P12 Gamer SBT, P12 Developer SBT,
                    <br />
                    P12 Power Level, and P12 Badges
                </div>
                <div className="avatar__btn-wrap">
                    <div
                        className="avatar__btn avatar__btn--left"
                        onClick={() => {
                            GAevent('event', 'Infra-swap');
                            playClickAudio();
                            handlePrev();
                        }}
                    ></div>
                    <div
                        className="avatar__btn avatar__btn--right"
                        onClick={() => {
                            GAevent('event', 'Infra-swap');
                            playClickAudio();
                            handleNext();
                        }}
                    ></div>
                </div>
            </div>
            <div className="avatar__nav">
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
                        return null;
                    }
                })}
            </div>
        </div>
    );

    function handlePrev() {
        setCurrentAvatar((old) => {
            const newIndex = old ? (AVATAR_GL_KEYS.indexOf(old) - 1 + AVATAR_GL_KEYS.length) % AVATAR_GL_KEYS.length || 0 : 0;
            return AVATAR_GL_KEYS[newIndex];
        });
    }

    function handleNext() {
        setCurrentAvatar((old) => {
            const newIndex = old ? (AVATAR_GL_KEYS.indexOf(old) + 1 + AVATAR_GL_KEYS.length) % AVATAR_GL_KEYS.length || 0 : 0;
            return AVATAR_GL_KEYS[newIndex];
        });
    }
};
