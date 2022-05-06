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
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import {
    CSS2DObject,
    CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { getPublicAssetPath } from '../../../utils';
import { gsap } from 'gsap';
import { get } from 'lodash-es';
import './HomeGL.less';
import {
    loadingEE,
    LoadingSourceType,
    usePageVisible,
} from '../../app/App.utils';
import { PageType } from '../../app/App.config';

export interface HomeGLRef {
    ballModel?: THREE.Group;
}

export const HomeGL = forwardRef<HomeGLRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ballModel, setBallModel] = useState<THREE.Group>();

    useImperativeHandle(
        ref,
        () => ({
            ballModel: ballModel,
        }),
        [ballModel]
    );

    usePageVisible(PageType.Home, () => {
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
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

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
        // camera.position.set(-2.17, 9.396, 0.0408);
        camera.position.set(
            3360 / 400 / 2.8,
            473.3 / 400 / 2.8,
            1240 / 400 / 2.8
        );
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
        // todo 调参
        // camera.layers.enable(1);

        const hemisphereLight = new THREE.HemisphereLight(
            0xffffbb,
            0xffffbb,
            // 0x080820,
            1
        );
        scene.add(hemisphereLight);
        const hemisphereHelper = new THREE.HemisphereLightHelper(
            hemisphereLight,
            10
        );
        // scene.add(hemisphereHelper);

        // const directionalLight = new THREE.DirectionalLight(0x9bbdfe, 1);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-99.75 / 400, -979.9 / 400, 3694 / 400);
        scene.add(directionalLight);
        const directionalHelper = new THREE.DirectionalLightHelper(
            directionalLight,
            5
            // 10
        );
        // scene.add(directionalHelper);

        const ambientLight = new THREE.AmbientLight(0xff0000, 0.5);
        scene.add(ambientLight);

        // const spotLight = new THREE.SpotLight(0xffffff, 1.5);
        // spotLight.position.set(1046 / 400, 2958 / 400, -1425 / 400);
        // spotLight.castShadow = true;
        // spotLight.shadow.mapSize.width = 512;
        // spotLight.shadow.mapSize.height = 512;
        // spotLight.shadow.camera.near = 0;
        // spotLight.shadow.camera.far = 200;
        // spotLight.shadow.focus = 1;
        // scene.add(spotLight);
        // const spotLightHelper = new THREE.SpotLightHelper(spotLight, 10);
        // scene.add(spotLightHelper);

        const axesHelper = new THREE.AxesHelper(10);
        // scene.add(axesHelper);

        const controls = new OrbitControls(camera, labelRenderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enablePan = true;
        controls.enableDamping = true;
        controls.enableZoom = true;
        // controls.autoRotate = true;
        // controls.autoRotateSpeed = 1;

        const loader = new GLTFLoader();
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath(getPublicAssetPath('files/lib-draco/gltf/'));
        // loader.setDRACOLoader(dracoLoader);
        loader.load(
            getPublicAssetPath('files/home/home.glb'),
            function (gltf) {
                console.log('gltf', gltf);
                const model = gltf.scene;
                model.traverse((node: any) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                model.position.set(0, 0, 0);
                model.scale.set(1, 1, 1);
                scene.add(model);

                // const mesh = new THREE.Mesh(
                //     new THREE.PlaneGeometry(100, 100),
                //     new THREE.MeshPhongMaterial({
                //         color: 0x999999,
                //         depthWrite: false,
                //     })
                // );
                // mesh.rotation.x = -Math.PI / 2;
                // mesh.receiveShadow = true;
                // scene.add(mesh);

                mixer = new THREE.AnimationMixer(model);
                // mixer.clipAction(gltf.animations[0]).play();

                setBallModel(model);
                render();
                loadingEE.emit(`progress.${LoadingSourceType.HOME_GLTF}`, 1);
            },
            (event) => {
                loadingEE.emit(
                    `progress.${LoadingSourceType.HOME_GLTF}`,
                    event.total ? (event.loaded / event.total) * 0.95 : 0.5
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
        let frameId: number;

        function render() {
            const delta = clock.getDelta();
            mixer?.update?.(delta);
            controls.update();
            // light.position.copy(camera.position);

            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
            // console.log(camera.position);
        }

        function animate() {
            frameId = requestAnimationFrame(animate);
            render();
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

        const observer = new ResizeObserver(resize);
        observer.observe(container);

        return {
            onVisible: () => {
                animate();
            },
            onHide: () => {
                cancelAnimationFrame(frameId);
            },
            onDestroy: () => {
                observer.disconnect();
                pointersRemoveHandle.forEach((removeHandle) => removeHandle());
                labelRenderer.domElement.removeEventListener(
                    'pointerup',
                    handleResetCamera
                );
                container.removeChild(renderer.domElement);
                container.removeChild(labelRenderer.domElement);
            },
        };
    });

    return <div className='home-gl' ref={containerRef} />;
});
