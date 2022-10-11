import { Fragment, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import styles from './avatar.module.css';

import {
    Scene,
    PerspectiveCamera,
    WebGL1Renderer,
    WebGLRenderer,
    sRGBEncoding,
    Group,
    Mesh,
    Vector2,
    Object3D,
    Material,
    Points,
    MeshBasicMaterial,
    AmbientLight,
    DirectionalLight,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { useTick, FPSCap } from './hooks/useTick';
import { createPointsFromModel, createTrianglesFromModel, PointMatr } from './utils/createFromModel';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';

import { AVATAR_GL_INFO_MAP, AvatarType } from '../Avatar.config';
import { autoDispose } from './utils/autoDispose';
import { IS_MOBILE } from '../../../utils';
import { Timeout } from 'ahooks/lib/useRequest/src/types';

// import * as P from './process'

const modelLoaded = {} as { [key: number]: boolean };

export default function AvatarMesh(props: { container: MutableRefObject<HTMLElement>; avatar: AvatarType; playing: boolean }) {
    const [mode, setMode] = useState<'mesh' | 'point' | 'triangle'>('mesh');
    const [loading, setLoading] = useState(false);

    // /* @DEBUG */
    // window['setMode'] = setMode;

    /* @DEBUG */
    // window['setPlaying'] = setPlaying;

    const canvas = useRef<HTMLCanvasElement>(null!);
    const blackMask = useRef<HTMLDivElement>(null!);

    const rendererRef = useRef<WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const renderPassRef = useRef<RenderPass | null>(null);
    const effectComposerRef = useRef<EffectComposer | null>(null);
    const unrealBloomPassRef = useRef<UnrealBloomPass | null>(null);
    const bloomPassRef = useRef<BloomPass | null>(null);

    const scene = useMemo(() => new Scene(), []);
    const camera = useMemo(() => {
        const cam = new PerspectiveCamera(40, 1 / 1.2, 0.1, 50);
        cam.position.set(5, 2, 8);
        scene.add(cam);
        return cam;
    }, []);
    const modelGroup = useMemo(() => {
        const g = new Group();
        g.position.set(0, 0, 0);
        g.scale.set(0.9, 0.9, 0.9);
        scene.add(g);
        return g;
    }, []);
    const meshGroup = useMemo(() => {
        const g = new Group();
        modelGroup.add(g);
        return g;
    }, []);
    const pointGroup = useMemo(() => {
        const g = new Group();
        modelGroup.add(g);
        return g;
    }, []);
    const triangleGroup = useMemo(() => {
        const g = new Group();
        modelGroup.add(g);
        return g;
    }, []);
    const ambientLight = useMemo(() => {
        const ambientLight = new AmbientLight(0xffffff, 0.2);
        camera.add(ambientLight);
        return ambientLight;
    }, []);

    const directionalLight = useMemo(() => {
        const directionalLight = new DirectionalLight(0xedf1b9, 1.3);
        directionalLight.position.set(0.5, 0, 0.866); // ~60º
        camera.add(directionalLight);
        return directionalLight;
    }, []);

    let timeout: Timeout | null = null;
    useEffect(() => {
        setMode('mesh');

        
    }, [props.avatar]);

    useEffect(() => {
        /* diff drag from click */
        let moved = false;
        const start = () => {
            moved = false;
        };
        const move = () => {
            moved = true;
        };
        const end = () => {
            if (!moved) {
                timeout && clearTimeout(timeout);
                setMode((old) => {
                    if (old === 'mesh') return Math.random() + Math.random() > 1 ? 'point' : 'triangle';

                    return 'mesh';
                });
            }
        };

        canvas.current.addEventListener('mousedown', start);
        canvas.current.addEventListener('mousemove', move);
        canvas.current.addEventListener('mouseup', end);

        return () => {
            canvas.current.removeEventListener('mousedown', start);
            canvas.current.removeEventListener('mousemove', move);
            canvas.current.removeEventListener('mouseup', end);
        };
    }, []);

    // three.js initial
    useEffect(() => {
        const context = canvas.current.getContext('webgl2', {
            alpha: true,
            depth: true,
            stencil: false,
            antialias: !IS_MOBILE,
            xrCompatible: false,
            // antialias: window.devicePixelRatio > 1 ? false : true,
        }) as WebGLRenderingContext;

        if (!context) throw new Error('Can not create webgl context');

        rendererRef.current = new WebGLRenderer({
            canvas: canvas.current,
            context,
            precision: 'lowp',
            // alpha: true,
            // antialias: window.devicePixelRatio > 1 ? false : true, // 视网膜屏不需要抗锯齿
            // antialias: true,
            // stencil: false,
        });
        rendererRef.current.outputEncoding = sRGBEncoding;
        const renderer = rendererRef.current;

        const isWebgl2 = renderer.getContext() instanceof WebGL2RenderingContext;

        if (!isWebgl2) console.warn('webgl2 not available');

        renderPassRef.current = new RenderPass(scene, camera);

        effectComposerRef.current = new EffectComposer(renderer);

        unrealBloomPassRef.current = new UnrealBloomPass(new Vector2(1024, 1024), 2.4, 0.8, 0.1);
        bloomPassRef.current = new BloomPass();

        const renderPass = renderPassRef.current;
        const effectComposer = effectComposerRef.current;
        const unrealBloomPass = unrealBloomPassRef.current;
        const bloomPass = bloomPassRef.current;

        effectComposer.setPixelRatio(1);
        effectComposer.addPass(renderPass);
        effectComposer.addPass(unrealBloomPass);
        effectComposer.renderToScreen = true;

        controlsRef.current = new OrbitControls(camera, canvas.current);

        const controls = controlsRef.current;

        controls.target.set(0, 0, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI * 0.5;
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = (1.5 * 60) / FPSCap;

        return () => {
            controls.dispose();
            renderer.dispose();
        };
    }, []);

    const gltfLoader = useMemo(() => new GLTFLoader(), []);

    function load(url: string, index: AvatarType) {
        setLoading(true);
        gltfLoader.loadAsync(url).then(
            (gltf) => {
                // console.log(gltf.scene.position);
                const info = AVATAR_GL_INFO_MAP[index];
                gltf.scene.position.set(info.position.x || 0, info.position.y || 0, info.position.z || 0);
                gltf.scene.scale.set(info.gltfScale || 1, info.gltfScale || 1, info.gltfScale || 1);
                meshGroup.add(gltf.scene);

                gltf.scene.traverseVisible((o) => {
                    if (isMesh(o)) {
                        const material = o.material as Material;
                        // console.log(material);

                        material.transparent = true;

                        if (material.name === 'NewMaterial') {
                            o.visible = false;
                        }
                    }
                });

                gltf.scene.userData = {
                    modelIndex: index,
                };

                autoDispose(gltf.scene);

                setTimeout(() => {
                    const points = createPointsFromModel(gltf.scene);
                    pointGroup.add(points);
                    autoDispose(points);

                    setTimeout(() => {
                        const triangles = createTrianglesFromModel(gltf.scene);
                        triangleGroup.add(triangles);
                        autoDispose(triangles);
                    }, 100);
                }, 100);

                setLoading(false);
                timeout && clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const newMode = Math.random() + Math.random() > 1 ? 'point' : 'triangle';
                    setMode(newMode);
                }, 4000)
            },
            (error) => {
                console.error(error);
            },
        );
    }

    // assets
    useEffect(() => {
        console.log('model changed => ', props.avatar);

        if (!modelLoaded[props.avatar]) {
            modelLoaded[props.avatar] = true;

            const url = AVATAR_GL_INFO_MAP[props.avatar].GLTFURL;
            load(url, props.avatar);
        }else {
            timeout && clearTimeout(timeout);
            timeout = setTimeout(() => {
                const newMode = Math.random() + Math.random() > 1 ? 'point' : 'triangle';
                setMode(newMode);
            }, 4000)
        }

        controlsRef.current!.reset();
        return () => {
            timeout && clearTimeout(timeout);
        }
    }, [props.avatar]);

    const showPointsTick = (visible = true) => {
        pointGroup.traverseVisible((o) => {
            if (isPoints(o)) {
                const matr = o.material as PointMatr;
                if (visible) {
                    matr.uniforms.opacity.value = lerp(matr.uniforms.opacity.value, 1, 0.1);
                } else {
                    matr.uniforms.opacity.value = lerp(matr.uniforms.opacity.value, 0, 1);
                    // matr.opacity = matr.opacity * 0.8;
                }
            }
        });
    };
    const showMeshTick = (visible = true) => {
        meshGroup.traverseVisible((o) => {
            if (isMesh(o)) {
                // o.visible = false;
                const matr = o.material as MeshBasicMaterial;
                if (visible) {
                    matr.color.r = lerp(matr.color.r, 1, 0.2);
                    matr.color.g = lerp(matr.color.g, 1, 0.2);
                    matr.color.b = lerp(matr.color.b, 1, 0.2);

                    ambientLight.intensity = lerp(ambientLight.intensity, 0.2, 0.2);
                    directionalLight.intensity = lerp(directionalLight.intensity, 1.3, 0.2);
                } else {
                    matr.color.r = lerp(matr.color.r, 0, 0.4);
                    matr.color.g = lerp(matr.color.g, 0, 0.4);
                    matr.color.b = lerp(matr.color.b, 0, 0.4);

                    ambientLight.intensity = lerp(ambientLight.intensity, 0, 0.4);
                    directionalLight.intensity = lerp(directionalLight.intensity, 0, 0.4);
                }
            }
        });
    };
    const showTriangleTick = (visible = true) => {
        triangleGroup.traverseVisible((o) => {
            if (isMesh(o)) {
                // o.visible = false;
                const matr = o.material as MeshBasicMaterial;
                if (visible) {
                    matr.opacity = lerp(matr.opacity, 1, 0.1);
                } else {
                    matr.opacity = lerp(matr.opacity, 0, 1);
                }
            }
        });
    };

    const bloomTick = (on = true) => {
        const unrealBloomPass = unrealBloomPassRef.current;
        if (!unrealBloomPass) {
            console.error('!unrealBloomPass');
            return;
        }
        if (on) {
            unrealBloomPass.strength = lerp(unrealBloomPass.strength, 2.4, 0.1);
            blackMask.current.style.opacity = '1';
        } else {
            unrealBloomPass.strength = 0;
            blackMask.current.style.opacity = '0';
        }
    };

    const chooseModelTick = () => {
        meshGroup.children.forEach((g) => {
            if (g.userData.modelIndex === props.avatar) {
                g.visible = true;
            } else {
                g.visible = false;
            }
        });
        pointGroup.children.forEach((g) => {
            if (g.userData.modelIndex === props.avatar) {
                g.visible = true;
            } else {
                g.visible = false;
            }
        });
        triangleGroup.children.forEach((g) => {
            if (g.userData.modelIndex === props.avatar) {
                g.visible = true;
            } else {
                g.visible = false;
            }
        });
    };

    // render cycle

    useTick(
        (timestamp, interval) => {
            if (props.playing) {
                const controls = controlsRef.current!;
                controls.update();

                const renderer = rendererRef.current!;

                chooseModelTick();

                switch (mode) {
                    case 'mesh': {
                        showPointsTick(false);
                        showMeshTick(true);
                        showTriangleTick(false);
                        bloomTick(false);
                        renderer.setRenderTarget(null);
                        renderer.render(scene, camera);
                        break;
                    }
                    case 'point': {
                        showPointsTick(true);
                        showMeshTick(false);
                        showTriangleTick(false);
                        bloomTick(true);
                        effectComposerRef.current!.render();
                        break;
                    }
                    case 'triangle': {
                        showPointsTick(false);
                        showMeshTick(false);
                        showTriangleTick(true);
                        bloomTick(true);
                        effectComposerRef.current!.render();
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        },
        [props.playing, mode, props.avatar],
    );

    useEffect(() => {
        let width = props.container.current.clientWidth;
        let height = props.container.current.clientHeight;

        console.log('initial res: ' + width + 'x' + height);

        const id = setInterval(() => {
            const newWidth = props.container.current.clientWidth;
            const newHeight = props.container.current.clientHeight;

            if (newWidth === 0 || newHeight === 0) return;

            if (newWidth !== width || newHeight !== height) {
                console.log('new res: ' + newWidth + 'x' + newHeight);

                width = newWidth;
                height = newHeight;
                // rendererRef.current!.setSize(newWidth * window.devicePixelRatio, newHeight * window.devicePixelRatio, false);
                // effectComposerRef.current!.setSize(newWidth * window.devicePixelRatio, newHeight * window.devicePixelRatio);
            }
        }, 1000);

        if (width === 0 || height === 0) return;

        rendererRef.current!.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio, false);
        effectComposerRef.current!.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio);

        return () => clearInterval(id);
    }, []);

    //

    return (
        <Fragment>
            <div ref={blackMask} className={styles.blackMask}></div>
            <canvas ref={canvas} className={styles.canvas}></canvas>
            <div className={`${styles.loadingMask} ${loading ? styles.loading : ''}`}></div>
        </Fragment>
    );
}

function isMesh(o: Object3D): o is Mesh {
    return !!(o as any).isMesh;
}
function isPoints(o: Object3D): o is Points {
    return !!(o as any).isPoints;
}

function lerp(v0: number, v1: number, t: number) {
    return v0 * (1 - t) + v1 * t;
}
