import React, {
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getPublicAssetPath } from '../../../utils';
import { gsap } from 'gsap';
import { get } from 'lodash-es';
import './AvatarGL.less';
import { AvatarType } from '../Avatar.config';

export interface AvatarGLRef {
    switchTo: (type: AvatarType | null) => void;
}

export const AvatarGL = forwardRef<AvatarGLRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const needAnimateTypeRef = useRef<AvatarType | null>(null);
    const animatedTypeRef = useRef<AvatarType | null>(null);
    const animatedTypeHandleOffRef = useRef<Function | null>(null);

    useImperativeHandle(
        ref,
        () => ({
            switchTo: (type) => {
                needAnimateTypeRef.current = type;
            },
        }),
        []
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        let frameId: number = 0;
        let mixer: THREE.AnimationMixer | null;
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
        // scene.environment = pmremGenerator.fromScene(
        //     new RoomEnvironment(),
        //     0.02
        // ).texture;

        // const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        // scene.add(ambient);
        scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6));

        // const spotLight = new THREE.SpotLight(0xffffff, 1);
        // spotLight.position.set(-10, -14, -16);
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

        const axesHelper = new THREE.AxesHelper(10);
        // scene.add(axesHelper);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI * 0.5;
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 10;

        const pointer = new THREE.Vector2();
        const radius = 100;
        const raycaster = new THREE.Raycaster();

        const modelActionMap: Partial<
            Record<AvatarType, () => () => void>
        > = {};

        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath("js/libs/lib-draco/gltf/");
        // loader.setDRACOLoader(dracoLoader);
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-normal.glb'),
            function (gltf) {
                const model = gltf.scene;
                model.position.set(0, -2, 0);
                model.scale.set(3, 3, 3);
                modelActionMap[AvatarType.NORMAL] = () => {
                    scene.add(model);
                    mixer = new THREE.AnimationMixer(model);
                    // mixer.clipAction(gltf.animations?.[0])?.play();
                    return () => {
                        mixer = null;
                        scene.remove(model);
                    };
                };
            }
        );
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-cartoon.glb'),
            function (gltf) {
                const model = gltf.scene;
                model.position.set(0, -2, 0);
                model.scale.set(3, 3, 3);
                modelActionMap[AvatarType.CARTOON] = () => {
                    scene.add(model);
                    mixer = new THREE.AnimationMixer(model);
                    // mixer.clipAction(gltf.animations?.[0])?.play();
                    return () => {
                        mixer = null;
                        scene.remove(model);
                    };
                };
            }
        );
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-dokv.glb'),
            function (gltf) {
                const model = gltf.scene;
                model.position.set(0, -2, 0);
                model.scale.set(3, 3, 3);
                modelActionMap[AvatarType.DOKV] = () => {
                    scene.add(model);
                    mixer = new THREE.AnimationMixer(model);
                    mixer.clipAction(gltf.animations?.[0])?.play();
                    return () => {
                        mixer = null;
                        scene.remove(model);
                    };
                };
            }
        );

        animate();

        function animate() {
            frameId = requestAnimationFrame(animate);
            if (animatedTypeRef.current !== needAnimateTypeRef.current) {
                const loaded =
                    needAnimateTypeRef.current &&
                    modelActionMap[needAnimateTypeRef.current];
                // 等加载完再做动作
                if (loaded) {
                    animatedTypeHandleOffRef.current?.();
                    animatedTypeHandleOffRef.current = loaded?.() || null;
                    animatedTypeRef.current = needAnimateTypeRef.current;
                }
            }
            const delta = clock.getDelta();
            mixer?.update(delta);
            controls.update();

            // spotLight.position.set(
            //     camera.position.x,
            //     camera.position.y,
            //     camera.position.z
            // );

            // raycaster.setFromCamera(pointer, camera);
            // const intersects = raycaster.intersectObjects(
            //     scene.children,
            //     false
            // );
            // if (intersects.length > 0) {
            //     console.log(intersects);
            // } else {
            // }
            renderer.render(scene, camera);
        }

        function resize() {
            if (!container) {
                return;
            }
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        function onPointerMove(event) {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        const observer = new ResizeObserver(resize);
        observer.observe(container);
        container.addEventListener('pointermove', onPointerMove);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            container.removeEventListener('pointermove', onPointerMove);
            container.removeChild(renderer.domElement);
        };
    }, []);

    return <div className='avatar-gl' ref={containerRef} />;
});
