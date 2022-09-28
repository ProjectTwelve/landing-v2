import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import styles from './avatar.module.css';

import { Scene, PerspectiveCamera, WebGLRenderer, sRGBEncoding, Group, Mesh, Vector3 } from 'three';

import { createCircle } from './utils/createCircle';
import { useTick } from './hooks/useTick';
import { useSize } from './hooks/useSize';

export default function AvatarCircle(props: { container: MutableRefObject<HTMLElement>; playing: boolean }) {
    const canvas = useRef<HTMLCanvasElement>(null!);

    const scene = useMemo(() => new Scene(), []);
    const camera = useMemo(() => {
        const cam = new PerspectiveCamera(40, 1, 0.1, 10);
        cam.position.set(0, 0, 8).multiplyScalar(0.35);
        cam.lookAt(new Vector3());
        return cam;
    }, []);

    const pointsGroupWrapperWrapper = useMemo(() => {
        const g = new Group();
        scene.add(g);
        return g;
    }, []);
    const pointsGroupWrapper = useMemo(() => {
        const g = new Group();
        g.rotateX(Math.PI * 0.56);
        g.rotateY(Math.PI * -0.14);
        pointsGroupWrapperWrapper.add(g);
        return g;
    }, []);
    const pointsGroup = useMemo(() => {
        const g = new Group();
        pointsGroupWrapper.add(g);
        return g;
    }, []);

    const rendererRef = useRef<WebGLRenderer | null>(null);

    // three.js initial
    useEffect(() => {
        rendererRef.current = new WebGLRenderer({
            canvas: canvas.current,
            precision: 'lowp',
            alpha: true,
            // antialias: window.devicePixelRatio > 1 ? false : true, // 视网膜屏不需要抗锯齿
            antialias: false,
            stencil: false,
        });
        rendererRef.current.outputEncoding = sRGBEncoding;

        const renderer = rendererRef.current;

        const points = createCircle();
        pointsGroup.add(points);

        return () => {
            renderer.dispose();
        };
    }, []);

    // render cycle

    useTick(
        (timestamp, interval) => {
            if (props.playing) {
                pointsGroup.rotateZ(-interval * 0.0001);
                const renderer = rendererRef.current!;
                renderer.render(scene, camera);
            }
        },
        [props.playing],
    );

    const [width, height] = useSize(props.container);

    useEffect(() => {
        rendererRef.current!.setSize(width * 1, height * 1, false);
    }, [width, height]);

    //

    return <canvas ref={canvas} className={styles.canvasCircle}></canvas>;
}
