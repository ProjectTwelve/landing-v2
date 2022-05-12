import React, {
    useRef,
    useEffect,
    forwardRef,
    useState,
    useImperativeHandle,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { ObjectControls } from 'threejs-object-controls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import {
    CSS2DObject,
    CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { getPublicAssetPath, toRadians } from '../../../utils';
import { gsap } from 'gsap';
import './HomeGL.less';
import {
    loadingEE,
    LoadingSourceType,
    usePageVisible,
} from '../../app/App.utils';
import { PageType } from '../../app/App.config';
import { HOME_GL_ACTIVE_DATA } from './HomeGL.config';
import classnames from 'classnames';
import { GUI } from 'dat.gui';

export interface HomeGLRef {
    group?: THREE.Group;
}

export const HomeGL = forwardRef<HomeGLRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<THREE.Group>();
    const [activatedIndex, setActivatedIndex] = useState<number | null>(null);

    useImperativeHandle(
        ref,
        () => ({
            group: groupRef.current,
        }),
        [groupRef.current]
    );

    usePageVisible(PageType.Home, () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const group = new THREE.Group();
        groupRef.current = group;

        let mixer: THREE.AnimationMixer;
        let autoRotating = false;
        const clock = new THREE.Clock();
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        // renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.add(group);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        labelRenderer.domElement.className = 'home-label-canvas';
        container.appendChild(labelRenderer.domElement);

        const camera = new THREE.PerspectiveCamera(
            40,
            container.clientWidth / container.clientHeight,
            1,
            100
        );

        camera.position.set(0, 0, 3.33);
        camera.lookAt(0, 0, 0);
        camera.layers.enable(1);

        scene.add(camera);
        const ambientLight = new THREE.AmbientLight(0xb7d4f9, 0.4);
        camera.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xf9e8cf, 1.3);
        directionalLight.position.set(0.5, 0, 0.866); // ~60º
        camera.add(directionalLight);

        const axesHelper = new THREE.AxesHelper(10);
        // scene.add(axesHelper);

        // const gui = new GUI();
        // const folderRotation = gui.addFolder('group.rotation');
        // folderRotation.add(group.rotation, 'x').step(0.01);
        // folderRotation.add(group.rotation, 'y').step(0.01);
        // folderRotation.add(group.rotation, 'z').step(0.01);
        // const folderPosition = gui.addFolder('group.position');
        // folderPosition.add(group.position, 'x').step(0.01);
        // folderPosition.add(group.position, 'y').step(0.01);
        // folderPosition.add(group.position, 'z').step(0.01);
        // const folderScale = gui.addFolder('group.scale');
        // folderScale.add(group.scale, 'x').step(0.01);
        // folderScale.add(group.scale, 'y').step(0.01);
        // folderScale.add(group.scale, 'z').step(0.01);
        // gui.domElement.id = 'home-gl-gui';

        const loader = new GLTFLoader();
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath(getPublicAssetPath('files/lib-draco/gltf/'));
        // loader.setDRACOLoader(dracoLoader);
        loader.load(
            getPublicAssetPath('files/home/home.glb?v051101'),
            function (gltf) {
                console.log('gltf', gltf);
                const model = gltf.scene;
                // model.traverse((node: any) => {
                //     if (node.isMesh) {
                //         node.castShadow = true;
                //         node.receiveShadow = true;
                //     }
                // });
                model.position.set(0, 0, 0);
                model.scale.set(1, 1, 1);
                group.add(model);

                mixer = new THREE.AnimationMixer(model);
                // mixer.clipAction(gltf.animations[0]).play();

                render();
                loadingEE.emit(`progress.${LoadingSourceType.HOME_GLTF}`, 1);
            },
            (event) => {
                loadingEE.emit(
                    `progress.${LoadingSourceType.HOME_GLTF}`,
                    Math.min(
                        event.loaded / (event.total || 1024 * 1024 * 25),
                        0.95
                    )
                );
            },
            function (e) {
                console.error(e);
            }
        );

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

        let oldGroupRot = group.rotation.clone();
        function handleResetCamera() {
            setActivatedIndex(null);
            camera.layers.enable(1);
            gsap.to(group.rotation, {
                duration: 0.8,
                x: oldGroupRot.x,
                y: oldGroupRot.y,
                z: oldGroupRot.z,
            });
            gsap.to(group.scale, {
                duration: 0.8,
                x: 1,
                y: 1,
                z: 1,
            });
            gsap.to(group.position, {
                duration: 0.8,
                x: 0,
                y: 0,
                z: 0,
                onComplete: () => {
                    autoRotating = true;
                },
            });
            labelRenderer.domElement.removeEventListener(
                'pointerup',
                handleResetCamera
            );
        }

        function getHandleMouseClick(index: number) {
            const data = HOME_GL_ACTIVE_DATA[index];
            return (event) => {
                setActivatedIndex(index);
                oldGroupRot = group.rotation.clone();
                autoRotating = false;
                camera.layers.disable(1);
                gsap.to(group.rotation, {
                    duration: 0.8,
                    x: data.groupRot.x,
                    y: data.groupRot.y,
                    z: data.groupRot.z,
                });
                gsap.to(group.scale, {
                    duration: 0.8,
                    x: data.groupSca.x,
                    y: data.groupSca.y,
                    z: data.groupSca.z,
                });
                gsap.to(group.position, {
                    duration: 0.8,
                    x: data.groupPos.x,
                    y: data.groupPos.y,
                    z: data.groupPos.z,
                    onComplete: () => {
                        labelRenderer.domElement.addEventListener(
                            'pointerup',
                            handleResetCamera
                        );
                    },
                });
            };
        }

        const pointersRemoveHandle = HOME_GL_ACTIVE_DATA.map((p, index) => {
            const btn = document.createElement('div');
            btn.className = 'gl-pointer';
            const label = new CSS2DObject(btn);
            label.position.set(p.position.x, p.position.y, p.position.z);

            // const folder = gui.addFolder('label.position' + index);
            // folder.add(label.position, 'x').step(0.01);
            // folder.add(label.position, 'y').step(0.01);
            // folder.add(label.position, 'z').step(0.01);

            group.add(label);
            label.layers.set(1);

            const handle = getHandleMouseClick(index);
            btn.addEventListener('mousedown', handle);
            return () => {
                btn.removeEventListener('mousedown', handle);
            };
        });

        const observer = new ResizeObserver(resize);
        observer.observe(container);

        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0,
        };
        function handleControlUp() {
            isDragging = false;
        }
        function handleControlDown() {
            isDragging = true;
        }
        function handleControlMove(e: MouseEvent) {
            if (isDragging && autoRotating) {
                const deltaMove = {
                    x: e.screenX - previousMousePosition.x,
                    y: e.screenY - previousMousePosition.y,
                };
                const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(
                        toRadians(deltaMove.y * 1 * 0.3),
                        toRadians(deltaMove.x * 1 * 0.3),
                        0,
                        'XYZ'
                    )
                );
                group.quaternion.multiplyQuaternions(
                    deltaRotationQuaternion,
                    group.quaternion
                );
            }

            previousMousePosition = {
                x: e.screenX,
                y: e.screenY,
            };
        }

        let frameId: number;

        function render() {
            const delta = clock.getDelta();
            mixer?.update?.(delta);
            if (autoRotating && !isDragging) {
                group.rotation.y =
                    (group.rotation.y +
                        ((2 * Math.PI) / 60 / 60) * delta * 30) %
                    (2 * Math.PI);
            }

            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
            // gui.updateDisplay();
        }

        function animate() {
            frameId = requestAnimationFrame(animate);
            render();
        }

        return {
            onVisible: () => {
                animate();
                autoRotating = true;
                window.addEventListener('mouseup', handleControlUp);
                window.addEventListener('mousedown', handleControlDown);
                window.addEventListener('mousemove', handleControlMove);
                // document.body.appendChild(gui.domElement);
            },
            onHide: () => {
                autoRotating = false;
                cancelAnimationFrame(frameId);
                // document.body.removeChild(gui.domElement);
            },
            onDestroy: () => {
                observer.disconnect();
                pointersRemoveHandle.forEach((removeHandle) => removeHandle());
                labelRenderer.domElement.removeEventListener(
                    'pointerup',
                    handleResetCamera
                );
                window.removeEventListener('mouseup', handleControlUp);
                window.removeEventListener('mousedown', handleControlDown);
                window.removeEventListener('mousemove', handleControlMove);
                container.removeChild(renderer.domElement);
                container.removeChild(labelRenderer.domElement);
            },
        };
    });

    return (
        <div className='home-gl' ref={containerRef}>
            <div className='home-extra'>
                {HOME_GL_ACTIVE_DATA.map((data, index) => {
                    return (
                        <div
                            className={classnames('home-extra-item', {
                                active: activatedIndex === index,
                            })}
                            key={index}
                        >
                            <div className='home-extra-item__title'>
                                {data.info.title}
                            </div>
                            <div className='home-extra-item__desc'>
                                {data.info.desc}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
