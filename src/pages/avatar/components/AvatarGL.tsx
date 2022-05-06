import { gsap } from 'gsap';
import { first } from 'lodash-es';
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import { AvatarType } from '../Avatar.config';
import './AvatarGL.less';
import { AvatarGLItemCartoon } from './utils/AvatarGLItemCartoon';
import { AvatarGLItemDokv } from './utils/AvatarGLItemDokv';
import { AvatarGLItemLowpoly } from './utils/AvatarGLItemLowpoly';

export interface AvatarGLRef {
    switchTo: (type: AvatarType | null) => void;
}

export const AVATAR_GL_MAP = {
    [AvatarType.DOKV]: new AvatarGLItemDokv(),
    [AvatarType.LOWPOLY]: new AvatarGLItemLowpoly(),
    [AvatarType.CARTOON]: new AvatarGLItemCartoon(),
};

export const AvatarGL = forwardRef<AvatarGLRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const activatedRef = useRef<AvatarType | null>(null);
    const mouseRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
        ref,
        () => ({
            switchTo: (type) => {
                activatedRef.current &&
                    AVATAR_GL_MAP[activatedRef.current].leave();
                activatedRef.current = type;
                activatedRef.current &&
                    AVATAR_GL_MAP[activatedRef.current].enter();
            },
        }),
        []
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        Object.values(AVATAR_GL_MAP).map((v) => v.mount(container));

        // 先只加载首个资源
        first(Object.values(AVATAR_GL_MAP))?.load();
        return () => {
            Object.values(AVATAR_GL_MAP).map((v) => container && v.unMount());
        };
    }, []);

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
                x: e.clientX,
                y: e.clientY,
            });
        };
        const handleMouseDown = () => {
            // console.log('window', 'handleMouseDown');
            mouseDom?.classList.add('active');
        };
        const handleMouseUp = () => {
            mouseDom?.classList.remove('active');
        };
        return {
            onVisible: () => {
                // 进入界面后，加载所有内容
                Object.values(AVATAR_GL_MAP).map((v) => v.load());
                handleMouseUp();
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mousedown', handleMouseDown);
                window.addEventListener('mouseup', handleMouseUp);
            },
            onHide: () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mouseup', handleMouseUp);
            },
            onDestroy: () => {},
        };
    });

    return (
        <div className='avatar-gl' ref={containerRef}>
            <div className='avatar-circle'></div>
            <div className='avatar-mouse' id='avatar-mouse' ref={mouseRef}>
                <div className='avatar-mouse__circle'></div>
                <div className='avatar-mouse__dot'></div>
                <div className='avatar-mouse__arrow-bg'></div>
                <div className='avatar-mouse__arrow'></div>
            </div>
        </div>
    );
});
