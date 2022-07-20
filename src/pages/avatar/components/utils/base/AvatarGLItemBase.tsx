import * as THREE from 'three';
import ResizeObserver from 'resize-observer-polyfill';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import EventEmitter from 'eventemitter3';

export class AvatarGLItemBase extends EventEmitter {
    /** 额外的 node，用于放置说明等文案 */
    public extraNode?: JSX.Element = void 0;

    public loaded = false;
    public loadingPromise: Promise<void> | null = null;
    public mountContainer?: HTMLDivElement;
    protected frameId: number = 0;
    protected observer?: ResizeObserver;

    public container = document.createElement('div');
    public rendererWrap = document.createElement('div');
    public renderer = new THREE.WebGLRenderer({ alpha: true });
    public readonly scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera;
    public controls: OrbitControls;
    protected mixer?: THREE.AnimationMixer;
    protected clock = new THREE.Clock();

    // For cluster
    // All shining particles(tiny) are included in this cluster 
    public g = new THREE.SphereBufferGeometry(0.007);
    public m = new THREE.MeshStandardMaterial();

    public m_color = new THREE.Color("#99ddff");
    public pts: THREE.Vector3[] = [];
    public cluster;

    // For cluster
    // All shining particles(large) are included in this cluster 
    public g_l = new THREE.SphereBufferGeometry(0.012);
    public m_l = new THREE.MeshStandardMaterial();

    public m_l_color = new THREE.Color("#99ddff");
    public pts_l: THREE.Vector3[] = [];
    public cluster_l;
    public center;

    public effectComposer;
    public renderPass;
    public unrealBloomPass;

    // triangles
    public trianglePts: THREE.Vector3[] = [];
    public triangleGeometry = new THREE.BufferGeometry();
    public trianglePositions: number[] = [];
    public triangleNormals: number[] = [];
    public triangleColors: number[] = [];
    public triangleColor = new THREE.Color();
    public d = 1.5;
    public d2 = this.d / 2;
    public pA = new THREE.Vector3();
    public pB = new THREE.Vector3();
    public pC = new THREE.Vector3();
    public cb = new THREE.Vector3();
    public ab = new THREE.Vector3();


    public modelGroup: THREE.Group = new THREE.Group();
    public particlesGroup: THREE.Group = new THREE.Group();
    public trianglesGroup: THREE.Group = new THREE.Group();
    public light: boolean = false;


    constructor() {
        super();
        this.m.transparent = true;
        this.m.opacity = 0.8;
        this.m_l.transparent = true;
        this.m_l.opacity = 0.8;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.camera = new THREE.PerspectiveCamera(40, 1, 1, 100);
        this.camera.position.set(5, 2, 8);
        this.scene.add(this.camera);

        const axesHelper = new THREE.AxesHelper(10);
        // this.scene.add(axesHelper);
        const controls = new OrbitControls(this.camera, this.container);
        controls.target.set(0, 0, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI * 0.5;
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;
        this.controls = controls;

        this.rendererWrap.appendChild(this.renderer.domElement);
        this.rendererWrap.className = 'avatar-gl-renderer-wrap';

        this.container.appendChild(this.rendererWrap);
        this.container.className =
            'avatar-gl-container app-container-loading loading';


        // 发光材质显示
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 2.7, 1, 0.5)
        this.effectComposer = new EffectComposer(this.renderer)
        this.effectComposer.setSize(window.innerWidth, window.innerHeight)
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.effectComposer.addPass(this.renderPass)
        this.effectComposer.addPass(this.unrealBloomPass)
        this.effectComposer.renderToScreen = true;
    }
    load() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        this.loadingPromise = Promise.resolve();
        this.container.classList.remove('loading');
        return this.loadingPromise;
    }
    mount(mountContainer: HTMLDivElement) {
        this.mountContainer = mountContainer;
        this.resize();
        this.observer = new ResizeObserver(() => {
            this.resize();
        });
        this.observer.observe(this.container);
        gsap.set(this.container, { opacity: 0 });
        this.mountContainer.appendChild(this.container);
    }
    enter() {
        // 确保一定在加载了
        this.load();
        this.container.style.zIndex = '3';
        this.camera.position.set(5, 2, 8);
        this.animate();
        gsap.fromTo(
            this.container,
            {
                display: 'block',
                x: 280,
                y: 0,
                opacity: 0,
            },
            {
                duration: 0.4,
                x: 0,
                y: 0,
                opacity: 1,
                delay: 0.2,
                onComplete: () => { },
            }
        );
    }
    leave() {
        this.container.style.zIndex = '1';
        gsap.to(this.container, {
            duration: 0.4,
            display: 'none',
            opacity: 0,
            x: -200,
            y: 0,
            onComplete: () => {
                cancelAnimationFrame(this.frameId);
            },
        });
    }
    unMount() {
        this.container.style.zIndex = '1';
        cancelAnimationFrame(this.frameId);
        this.observer?.disconnect();
        this.mountContainer?.removeChild(this.container);
    }

    protected render() {
        // if (!this.loaded) {
        //     return;
        // }
        const delta = this.clock.getDelta();
        this.mixer?.update(delta);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        if (this.light) {
            this.effectComposer.render()
        }

    }

    protected animate() {
        this.frameId = requestAnimationFrame(() => this.animate());
        this.render();
    }

    protected resize() {
        this.camera.aspect =
            this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
        this.renderer.domElement.style.width = `${this.container.clientWidth}px`;
        this.renderer.domElement.style.height = `${this.container.clientHeight}px`;
        this.effectComposer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}
