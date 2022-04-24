import React, { useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import {
    CSS2DObject,
    CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { getPublicAssetPath } from '../../../utils';
import { gsap } from 'gsap';
import { get } from 'lodash-es';
import './HomeGL.less';

export const HomeGL: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        // gsap.set(container, {
        //     x: container.offsetWidth * 0.17,
        //     y: 0,
        // });

        let mixer: THREE.AnimationMixer;
        const clock = new THREE.Clock();
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambient);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(labelRenderer.domElement);

        const camera = new THREE.PerspectiveCamera(
            40,
            container.clientWidth / container.clientHeight,
            1,
            200
        );
        camera.position.set(-10.249, 24.482, 25.445);
        camera.lookAt(0, 0, 0);

        const axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        const ballControls = new ArcballControls(camera, container, scene);
        ballControls.addEventListener('change', render);
        ballControls.setGizmosVisible(false);
        ballControls.enableZoom = false;
        ballControls.update();

        const transformControls = new TransformControls(camera, container);
        transformControls.addEventListener('change', render);
        transformControls.addEventListener(
            'dragging-changed',
            function (event) {
                ballControls.enabled = !event.value;
            }
        );
        scene.add(transformControls);

        const loader = new GLTFLoader();
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath(getPublicAssetPath('files/lib-draco/gltf/'));
        // loader.setDRACOLoader(dracoLoader);
        loader.load(
            getPublicAssetPath('files/home/home.gltf'),
            function (gltf) {
                console.log('gltf', gltf);
                const model = gltf.scene;

                model.position.set(0, -13.5, 0);
                model.scale.set(1, 1, 1);

                transformControls.attach(model);

                scene.add(model);

                mixer = new THREE.AnimationMixer(model);
                // mixer.clipAction(gltf.animations[0]).play();
                animate();
            },
            void 0,
            function (e) {
                console.error(e);
            }
        );

        const pointerData = [
            {
                position: new THREE.Vector3(12.4, -4, 0),
                cameraPosition: new THREE.Vector3(3.27, 6.088, -0.22),
                modelPosition: new THREE.Vector3(3.27, -6.43, -0.022),
            },
            {
                position: new THREE.Vector3(0.8, 13.2, -5.6),
                cameraPosition: new THREE.Vector3(-0.11, 7.16, 3.66),
                modelPosition: new THREE.Vector3(0.2, 3.3, -1.4),
            },
            {
                position: new THREE.Vector3(0.8, -3.2, 13.2),
                cameraPosition: new THREE.Vector3(-0.11, 7.16, 3.66),
                modelPosition: new THREE.Vector3(0.2, -0.8, 3.3),
            },
            {
                position: new THREE.Vector3(-9, 2.4, -0.8),
                cameraPosition: new THREE.Vector3(-0.11, 7.16, 3.66),
                modelPosition: new THREE.Vector3(-3, 0.6, -0.2),
            },
        ];
        const pointersRemoveHandle = pointerData.map((p) => {
            const btn = document.createElement('div');
            btn.className = 'gl-pointer';
            const label = new CSS2DObject(btn);
            label.position.set(p.position.x, p.position.y, p.position.z);
            scene.add(label);
            label.layers.set(1);

            const handle = getHandleMouseClick(p);
            btn.addEventListener('mousedown', handle);
            return () => {
                btn.removeEventListener('mousedown', handle);
            };
        });
        camera.layers.enable(1);

        function getHandleMouseClick(data: typeof pointerData[number]) {
            const modelPos = data.modelPosition;
            const cameraPos = data.cameraPosition;
            return (event) => {
                camera.layers.disable(1);
                const oldCameraPos = camera.position.clone();
                const oldModelPos = camera.position.clone();
                ballControls.enabled = false;
                // ballControls.autoRotate = false;
                containerRef.current &&
                    gsap.to(containerRef.current, {
                        duration: 0.8,
                        x: 0,
                    });
                gsap.to(transformControls.object!.position, {
                    duration: 0.8,
                    x: modelPos.x,
                    y: modelPos.y,
                    z: modelPos.z,
                });
                gsap.to(camera.position, {
                    duration: 0.8,
                    x: cameraPos.x,
                    y: cameraPos.y,
                    z: cameraPos.z,
                    onComplete: () => {
                        const handleReset = () => {
                            camera.layers.enable(1);
                            containerRef.current &&
                                gsap.to(containerRef.current, {
                                    duration: 0.8,
                                    x: containerRef.current.offsetWidth * 0.17,
                                });
                            gsap.to(transformControls.object!.position, {
                                duration: 0.8,
                                x: oldModelPos.x,
                                y: oldModelPos.y,
                                z: oldModelPos.z,
                            });
                            gsap.to(camera.position, {
                                duration: 0.8,
                                x: oldCameraPos.x,
                                y: oldCameraPos.y,
                                z: oldCameraPos.z,
                                onComplete: () => {
                                    ballControls.enabled = true;
                                },
                            });
                            labelRenderer.domElement.removeEventListener(
                                'pointerup',
                                handleReset
                            );
                        };
                        labelRenderer.domElement.addEventListener(
                            'pointerup',
                            handleReset
                        );
                    },
                });
            };
        }

        function resize() {
            if (!container) {
                return;
            }
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            labelRenderer.setSize(
                container.clientWidth,
                container.clientHeight
            );
        }
        let frameId: number;

        function animate() {
            frameId = requestAnimationFrame(animate);
            render();
        }

        function render() {
            const delta = clock.getDelta();
            mixer?.update(delta);
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
            try {
                console.log(
                    'camera.position',
                    camera.position,
                    transformControls.object?.position
                );
            } catch (e) {}
        }

        const observer = new ResizeObserver(resize);
        observer.observe(container);
        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            container.removeChild(renderer.domElement);
            container.removeChild(labelRenderer.domElement);
        };
    }, []);

    return <div className='home-gl' ref={containerRef} />;
};
