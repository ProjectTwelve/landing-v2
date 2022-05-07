import { AvatarGLItemBase } from './utils/AvatarGLItemBase'; 
import * as THREE from 'three';
import {Points, PointsMaterial, BufferGeometry, Float32BufferAttribute, Vector3} from 'three';

interface OrbitParticle {
    speed: number; // 轨道粒子的速度是一个弧度值，表示每一帧绕圆形旋转的弧度
    currentAngle: number; // 当前弧度数值
}

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
    private colors: Array<number> = [];
    private particles: Array<OrbitParticle> = [];
    private PARTICLE_COUNT = 0;
    private R = 4.05;
    private geometry: BufferGeometry = new BufferGeometry();
    private points: Points| null = null;
    private origin = new Vector3(0, 0, 0.6);
    private GAP_ANGLE = Math.PI * 13 / 16;

    private POINT_MATERIAL: PointsMaterial = new PointsMaterial({
        size: 0.03
    });

    constructor(particleCount = 150) {
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
    
    getPositionByAngle(angle: number): Array<number> {
        return [this.R * Math.cos(angle) + this.origin.x, this.R * Math.sin(angle) + this.origin.y,0 + this.origin.z];
    }

    updatePosition() {
        this.geometry.setAttribute(
            'position',
            new Float32BufferAttribute(this.positions, 3)
        );
    }

    initParticles () {
        const steeper = 2 * Math.PI / this.PARTICLE_COUNT;
        for(let angle = 0;angle < 2 * Math.PI; angle+=steeper) {
            if(angle > 0 && angle < this.GAP_ANGLE) continue;
            this.positions.push(...this.getPositionByAngle(angle));
            this.particles.push({
                speed: Math.PI / 800 + Math.random() * Math.PI / 1600,
                currentAngle: angle,
            });
        }
        this.updatePosition();
        this.points = new Points(this.geometry, this.POINT_MATERIAL);
    }

    updateParticles() {
        this.particles.forEach((particle: OrbitParticle, index: number) => {
            const positionIndex = index * 3;
            particle.currentAngle += particle.speed;
            if(particle.currentAngle > Math.PI * 2) {
                particle.currentAngle = particle.currentAngle - Math.PI * 2;
            }
            let newPosition: Array<number> = [];
            if(particle.currentAngle > 0 && particle.currentAngle < this.GAP_ANGLE) {
                console.log('jump');
                particle.currentAngle = this.GAP_ANGLE;
            }
            newPosition = this.getPositionByAngle(particle.currentAngle);
            this.positions[positionIndex] = newPosition[0]
            this.positions[positionIndex+1] = newPosition[1];
            this.positions[positionIndex+2] = newPosition[2];
        });
        this.updatePosition();
    }

    modifyCriclePosture() {
        this.points?.rotateX(-Math.PI / 2.49);
        this.points?.rotateY(Math.PI / 12);
        this.points?.rotateZ(Math.PI / 12);
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
        this.modifyCriclePosture();
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
        this.updateParticles();
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