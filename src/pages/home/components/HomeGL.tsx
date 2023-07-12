import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { ObjectControls } from 'threejs-object-controls';
import classnames from 'classnames';
import { gsap } from 'gsap';
import { Vector3 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { GAevent, IS_MOBILE, getPublicAssetPath, toRadians } from '../../../utils';
import { PageType } from '../../app/App.config';
import { LoadingSourceType, loadingEE, usePageVisible } from '../../app/App.utils';
import { HOME_GL_ACTIVE_DATA } from './HomeGL.config';
import './HomeGL.less';
import { useAtom } from 'jotai';
import { homeActiveExtraIndexAtom } from '../../../store/home/state';
import { useIsPortrait } from '../../../hooks/useIsPortrait';

export interface HomeGLRef {
    group?: THREE.Group;
}

const initRotation = {
    x: 1.7,
    y: 0.5,
    z: 2.3,
};
export const HomeGL = forwardRef<HomeGLRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<THREE.Group>();
    const [activatedIndex, setActivatedIndex] = useAtom(homeActiveExtraIndexAtom);
    const isPortrait = useIsPortrait();

    useImperativeHandle(
        ref,
        () => ({
            group: groupRef.current,
        }),
        [groupRef.current],
    );

    usePageVisible(PageType.Home, () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const group = new THREE.Group();
        groupRef.current = group;
        let frameId: number;
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
            isPortrait ? 70 : 40,
            container.clientWidth / container.clientHeight,
            1,
            100,
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

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(getPublicAssetPath('files/home/gltf'));

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            getPublicAssetPath('files/home/qiu_6_.gltf'),
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
                model.scale.set(0.1, 0.1, 0.1);
                group.add(model);
                mixer = new THREE.AnimationMixer(model);
                mixer.clipAction(gltf.animations[0]).play();

                render();
                loadingEE.emit(`progress.${LoadingSourceType.HOME_GLTF}`, 1);
            },
            (event) => {
                loadingEE.emit(
                    `progress.${LoadingSourceType.HOME_GLTF}`,
                    Math.min(event.loaded / (event.total || 1024 * 1024 * 25), 0.95),
                );
            },
        );

        function resize() {
            if (!container) {
                return;
            }
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            labelRenderer.setSize(container.clientWidth, container.clientHeight);
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
            labelRenderer.domElement.removeEventListener('pointerup', handleResetCamera);
        }

        function getHandleMouseClick(index: number) {
            const data = HOME_GL_ACTIVE_DATA[index];
            return (event) => {
                setActivatedIndex(index);
                if (index === 0) {
                    GAevent('event', 'Vision-dragon');
                } else if (index === 1) {
                    GAevent('event', 'Vision-cat');
                } else if (index === 2) {
                    GAevent('event', 'Vision-car');
                } else if (index === 3) {
                    GAevent('event', 'Vision-econ');
                }
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
                        labelRenderer.domElement.addEventListener('pointerup', handleResetCamera);
                    },
                });
            };
        }

        const pointersData = HOME_GL_ACTIVE_DATA.map((p, index) => {
            const btn = document.createElement('div');
            btn.className = 'gl-pointer';
            const btnInner = document.createElement('div');
            btnInner.className = 'gl-pointer-inner';
            btn.appendChild(btnInner);
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
            return {
                label,
                btn,
                btnInner,
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
        function handleControlDown(e: MouseEvent | TouchEvent) {
            isDragging = true;
            let x = 0;
            let y = 0;
            if (e instanceof MouseEvent) {
                x = e.screenX;
                y = e.screenY;
            } else {
                x = e.touches?.[0]?.screenX;
                y = e.touches?.[0]?.screenY;
            }
            previousMousePosition = {
                x: x,
                y: y,
            };
        }
        function handleControlMove(e: MouseEvent | TouchEvent) {
            let x = 0;
            let y = 0;
            if (e instanceof MouseEvent) {
                x = e.screenX;
                y = e.screenY;
            } else {
                x = e.touches?.[0]?.screenX;
                y = e.touches?.[0]?.screenY;
            }
            if (isDragging && autoRotating) {
                const deltaMove = {
                    x: x - previousMousePosition.x,
                    y: y - previousMousePosition.y,
                };
                const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(toRadians(deltaMove.y * 1 * 0.3), toRadians(deltaMove.x * 1 * 0.3), 0, 'XYZ'),
                );
                group.quaternion.multiplyQuaternions(deltaRotationQuaternion, group.quaternion);
            }
            previousMousePosition = {
                x: x,
                y: y,
            };
            // console.log(previousMousePosition);
        }

        function render() {
            const delta = clock.getDelta();
            mixer?.update?.(delta);
            if (autoRotating && !isDragging) {
                group.rotation.y = (group.rotation.y + ((2 * Math.PI) / 60 / 60) * delta * 30) % (2 * Math.PI);
            }

            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);

            // gui.updateDisplay();
            // 更新触摸点的大小样式
            pointersData.forEach(({ label, btnInner }, i) => {
                const worldPos = new Vector3();
                label.getWorldPosition(worldPos);
                const distance = worldPos.distanceTo(camera.position);
                // console.log('distance', i, 1 / distance);
                gsap.set(btnInner, { scale: 1 / distance });
            });
        }

        function animate() {
            frameId = requestAnimationFrame(animate);
            render();
        }

        return {
            onVisible: () => {
                const tl = gsap.timeline();
                tl.fromTo(
                    group.scale,
                    {
                        x: 2,
                        y: 2,
                        z: 2,
                    },
                    {
                        duration: 1,
                        ease: 'power2.out',
                        delay: -2,
                        x: 1,
                        y: 1,
                        z: 1,
                    },
                );
                tl.fromTo(
                    [group.rotation],
                    {
                        x: initRotation.x + Math.PI * 0.5,
                        y: initRotation.y,
                        z: initRotation.z - Math.PI * 0.75,
                    },
                    {
                        ...initRotation,
                        duration: 2,
                        delay: -2,
                        ease: 'power2.out',
                    },
                );
                animate();
                autoRotating = true;
                if (IS_MOBILE) {
                    window.addEventListener('touchend', handleControlUp);
                    window.addEventListener('touchstart', handleControlDown);
                    window.addEventListener('touchmove', handleControlMove);
                } else {
                    window.addEventListener('mouseup', handleControlUp);
                    window.addEventListener('mousedown', handleControlDown);
                    window.addEventListener('mousemove', handleControlMove);
                }
                // document.body.appendChild(gui.domElement);
            },
            onHide: () => {
                cancelAnimationFrame(frameId);
                autoRotating = false;
                if (IS_MOBILE) {
                    window.removeEventListener('touchend', handleControlUp);
                    window.removeEventListener('touchstart', handleControlDown);
                    window.removeEventListener('touchmove', handleControlMove);
                } else {
                    window.removeEventListener('mouseup', handleControlUp);
                    window.removeEventListener('mousedown', handleControlDown);
                    window.removeEventListener('mousemove', handleControlMove);
                }

                // document.body.removeChild(gui.domElement);
            },
            onDestroy: () => {
                observer.disconnect();
                labelRenderer.domElement.removeEventListener('pointerup', handleResetCamera);
                container.removeChild(renderer.domElement);
                container.removeChild(labelRenderer.domElement);
            },
        };
    });

    return (
        <div className="home-gl" ref={containerRef}>
            <div data-nosnippet={true} className="home-extra">
                {HOME_GL_ACTIVE_DATA.map((data, index) => {
                    return (
                        <div
                            className={classnames('home-extra-item', {
                                active: activatedIndex === index,
                            })}
                            key={index}
                        >
                            <div className="home-extra-item__title">{data.info.title}</div>
                            <div className="home-extra-item__desc">{data.info.desc}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
