import { AvatarGLItemBase } from './utils/AvatarGLItemBase'; 
import * as THREE from 'three';
import {Points, PointsMaterial, BufferGeometry, Float32BufferAttribute, Vector3} from 'three';

export class AvatarCycle {
    public loading = false;
    public loaded = false;
    public container = document.createElement('div');
    public rendererWrap = document.createElement('div');
    public renderer = new THREE.WebGLRenderer({ alpha: true });
    public readonly scene = new THREE.Scene();
    protected frameId: number = 0;
    public camera: THREE.PerspectiveCamera;
    protected mixer?: THREE.AnimationMixer;
    public mountContainer?: HTMLDivElement;
    protected clock = new THREE.Clock();
    protected observer?: ResizeObserver;

    private positions: Array<number> = [];
    private PARTICLE_COUNT = 0;
    private R = 4.05;
    private geometry: BufferGeometry = new BufferGeometry();
    private points: Points| null = null;
    private origin = new Vector3(0, 0, 0.6);

    private POINT_MATERIAL: PointsMaterial = new PointsMaterial({
        size: 0.03
    });

    constructor(particleCount = 500) {
        this.PARTICLE_COUNT = particleCount;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.camera = new THREE.PerspectiveCamera(40, 1, 1, 100);
        this.camera.position.set(0, 0, 8);

        this.rendererWrap.appendChild(this.renderer.domElement);
        this.rendererWrap.className = 'avatar-gl-renderer-wrap';

        this.container.appendChild(this.rendererWrap);
        this.container.className = 'avatar-gl-container';
    }

    initParticles () {
        const steeper = 2*Math.PI / this.PARTICLE_COUNT;
        const divider = Math.PI / 8
        for(let angle = 0;angle < 2*Math.PI; angle+=steeper) {
            if(angle > divider && angle < Math.PI - divider) continue;
            this.positions.push( this.R * Math.cos(angle) + this.origin.x, this.R * Math.sin(angle) + this.origin.y,0 + this.origin.z);
        }
        this.geometry.setAttribute(
            'position',
            new Float32BufferAttribute(this.positions, 3)
        );
        this.points = new Points(this.geometry, this.POINT_MATERIAL);
    }

    load() {
        if (this.loaded || this.loading) {
            return;
        }
        this.loading = true;
        this.initParticles();
        if(this.points) {
            this.scene.add(this.points);
        }
        this.points?.rotateX(-Math.PI/2.49);
        this.points?.rotateY(Math.PI / 12);
        this.loaded= true;
        this.loading = false;
        this.animate();
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

    protected animate() {
        this.frameId = requestAnimationFrame(() => this.animate());
        this.render();
    }

    protected render() {
        if (!this.loaded) {
            return;
        }
        const delta = this.clock.getDelta();
        this.mixer?.update(delta);
        this.renderer.render(this.scene, this.camera);
    }

    unMount() {
        this.container.style.zIndex = '1';
        cancelAnimationFrame(this.frameId);
        this.observer?.disconnect();
        this.mountContainer?.removeChild(this.container);
    }

    mount(mountContainer: HTMLDivElement) {
        this.mountContainer = mountContainer;
        this.resize();
        this.observer = new ResizeObserver(() => {
            this.resize();
        });
        this.observer.observe(this.container);
        this.mountContainer.appendChild(this.container);
        this.container.style.zIndex = '4';
        this.container.style.pointerEvents = 'none';
    }

}