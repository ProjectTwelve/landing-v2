/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { IS_MOBILE } from '../../../utils';
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
        const d = 24;

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
            // console.log('playing', playing);

            if (!playing) return;

            // auto rotation
            if (!controlling) target += 0.03;

            if (!vid.seeking) {
                currentTime = lerp(currentTime, target, 0.1);

                vid.currentTime = Math.round((currentTime % d) * 30) / 30;
            } else {
                console.log('seeking', vid.seeking);
            }

            id = requestAnimationFrame(tick);
        };
        id = requestAnimationFrame(tick);

        const container = containerRef.current;

        let initX = 0;
        let initTarget = 0;

        const start = (e: MouseEvent | TouchEvent) => {
            controlling = true;
            target = currentTime;
            initTarget = target;

            const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

            initX = clientX;
        };
        const end = () => {
            controlling = false;
        };
        const move = (e: MouseEvent | TouchEvent) => {
            const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

            if (controlling) {
                target = initTarget + (clientX - initX) * 0.02;
            }
        };

        if (IS_MOBILE) {
            container.addEventListener('touchstart', start);
            container.addEventListener('touchend', end);
            container.addEventListener('touchmove', move);
        } else {
            container.addEventListener('mousedown', start);
            container.addEventListener('mouseup', end);
            container.addEventListener('mousemove', move);
        }

        return () => {
            if (IS_MOBILE) {
                container.removeEventListener('touchstart', start);
                container.removeEventListener('touchend', end);
                container.removeEventListener('touchmove', move);
            } else {
                container.removeEventListener('mousedown', start);
                container.removeEventListener('mouseup', end);
                container.removeEventListener('mousemove', move);
            }

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
                autoPlay
                playsInline
            ></video>
            {/* <canvas className='tree-gl-canvas' ref={canvasRef} /> */}
        </div>
    );
};

function lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
}
