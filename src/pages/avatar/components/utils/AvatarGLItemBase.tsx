import * as THREE from 'three';
import ResizeObserver from 'resize-observer-polyfill';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

export class AvatarGLItemBase {
    public loaded = false;
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

    constructor() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.camera = new THREE.PerspectiveCamera(40, 1, 1, 100);
        this.camera.position.set(5, 2, 8);

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
        controls.autoRotateSpeed = 2;
        this.controls = controls;

        this.rendererWrap.appendChild(this.renderer.domElement);
        this.rendererWrap.className = 'avatar-gl-renderer-wrap';

        this.container.appendChild(this.rendererWrap);
        this.container.className = 'avatar-gl-container';
    }
    load() {}
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
        this.container.style.zIndex = '3';
        this.animate();
        gsap.to(this.container, {
            duration: 0.6,
            opacity: 1,
            onComplete: () => {},
        });
    }
    leave() {
        this.container.style.zIndex = '1';
        gsap.to(this.container, {
            duration: 0.6,
            opacity: 0,
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
    protected animate() {
        this.frameId = requestAnimationFrame(() => this.animate());
        if (!this.loaded) {
            return;
        }
        const delta = this.clock.getDelta();
        this.mixer?.update(delta);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
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
    }
}
