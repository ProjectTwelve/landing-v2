import classnames from 'classnames';
import { gsap } from 'gsap';
import React, { forwardRef, useEffect, useImperativeHandle, useReducer, useRef, useState } from 'react';
import { PageType } from '../../app/App.config';
import { loadingEE, usePageVisible } from '../../app/App.utils';
import { AvatarType, AVATAR_GL_INFO_MAP, AVATAR_GL_KEYS } from '../Avatar.config';
import './AvatarGL.less';
import { IS_MOBILE } from '../../../utils';
// import AvatarGL from './AvatarGL';
import styles from './avatar.module.css';
import AvatarMesh from './AvatarMesh';
import AvatarCircle from './AvatarCircle';

export interface AvatarGLRef {
    switchTo: (index: AvatarType, currentPage?: PageType) => void;
    stopTimeout: () => void;
    restartTimeout: () => void;
}
export interface AvatarGLProps {
    allLoaded: () => void;
    avatar: AvatarType;
}

export const AvatarGL = forwardRef<AvatarGLRef, AvatarGLProps>((props, ref) => {
    const [playing, setPlaying] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<HTMLDivElement>(null!);
    useImperativeHandle(
        ref,
        () => ({
            switchTo: async (index: AvatarType, currentPage) => {},
            stopTimeout: () => {},
            restartTimeout: () => {},
        }),
        [],
    );

    usePageVisible(PageType.Avatar, () => {
        const container = containerRef.current;
        const mouseDom = mouseRef.current;
        if (!container || !mouseDom) {
            return;
        }
        const handleMouseMove = (e) => {
            gsap.to(mouseDom, {
                duration: 0.1,
                opacity: 1,
                x: e.clientX + document.body.scrollLeft,
                y: e.clientY + document.body.scrollTop,
            });
        };
        const handleMouseDown = () => {
            mouseDom?.classList.add('active');
        };
        const handleMouseUp = () => {
            mouseDom?.classList.remove('active');
        };
        return {
            onVisible: () => {
                setPlaying(true);
                if (!IS_MOBILE) {
                    handleMouseUp();
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mousedown', handleMouseDown);
                    window.addEventListener('mouseup', handleMouseUp);
                }
            },
            onHide: () => {
                setPlaying(false);
                if (!IS_MOBILE) {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mousedown', handleMouseDown);
                    window.removeEventListener('mouseup', handleMouseUp);
                }
            },
            onDestroy: () => {
                console.warn('onDestroy');
            },
        };
    });

    const glWrapper = useRef<HTMLDivElement>(null!);
    const centerBox = useRef<HTMLDivElement>(null!);
    const wrapper = useRef<HTMLDivElement>(null!);
    const video = useRef<HTMLVideoElement>(null!);

    useEffect(() => {
        const onMouseEnter = () => {
            mouseRef.current.classList.add('hover');
        };
        const onMouseLeave = () => {
            mouseRef.current.classList.remove('hover');
        };
        centerBox.current.addEventListener('mouseenter', onMouseEnter);
        centerBox.current.addEventListener('mouseleave', onMouseLeave);

        return () => {
            centerBox.current.removeEventListener('mouseenter', onMouseEnter);
            centerBox.current.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    usePageVisible(PageType.Avatar, () => {
        return {
            onVisible: () => {
                // console.log('tree, visible');
                video.current.play();
            },
            onHide: () => {
                // console.log('tree, hide');
                video.current.pause();
            },
        };
    });

    return (
        <div className="avatar-gl" ref={containerRef}>
            {/* <AvatarGL
                playing={playing}
                avatar={props.avatar}
                onMouseEnter={() => {
                    mouseRef.current.classList.add('hover');
                }}
                onMouseLeave={() => {
                    mouseRef.current.classList.remove('hover');
                }}
            /> */}

            <div className={styles.wrapper} ref={wrapper}>
                <div className={styles.bgWrapper}>
                    {/* <ButterflyGL page="avatar" /> */}
                    <video
                        ref={video}
                        className={styles.vid}
                        src="/files/vid/avatar-bg-720p.mp4"
                        loop
                        muted
                        playsInline
                        preload="none"
                    ></video>
                    <div className={styles.vidMask}></div>
                </div>
                <div className={styles.frontWrapper}>
                    <div className={styles.centerWrapper}>
                        <div ref={centerBox} className={styles.centerBox}>
                            <div ref={glWrapper} className={styles.glWrapper}>
                                <AvatarMesh container={glWrapper} avatar={props.avatar} playing={playing} />
                                <AvatarCircle container={glWrapper} playing={playing} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <ButterflyGL page={PageType.Avatar} /> */}
            <div className="avatar-mouse hover" id="avatar-mouse" ref={mouseRef}>
                <div className="avatar-mouse__circle"></div>
                <div className="avatar-mouse__dot"></div>
                <div className="avatar-mouse__arrow-bg"></div>
                <div className="avatar-mouse__arrow"></div>
            </div>
            <div className="avatar-extra">
                {AVATAR_GL_KEYS.map((key) => {
                    const info = AVATAR_GL_INFO_MAP[key];
                    if (info && info.extraNode) {
                        return (
                            <div
                                className={classnames('avatar-extra-item', {
                                    active: props.avatar === key,
                                })}
                                key={key}
                            >
                                {info.extraNode}
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        </div>
    );
});

export default AvatarGL;
