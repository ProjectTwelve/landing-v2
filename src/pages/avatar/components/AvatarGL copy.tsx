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
// import { Fire } from 'three/examples/jsm/objects/Fire';
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

    const particleRef = useRef<HTMLCanvasElement>(null);

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
        // const pmremGenerator = new THREE.PMREMGenerator(renderer);
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
        controls.autoRotateSpeed = 2;

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
                model.position.set(0, -2.9, 0);
                model.scale.set(3.6, 3.6, 3.6);
                model.rotation.y = Math.PI * 1.7;
                const mats: THREE.Material[] = [];
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material.transparent = true;
                        mats.push(child.material);
                    }
                });
                gsap.set(mats, { opacity: 0 });
                scene.add(model);
                modelActionMap[AvatarType.LOWPOLY] = () => {
                    gsap.to(mats, { duration: 0.5, opacity: 1 });
                    mixer = new THREE.AnimationMixer(model);
                    // mixer.clipAction(gltf.animations?.[0])?.play();
                    return () => {
                        mixer = null;
                        gsap.to(mats, { duration: 0.5, opacity: 0 });
                    };
                };
            }
        );
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-cartoon.glb'),
            function (gltf) {
                console.log(gltf);
                const model = gltf.scene;
                model.position.set(0, -3.18, 0);
                model.scale.set(3.5, 3.5, 3.5);
                const mats: THREE.Material[] = [];
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material.transparent = true;
                        mats.push(child.material);
                    }
                });
                gsap.set(mats, { opacity: 0 });
                scene.add(model);
                modelActionMap[AvatarType.CARTOON] = () => {
                    gsap.to(mats, { duration: 0.5, opacity: 1 });
                    mixer = new THREE.AnimationMixer(model);
                    // mixer.clipAction(gltf.animations?.[0])?.play();
                    return () => {
                        mixer = null;
                        gsap.to(mats, { duration: 0.5, opacity: 0 });
                    };
                };
            }
        );
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-dokv.glb'),
            function (gltf) {
                const model = gltf.scene;
                model.position.set(0.2, -3.8, -1);
                model.scale.set(3.2, 3.2, 3.2);
                modelActionMap[AvatarType.DOKV] = () => {
                    // Fire

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

        const imageUrls = new Array(150).fill(0).map((_, i) => {
            return getPublicAssetPath(
                `files/avatar/avatar-particle/${i + 1 + 40000}.jpg`
            );
        });
        let particleImages: HTMLImageElement[] = [];
        const imageLoader = new THREE.ImageLoader();
        imageLoader.setCrossOrigin('anonymous');
        Promise.all(
            imageUrls.map((url) => new THREE.ImageLoader().load(url))
        ).then((data) => {
            console.log('loaded image success');
            particleImages = data;
            // modelActionMap[AvatarType.PARTICLE] = () => {
            //     controls.autoRotate = false;
            //     if (particleRef.current) {
            //         particleRef.current.style.display = 'block';
            //         particleRef.current.width = 1920;
            //         particleRef.current.height = 1080;
            //     }
            //     return () => {
            //         controls.autoRotate = true;
            //         if (particleRef.current) {
            //             particleRef.current.style.display = 'none';
            //         }
            //     };
            // };
        });

        animate();
        let lastIndex = -1;

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
            const particleContext = particleRef.current?.getContext('2d');
            if (
                // animatedTypeRef.current === AvatarType.PARTICLE &&
                particleContext &&
                particleImages.length
            ) {
                const index = Math.floor(
                    (((controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
                        particleImages.length +
                        particleImages.length) %
                        particleImages.length
                );
                if (lastIndex !== index) {
                    lastIndex = index;
                    particleContext.drawImage(particleImages[index], 0, 0);
                    var imageData = particleContext.getImageData(
                        0,
                        0,
                        1920,
                        1080
                    );
                    var data = imageData.data;
                    for (var i = 0; i < data.length; i += 4) {
                        if (data[i] + data[i + 1] + data[i + 2] < 10) {
                            data[i + 3] = 0;
                        } else if (data[i] + data[i + 1] + data[i + 2] < 30) {
                            data[i + 3] = 0.6;
                        }
                    }
                    particleContext.putImageData(imageData, 0, 0);
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
        const observer = new ResizeObserver(resize);
        observer.observe(container);

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <>
            <canvas className='avatar-particle' ref={particleRef}></canvas>
            <div className='avatar-gl' ref={containerRef} />
            <div className='avatar-circle'></div>
        </>
    );
});
