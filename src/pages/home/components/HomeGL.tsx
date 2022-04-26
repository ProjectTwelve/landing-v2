import React, { useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import {
    CSS2DObject,
    CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { getPublicAssetPath } from '../../../utils';
import { gsap } from 'gsap';
import { get } from 'lodash-es';
import './HomeGL.less';

interface HomeGLProps {
    onAnimated: (model: THREE.Group) => gsap.core.Timeline;
}

export const HomeGL: React.FC<HomeGLProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        let mixer: THREE.AnimationMixer;
        const clock = new THREE.Clock();
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        // scene.background = new THREE.Color(0x000000);
        // scene.background = new THREE.Color(0xbfe3dd);
        // scene.environment = pmremGenerator.fromScene(
        //     new RoomEnvironment(),
        //     0.04
        // ).texture;
        const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambient);

        // const spotLight = new THREE.SpotLight(0xffffff, 1);
        // spotLight.position.set(10, 14, 16);
        // spotLight.angle = Math.PI / 4;
        // spotLight.penumbra = 0.1;
        // spotLight.decay = 2;
        // spotLight.distance = 200;
        // spotLight.castShadow = true;
        // spotLight.shadow.mapSize.width = 512;
        // spotLight.shadow.mapSize.height = 512;
        // spotLight.shadow.camera.near = 10;
        // spotLight.shadow.camera.far = 200;
        // spotLight.shadow.focus = 1;
        // scene.add(spotLight);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(labelRenderer.domElement);

        const camera = new THREE.PerspectiveCamera(
            40,
            container.clientWidth / container.clientHeight,
            1,
            100
        );
        camera.position.set(-2.17, 9.396, 0.0408);
        const pointerData = [
            {
                position: new THREE.Vector3(3.1, -1, 0),
                cameraPosition: new THREE.Vector3(3.27, 6.088, -0.22),
                lookPosition: new THREE.Vector3(3.27, -6.43, -0.022),
            },
            {
                position: new THREE.Vector3(0.2, 3.3, -1.4),
                cameraPosition: new THREE.Vector3(-0.11, 7.16, 3.66),
                lookPosition: new THREE.Vector3(0.2, 3.3, -1.4),
            },
            {
                position: new THREE.Vector3(0.2, -0.8, 3.3),
                cameraPosition: new THREE.Vector3(-0.11, 7.16, 3.66),
                lookPosition: new THREE.Vector3(0.2, -0.8, 3.3),
            },
            {
                position: new THREE.Vector3(-3, 0.6, -0.2),
                cameraPosition: new THREE.Vector3(-0.11, 7.16, 3.66),
                lookPosition: new THREE.Vector3(-3, 0.6, -0.2),
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

        const axesHelper = new THREE.AxesHelper(10);
        // scene.add(axesHelper);

        const controls = new OrbitControls(camera, labelRenderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enablePan = true;
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;

        const loader = new GLTFLoader();
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath(getPublicAssetPath('files/lib-draco/gltf/'));
        // loader.setDRACOLoader(dracoLoader);
        loader.load(
            getPublicAssetPath('files/home/home.gltf'),
            function (gltf) {
                console.log('gltf', gltf);
                const model = gltf.scene;
                model.position.set(0, -3.375, 0);
                model.scale.set(0.25, 0.25, 0.25);
                scene.add(model);

                mixer = new THREE.AnimationMixer(model);
                // mixer.clipAction(gltf.animations[0]).play();
                gsap.set('.home-gl', {
                    opacity: 0,
                });
                animate();
                requestAnimationFrame(() => {
                    gsap.set(labelRenderer.domElement, {
                        opacity: 0,
                    });
                    const tl = props.onAnimated(model);
                    tl.to(labelRenderer.domElement, {
                        duration: 0.6,
                        opacity: 1,
                    });
                });
            },
            void 0,
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
        let frameId: number;

        function animate() {
            frameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.update(delta);
            controls.update();

            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
            // console.log(camera.position);
        }

        let oldCameraPos = camera.position;
        function handleResetCamera() {
            camera.layers.enable(1);
            containerRef.current &&
                gsap.to(containerRef.current, {
                    duration: 0.8,
                    x: containerRef.current.offsetWidth * 0.17,
                    y: 0,
                    z: 0,
                });
            gsap.to(controls.target, {
                duration: 0.8,
                x: 0,
                y: 0,
                z: 0,
            });
            gsap.to(camera.position, {
                duration: 0.8,
                x: oldCameraPos.x,
                y: oldCameraPos.y,
                z: oldCameraPos.z,
                onComplete: () => {
                    controls.enabled = true;
                },
            });
            labelRenderer.domElement.removeEventListener(
                'pointerup',
                handleResetCamera
            );
        }

        function getHandleMouseClick(data: typeof pointerData[number]) {
            const lookPos = data.lookPosition;
            const cameraPos = data.cameraPosition;
            return (event) => {
                camera.layers.disable(1);
                oldCameraPos = camera.position.clone();
                controls.enabled = false;
                controls.autoRotate = false;
                containerRef.current &&
                    gsap.to(containerRef.current, {
                        duration: 0.8,
                        x: 0,
                        y: 0,
                        z: 0,
                    });
                gsap.to(controls.target, {
                    duration: 0.8,
                    x: lookPos.x,
                    y: lookPos.y,
                    z: lookPos.z,
                });
                gsap.to(camera.position, {
                    duration: 0.8,
                    x: cameraPos.x,
                    y: cameraPos.y,
                    z: cameraPos.z,
                    onComplete: () => {
                        labelRenderer.domElement.addEventListener(
                            'pointerup',
                            handleResetCamera
                        );
                    },
                });
            };
        }

        const observer = new ResizeObserver(resize);
        observer.observe(container);
        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            pointersRemoveHandle.forEach((removeHandle) => removeHandle());
            labelRenderer.domElement.removeEventListener(
                'pointerup',
                handleResetCamera
            );
            container.removeChild(renderer.domElement);
            container.removeChild(labelRenderer.domElement);
        };
    }, []);

    return <div className='home-gl' ref={containerRef} />;
};
