/* eslint-disable */
import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getPublicAssetPath } from '../../../utils';
import { PageType } from '../../app/App.config';
import {
    AppContext,
    loadingEE,
    LoadingSourceType,
    usePageVisible,
} from '../../app/App.utils';
import './TreeGL.less';

export const TreeGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    usePageVisible(PageType.Tree, () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
            return;
        }
        let frameId: number;
        let renderedImageIndex = -1;
        let imageDataArray: HTMLImageElement[] = [];
        let loaded = false;
        let loading = false;

        const context = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1080;

        const camera = new THREE.PerspectiveCamera(40, 1, 1, 100);
        camera.position.set(5, 2, 8);
        const controls = new OrbitControls(camera, container);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI * 0.5;
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;

        function load() {
            if (loaded || loading) {
                return;
            }
            loading = true;
            const imageUrls = new Array(480).fill(0).map((_, i) => {
                return getPublicAssetPath(
                    `files/tree/tree-model/${i + 1 + 1000}.jpg`
                );
            });
            const imageLoader = new THREE.ImageLoader();
            Promise.all(imageUrls.map((url) => imageLoader.load(url)))
                .then((data) => {
                    imageDataArray = data;
                    render();
                    loaded = true;
                    loadingEE.emit(
                        `progress.${LoadingSourceType.TREE_MODEL}`,
                        1
                    );
                })
                .finally(() => {
                    loading = false;
                });
        }
        function render() {
            if (loading || !loaded) {
                return;
            }
            controls.update();
            const index = Math.floor(
                (((controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
                    imageDataArray.length +
                    imageDataArray.length +
                    0) %
                    imageDataArray.length
            );
            // console.log(index);
            if (renderedImageIndex !== index && context) {
                renderedImageIndex = index;
                context.drawImage(imageDataArray[index], 0, 0);
            }
        }
        function animate() {
            frameId = requestAnimationFrame(animate);
            render();
        }

        setTimeout(() => {
            load();
        }, 100);

        return {
            onVisible: () => {
                animate();
            },
            onHide: () => {
                cancelAnimationFrame(frameId);
            },
            onDestroy: () => {},
        };
    });

    return (
        <div className='tree-gl' ref={containerRef}>
            <canvas className='tree-gl-canvas' ref={canvasRef} />
        </div>
    );
};
