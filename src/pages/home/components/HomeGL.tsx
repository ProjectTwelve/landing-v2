import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { ObjectControls } from 'threejs-object-controls';
import classnames from 'classnames';
import { gsap } from 'gsap';
import { useAtom } from 'jotai';
import { Vector3 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { useIsPortrait } from '../../../hooks/useIsPortrait';
import { homeActiveExtraIndexAtom } from '../../../store/home/state';
import { GAevent, IS_MOBILE, getPublicAssetPath, toRadians } from '../../../utils';
import { PageType } from '../../app/App.config';
import { usePageVisible } from '../../app/App.utils';
import { createParticleSystem } from '../utils/createParticleSystem';
import { HOME_GL_ACTIVE_DATA } from './HomeGL.config';
import './HomeGL.less';
import { GUI } from 'dat.gui';

const particlesData = [];
const maxParticleCount = 500;
let particleCount = 400;
const r = 1.8;
const rHalf = r / 2;

const effectController = {
    showDots: true,
    showLines: true,
    minDistance: 0.25,
    limitConnections: false,
    maxConnections: 35,
    perturbationStrength: 0.08, // New property for perturbation strength
    particleSize: 4,
    particleColor: 0xffffff, // This is a hexadecimal value
    lineColor: 0xffffff, // This is a hexadecimal value
};

export interface HomeGLRef {
    group?: THREE.Group;
}

export const HomeGL = forwardRef<HomeGLRef>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const groupRef = useRef<THREE.Group>();
    const [activatedIndex, setActivatedIndex] = useAtom(homeActiveExtraIndexAtom);
    const isPortrait = useIsPortrait();
    const [isLoaded, setIsLoaded] = useState(false);

    const initRotation = isPortrait
        ? {
              x: 2.62,
              y: -0.87,
              z: 2.79,
          }
        : {
              x: 1.96,
              y: 0.38,
              z: 1.06,
          };
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

        // const axesHelper = new THREE.AxesHelper(10);
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
        // const folderScale = gui.addFolder('group.scale');
        // const folderParticle = gui.addFolder('particleConfig');
        // folderParticle.add(particleConfig, 'outerCount', 1500, 4000).step(10);
        // folderParticle.add(particleConfig, 'outerRadius', 0.3, 1).step(0.05);
        // folderParticle.add(particleConfig, 'innerCount', 500, 3000).step(10);
        // folderParticle.add(particleConfig, 'innerRadius', 0.5, 2).step(0.05);
        // gui.domElement.id = 'home-gl-gui';

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(getPublicAssetPath('files/home/gltf'));

        // -------------globe
        const groupPointGlobe = new THREE.Group();

        const particlesData: any[] = [];
        let positions, colors;
        let particles;
        let pointCloud;
        let particlePositions;
        let linesMesh;
        const segments = maxParticleCount * maxParticleCount;

        positions = new Float32Array(segments * 3);
        colors = new Float32Array(segments * 3);

        const pMaterial = new THREE.PointsMaterial({
            color: effectController.particleColor,
            size: effectController.particleSize,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: false,
        });

        particles = new THREE.BufferGeometry();
        particlePositions = new Float32Array(maxParticleCount * 3);

        for (let i = 0; i < maxParticleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / maxParticleCount);
            const theta = Math.sqrt(maxParticleCount * Math.PI) * phi;

            particlePositions[i * 3] = rHalf * Math.cos(theta) * Math.sin(phi);
            particlePositions[i * 3 + 1] = rHalf * Math.sin(theta) * Math.sin(phi);
            particlePositions[i * 3 + 2] = rHalf * Math.cos(phi);

            particlesData.push({
                velocity: new THREE.Vector3(
                    (-0.5 + Math.random()) * 0.05,
                    (-0.5 + Math.random()) * 0.05,
                    (-0.5 + Math.random()) * 0.05,
                ).normalize(),
                numConnections: 0,
            });
        }

        particles.setDrawRange(0, particleCount);
        particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

        pointCloud = new THREE.Points(particles, pMaterial);
        groupPointGlobe.add(pointCloud);

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));

        geometry.computeBoundingSphere();

        geometry.setDrawRange(0, 0);

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            color: effectController.lineColor,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        linesMesh = new THREE.LineSegments(geometry, material);

        groupPointGlobe.add(linesMesh);

        // -----------------

        if (!isLoaded) {
            // 如果模型未加载，渲染粒子星球
            group.add(groupPointGlobe);
        }
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
                model.visible = false; // 初始时模型不可见
                group.add(model);
                mixer = new THREE.AnimationMixer(model);
                mixer.clipAction(gltf.animations[0]).play();

                render();
                setIsLoaded(true); // 设置模型为已加载
                startTransitionAnimation(model);
                // // 过渡效果添加
                // loadingEE.emit(`progress.${LoadingSourceType.HOME_GLTF}`, 1);
            },
            (event) => {
                // loadingEE.emit(
                //     `progress.${LoadingSourceType.HOME_GLTF}`,
                //     Math.min(event.loaded / (event.total || 1024 * 1024 * 25), 0.95),
                // );
            },
        );

        function startTransitionAnimation(model) {
            // 粒子向外溢散的动画
            const particleScatterTimeline = gsap.timeline();

            for (let i = 0; i < maxParticleCount; i++) {
                const direction = new THREE.Vector3(
                    (-0.5 + Math.random()) * 2,
                    (-0.5 + Math.random()) * 2,
                    (-0.5 + Math.random()) * 2,
                );
                const distance = 2 + Math.random() * 2;

                // Animate particle positions
                particleScatterTimeline.to(
                    particlePositions,
                    {
                        duration: 3,
                        ease: 'power2.out',
                        [i * 3]: particlePositions[i * 3] + direction.x * distance,
                        [i * 3 + 1]: particlePositions[i * 3 + 1] + direction.y * distance,
                        [i * 3 + 2]: particlePositions[i * 3 + 2] + direction.z * distance,
                        onUpdate: () => {
                            pointCloud.geometry.attributes.position.needsUpdate = true;
                        },
                    },
                    0,
                );
            }
            // 星球模型渐隐出现的动画
            const modelAppearance = gsap.timeline({
                delay: -1.7,
                onStart: () => {
                    groupPointGlobe.visible = false;
                    group.remove(groupPointGlobe);
                    model.visible = true; // 在动画开始前设置模型可见
                    // 确保模型的每个部件及其材质都支持透明度变化
                    model.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.material.transparent = true;
                            child.material.opacity = 0;
                        }
                    });
                },
            });

            // 渐隐动画，透明度从 0 变为 1
            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    modelAppearance.to(
                        child.material,
                        {
                            opacity: 1,
                            duration: 0.5,
                            ease: 'power2.inOut',
                        },
                        '<',
                    );
                }
            });
            particleScatterTimeline.add(modelAppearance);
            // 控制模型出现的时间，在粒子开始溢散后一段时间
            // modelAppearance.delay(0);
        }

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
            const delta = clock.getDelta(); // 获取两次调用之间的时间差
            const moveSpeed = 0.8; // 移动速度因子，可以根据需要调整
            let vertexpos = 0;
            let colorpos = 0;
            let numConnected = 0;

            for (let i = 0; i < particleCount; i++) particlesData[i].numConnections = 0;

            for (let i = 0; i < particleCount; i++) {
                const particleData = particlesData[i];

                // Update positions based on velocity
                particlePositions[i * 3] += particleData.velocity.x * delta * moveSpeed;
                particlePositions[i * 3 + 1] += particleData.velocity.y * delta * moveSpeed;
                particlePositions[i * 3 + 2] += particleData.velocity.z * delta * moveSpeed;

                // Project back onto the sphere
                const projected = new THREE.Vector3(
                    particlePositions[i * 3],
                    particlePositions[i * 3 + 1],
                    particlePositions[i * 3 + 2],
                )
                    .normalize()
                    .multiplyScalar(rHalf);

                particlePositions[i * 3] = projected.x;
                particlePositions[i * 3 + 1] = projected.y;
                particlePositions[i * 3 + 2] = projected.z;

                // Introduce a small perturbation to the velocity
                particleData.velocity.x += (0.5 - Math.random()) * effectController.perturbationStrength;
                particleData.velocity.y += (0.5 - Math.random()) * effectController.perturbationStrength;
                particleData.velocity.z += (0.5 - Math.random()) * effectController.perturbationStrength;
                particleData.velocity.normalize(); // Ensure the velocity's magnitude stays constant

                if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections)
                    continue;

                for (let j = i + 1; j < particleCount; j++) {
                    const particleDataB = particlesData[j];
                    if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections)
                        continue;

                    const dx = particlePositions[i * 3] - particlePositions[j * 3];
                    const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
                    const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < effectController.minDistance) {
                        particleData.numConnections++;
                        particleDataB.numConnections++;

                        const alpha = 1.0 - dist / effectController.minDistance;

                        positions[vertexpos++] = particlePositions[i * 3];
                        positions[vertexpos++] = particlePositions[i * 3 + 1];
                        positions[vertexpos++] = particlePositions[i * 3 + 2];

                        positions[vertexpos++] = particlePositions[j * 3];
                        positions[vertexpos++] = particlePositions[j * 3 + 1];
                        positions[vertexpos++] = particlePositions[j * 3 + 2];

                        colors[colorpos++] = alpha;
                        colors[colorpos++] = alpha;
                        colors[colorpos++] = alpha;

                        colors[colorpos++] = alpha;
                        colors[colorpos++] = alpha;
                        colors[colorpos++] = alpha;

                        numConnected++;
                    }
                }
            }

            linesMesh.geometry.setDrawRange(0, numConnected * 2);
            linesMesh.geometry.attributes.position.needsUpdate = true;
            linesMesh.geometry.attributes.color.needsUpdate = true;

            pointCloud.geometry.attributes.position.needsUpdate = true;

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
                // console.log('click!', groupRef?.current?.rotation);
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
