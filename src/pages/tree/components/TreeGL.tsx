/* eslint-disable */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import './TreeGL.less';

export const TreeGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const vidRef = useRef<HTMLVideoElement>(null!);

    useEffect(() => {
        let controlling = false;

        // console.log('controlling', controlling);

        let target = 0;

        const vid = vidRef.current;
        // if (controlling) {
        //     vid.pause();
        // } else {
        //     vid.play();
        // }

        let id = 0;

        const d = vid.duration;
        // console.log(d);

        const tick = () => {
            // console.log(controlling);
            if (controlling) {
                // if (vid.seeking) {
                //     console.log('seeking');
                //     id = requestAnimationFrame(tick);
                //     return;
                // }
                // if (!vid.seekable) {
                //     console.log('!seekable');
                //     id = requestAnimationFrame(tick);
                //     return;
                // }

                // console.log('target', target);

                if (!vid.seeking && vid.seekable) {
                    vid.currentTime = target;
                }
            }
            id = requestAnimationFrame(tick);
        };
        id = requestAnimationFrame(tick);

        const container = containerRef.current;

        let moving = false;
        let initX = 0;
        let initTarget = 0;

        const start = (e: MouseEvent) => {
            moving = true;
            target = vid.currentTime;
            initX = e.clientX;
            initTarget = target + d * 100;
            vid.pause();

            // console.log('init target', target);

            controlling = true;
        };
        const end = () => {
            moving = false;
            controlling = false;
            setTimeout(() => {
                if (!controlling && vid.paused) {
                    vid.play();
                }
            }, 500);
        };
        const move = (e: MouseEvent) => {
            if (moving) {
                target = initTarget + (e.clientX - initX) * 0.02;
                target = target % d;

                target = Math.round(target * 30) / 30;
            }
        };

        container.addEventListener('pointerdown', start);
        container.addEventListener('pointerup', end);
        container.addEventListener('pointermove', move);

        return () => {
            container.removeEventListener('pointerdown', start);
            container.removeEventListener('pointerup', end);
            container.removeEventListener('pointermove', move);
            cancelAnimationFrame(id);
        };
    });

    usePageVisible(PageType.Tree, () => {
        return {
            onVisible: () => {
                // console.log('tree, visible');
                vidRef.current.play();
            },
            onHide: () => {
                // console.log('tree, hide');
                vidRef.current.pause();
            },
        };
    });

    useEffect(() => {
        const vid = vidRef.current;
        // vid.playbackRate = 0.5;
    }, []);

    return (
        <div className="tree-gl" ref={containerRef}>
            <video ref={vidRef} className="tree-gl-canvas" src="/files/vid/tree-1k.mp4" id="vid" muted loop autoPlay></video>
            {/* <canvas className='tree-gl-canvas' ref={canvasRef} /> */}
        </div>
    );
};
