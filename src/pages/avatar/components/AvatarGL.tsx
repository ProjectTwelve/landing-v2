import React, {
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { Fire } from 'three/examples/jsm/objects/Fire';
import { getPublicAssetPath } from '../../../utils';
import { gsap } from 'gsap';
import { get } from 'lodash-es';
import './AvatarGL.less';
import { AvatarType } from '../Avatar.config';
import { AvatarGLItemDokv } from './utils/AvatarGLItemDokv';
import { AvatarGLItemCartoon } from './utils/AvatarGLItemCartoon';
import { AvatarGLItemLowpoly } from './utils/AvatarGLItemLowpoly';

export interface AvatarGLRef {
    switchTo: (type: AvatarType | null) => void;
}

const GL_MAP = {
    [AvatarType.LOWPOLY]: new AvatarGLItemLowpoly(),
    [AvatarType.CARTOON]: new AvatarGLItemCartoon(),
    [AvatarType.DOKV]: new AvatarGLItemDokv(),
};
Object.values(GL_MAP).map((v) => v.load());

export const AvatarGL = forwardRef<AvatarGLRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const activatedRef = useRef<AvatarType | null>(null);
    const mouseRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
        ref,
        () => ({
            switchTo: (type) => {
                activatedRef.current && GL_MAP[activatedRef.current].leave();
                activatedRef.current = type;
                activatedRef.current && GL_MAP[activatedRef.current].enter();
            },
        }),
        []
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        Object.values(GL_MAP).map((v) => v.mount(container));
        return () => {
            Object.values(GL_MAP).map((v) => container && v.unMount());
        };
    }, []);

    useEffect(() => {
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
            console.log('window', 'handleMouseDown');
            mouseDom?.classList.add('active');
        };
        const handleMouseUp = () => {
            mouseDom?.classList.remove('active');
        };
        handleMouseUp();
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

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
