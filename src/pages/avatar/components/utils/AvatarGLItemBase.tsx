import * as THREE from 'three';
import ResizeObserver from 'resize-observer-polyfill';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

export class AvatarGLItemBase {
    public loaded = false;
    public container?: HTMLDivElement;
    protected frameId: number = 0;
    protected observer?: ResizeObserver;

    public readonly scene = new THREE.Scene();
    public renderer = new THREE.WebGLRenderer({ alpha: true });
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
        const controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
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
    }
    load() {}
    mount(container: HTMLDivElement) {
        this.container = container;
        this.resize();
        this.observer = new ResizeObserver(() => {
            this.resize();
        });
        this.observer.observe(this.container);
        this.container.appendChild(this.renderer.domElement);
        gsap.set(this.renderer.domElement, { opacity: 0 });
    }
    enter() {
        this.renderer.domElement.style.zIndex = '3';
        this.animate();
        gsap.to(this.renderer.domElement, {
            duration: 0.6,
            opacity: 1,
            onComplete: () => {},
        });
    }
    leave() {
        this.renderer.domElement.style.zIndex = '1';
        gsap.to(this.renderer.domElement, {
            duration: 0.6,
            opacity: 0,
            onComplete: () => {
                cancelAnimationFrame(this.frameId);
            },
        });
    }
    unMount() {
        this.renderer.domElement.style.zIndex = '1';
        cancelAnimationFrame(this.frameId);
        this.observer?.disconnect();
        this.container?.removeChild(this.renderer.domElement);
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
        if (!this.container) {
            return;
        }
        this.camera.aspect =
            this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
    }
}
