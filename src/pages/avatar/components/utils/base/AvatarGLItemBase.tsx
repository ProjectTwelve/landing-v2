import * as THREE from 'three';
import ResizeObserver from 'resize-observer-polyfill';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
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
    // 模型展示iframe
    public iframeElement= document.createElement('iframe');

    // public renderer = new THREE.WebGLRenderer({ alpha: true });
    // public readonly scene = new THREE.Scene();
    // public camera: THREE.PerspectiveCamera;
    // public controls: OrbitControls;
    // protected mixer?: THREE.AnimationMixer;
    // protected clock = new THREE.Clock();

    constructor() {
        super();
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        // this.renderer.outputEncoding = THREE.sRGBEncoding;
        // this.camera = new THREE.PerspectiveCamera(40, 1, 1, 100);
        // this.camera.position.set(5, 2, 8);
        // this.scene.add(this.camera);

        // const axesHelper = new THREE.AxesHelper(10);
        // this.scene.add(axesHelper);
        // const controls = new OrbitControls(this.camera, this.container);
        // controls.target.set(0, 0, 0);
        // controls.update();
        // controls.enablePan = false;
        // controls.enableDamping = true;
        // controls.enableZoom = false;
        // controls.minPolarAngle = Math.PI * 0.5;
        // controls.maxPolarAngle = Math.PI * 0.5;
        // controls.autoRotate = true;
        // controls.autoRotateSpeed = 1.5;
        // this.controls = controls;

        // 模型展示iframe样式
        this.iframeElement.style.width='60%'
        this.iframeElement.style.height='80%'
        this.iframeElement.style.position='absolute';
        this.iframeElement.style.left='50%'
        this.iframeElement.style.top='50%'
        this.iframeElement.style.transform = 'translate(-50%, -50%)'
        this.iframeElement.style.zIndex='11'
        this.iframeElement.style.opacity='1'

        this.iframeElement.addEventListener('mouseenter', () => {
            document.getElementById('avatar-mouse')?.classList.add('hover');
        });
        this.iframeElement.addEventListener('mouseleave', () => {
            document.getElementById('avatar-mouse')?.classList.remove('hover');
        });
        // this.rendererWrap.appendChild(this.renderer.domElement);
        this.rendererWrap.appendChild(this.iframeElement);
        this.rendererWrap.className = 'avatar-gl-renderer-wrap';

        this.container.appendChild(this.rendererWrap);
        this.container.className =
            'avatar-gl-container app-container-loading loading';
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
        // this.resize();
        // this.observer = new ResizeObserver(() => {
        //     this.resize();
        // });
        // this.observer.observe(this.container);
        gsap.set(this.container, { opacity: 0 });
        this.mountContainer.appendChild(this.container);
    }
    enter() {
        // 确保一定在加载了
        this.load();
        this.container.style.zIndex = '3';
        // this.camera.position.set(5, 2, 8);
        // this.animate();
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
                onComplete: () => {},
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

    // protected render() {
    //     // if (!this.loaded) {
    //     //     return;
    //     // }
    //     const delta = this.clock.getDelta();
    //     this.mixer?.update(delta);
    //     this.controls.update();
    //     this.renderer.render(this.scene, this.camera);
    // }

    // protected animate() {
    //     this.frameId = requestAnimationFrame(() => this.animate());
    //     this.render();
    // }

    // protected resize() {
    //     this.camera.aspect =
    //         this.container.clientWidth / this.container.clientHeight;
    //     this.camera.updateProjectionMatrix();
    //     this.renderer.setSize(
    //         this.container.clientWidth,
    //         this.container.clientHeight
    //     );
    //     this.renderer.domElement.style.width = `${this.container.clientWidth}px`;
    //     this.renderer.domElement.style.height = `${this.container.clientHeight}px`;
    // }
}
