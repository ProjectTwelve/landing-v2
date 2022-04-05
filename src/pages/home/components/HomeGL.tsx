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

export const HomeGL: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        let mixer: THREE.AnimationMixer;
        const clock = new THREE.Clock();
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        // scene.background = new THREE.Color(0x000000);
        // scene.background = new THREE.Color(0xbfe3dd);
        scene.environment = pmremGenerator.fromScene(
            new RoomEnvironment(),
            0.04
        ).texture;

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(labelRenderer.domElement);

        const buttonDiv1 = document.createElement('div');
        buttonDiv1.className = 'gl-button';
        buttonDiv1.textContent = '1';
        const buttonLabel1 = new CSS2DObject(buttonDiv1);
        buttonLabel1.position.set(1.4, 2, 1.3);
        scene.add(buttonLabel1);
        buttonLabel1.layers.set(0);

        const buttonDiv2 = document.createElement('div');
        buttonDiv2.className = 'gl-button';
        buttonDiv2.textContent = '2';
        const buttonLabel2 = new CSS2DObject(buttonDiv2);
        buttonLabel2.position.set(-1.35, 0.4, 1.4);
        scene.add(buttonLabel2);
        buttonLabel2.layers.set(0);

        const tipsDiv2 = document.createElement('div');
        tipsDiv2.className = 'gl-tips';
        tipsDiv2.textContent = 'Tips：点击返回';
        const tipsLabel2 = new CSS2DObject(tipsDiv2);
        tipsLabel2.position.set(-1.35, 0.4, 1.4);
        scene.add(tipsLabel2);
        tipsLabel2.layers.set(1);

        const buttonDiv3 = document.createElement('div');
        buttonDiv3.className = 'gl-button';
        buttonDiv3.textContent = '3';
        const buttonLabel3 = new CSS2DObject(buttonDiv3);
        buttonLabel3.position.set(0, -1.5, 1.4);
        scene.add(buttonLabel3);
        buttonLabel3.layers.set(0);

        // const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        // scene.add(ambient);

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

        const camera = new THREE.PerspectiveCamera(
            40,
            container.clientWidth / container.clientHeight,
            1,
            100
        );
        camera.position.set(5, 2, 8);
        camera.layers.disable(1);

        const axesHelper = new THREE.AxesHelper(10);
        // scene.add(axesHelper);

        const controls = new OrbitControls(camera, labelRenderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.enableZoom = false;

        const mousePointer = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(getPublicAssetPath('assets/draco/gltf/'));
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            getPublicAssetPath('assets/demo1/demo1.glb'),
            function (gltf) {
                console.log('gltf', gltf);
                const model = gltf.scene;
                model.position.set(1, 0.3, 0);
                model.scale.set(0.01, 0.01, 0.01);
                scene.add(model);

                mixer = new THREE.AnimationMixer(model);
                mixer.clipAction(gltf.animations[0]).play();
                animate();
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
        }

        function handleMouseMove(event) {
            mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        let oldCameraPos = camera.position;
        function handleResetCamera() {
            camera.layers.disable(1);
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

        function getHandleMouseClick(pos: THREE.Vector3) {
            return (event) => {
                oldCameraPos = camera.position.clone();
                controls.enabled = false;
                gsap.to(controls.target, {
                    duration: 0.8,
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                });
                gsap.to(camera.position, {
                    duration: 0.8,
                    x: pos.x * 2,
                    y: pos.y * 2,
                    z: pos.z * 2,
                    onComplete: () => {
                        camera.layers.enable(1);
                        labelRenderer.domElement.addEventListener(
                            'pointerup',
                            handleResetCamera
                        );
                    },
                });

                // const startOrientation = camera.quaternion.clone();
                // const targetOrientation = new THREE.Quaternion(
                //     pos.x,
                //     pos.y,
                //     pos.z
                // );
                // gsap.to(
                //     {},
                //     {
                //         duration: 2,
                //         onUpdate: function () {
                //             camera.quaternion
                //                 .copy(startOrientation)
                //                 .slerp(targetOrientation, this.progress());
                //         },
                //     }
                // );
            };
        }
        const handleMouseClick1 = getHandleMouseClick(buttonLabel1.position);
        const handleMouseClick2 = getHandleMouseClick(buttonLabel2.position);
        const handleMouseClick3 = getHandleMouseClick(buttonLabel3.position);

        const observer = new ResizeObserver(resize);
        observer.observe(container);
        renderer.domElement.addEventListener('pointermove', handleMouseMove);
        buttonDiv1.addEventListener('mousedown', handleMouseClick1);
        buttonDiv2.addEventListener('mousedown', handleMouseClick2);
        buttonDiv3.addEventListener('mousedown', handleMouseClick3);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            renderer.domElement.removeEventListener(
                'pointermove',
                handleMouseMove
            );
            buttonDiv1.removeEventListener('mousedown', handleMouseClick1);
            buttonDiv2.removeEventListener('mousedown', handleMouseClick2);
            buttonDiv3.removeEventListener('mousedown', handleMouseClick3);
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
