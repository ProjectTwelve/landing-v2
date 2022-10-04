/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import './TreeGL.less';

export const TreeGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const vidRef = useRef<HTMLVideoElement>(null!);

    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        /**
         * mouse controlling vid
         */
        let controlling = false;

        const vid = vidRef.current;

        /**
         * raf id
         */
        let id = 0;

        /**
         * vid full duration
         */
        const d = vid.duration;

        /**
         * target time.
         * add scalar so that it wont be negative
         */
        let target = d * 100000;

        /**
         * currentTime.
         * add scalar so that it wont be negative
         */
        let currentTime = d * 100000;

        const tick = () => {
            id = requestAnimationFrame(tick);

            if (!playing) return;

            // auto rotation
            if (!controlling) target += 0.03;

            if (!vid.seeking && vid.seekable) {
                currentTime = lerp(currentTime, target, 0.1);

                vid.currentTime = Math.round((currentTime % d) * 30) / 30;
            }
        };
        id = requestAnimationFrame(tick);

        const container = containerRef.current;

        let initX = 0;
        let initTarget = 0;

        const start = (e: MouseEvent) => {
            controlling = true;
            target = currentTime;
            initTarget = target;
            initX = e.clientX;
        };
        const end = () => {
            controlling = false;
        };
        const move = (e: MouseEvent) => {
            if (controlling) {
                target = initTarget + (e.clientX - initX) * 0.02;
            }
        };

        container.addEventListener('mousedown', start);
        container.addEventListener('mouseup', end);
        container.addEventListener('mousemove', move);

        return () => {
            container.removeEventListener('mousedown', start);
            container.removeEventListener('mouseup', end);
            container.removeEventListener('mousemove', move);
            cancelAnimationFrame(id);
        };
    }, [playing]);

    usePageVisible(PageType.Tree, () => {
        return {
            onVisible: () => {
                // console.log('tree, visible');
                setPlaying(true);
            },
            onHide: () => {
                // console.log('tree, hide');
                setPlaying(false);
            },
        };
    });

    return (
        <div className="tree-gl" ref={containerRef}>
            <video
                ref={vidRef}
                className="tree-gl-canvas"
                src="/files/vid/tree-1k.mp4"
                id="vid"
                muted
                loop
                // autoPlay
                playsInline
            ></video>
            {/* <canvas className='tree-gl-canvas' ref={canvasRef} /> */}
        </div>
    );
};

function lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
}
