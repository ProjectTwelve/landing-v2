import { gsap } from 'gsap';
import { AvatarGLItemBase } from './AvatarGLItemBase';
import { GAevent } from '../../../../../utils';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Scene } from 'three';

export class AvatarGLItemBaseWithParticle extends AvatarGLItemBase {
    public particleCanvasWidth = 1920;
    public particleCanvasHeight = 1080;
    // 序列帧和 glb 模型位置对应，所需的 offset 图片张数
    // public particleImgOffset = 0;

    public container_particle = document.createElement('div');
    public canvasWrap = document.createElement('div');
    public renderer_particle = new THREE.WebGLRenderer({ alpha: true });
    public scene_particle = new THREE.Scene();
    public camera_particle: THREE.PerspectiveCamera;
    public controls_particle: OrbitControls;
    protected clock_particle = new THREE.Clock();
    protected frameId_particle: number = 0;


    // public canvas = document.createElement('canvas');
    // public context = this.canvas.getContext('2d');
    // private renderedImageIndex = -1;
    // protected imageDataArray: HTMLImageElement[] = [];
    // private btnWrap = document.createElement('div');
    private toggleTimeId = 0;

    private isShowParticle = true;

    constructor() {
        super();
        this.renderer_particle.setPixelRatio(window.devicePixelRatio);
        this.renderer_particle.outputEncoding = THREE.sRGBEncoding;
        this.camera_particle = new THREE.PerspectiveCamera(40, 1, 1, 100);
        this.camera_particle.position.set(5, 2, 8);
        this.scene_particle.add(this.camera_particle);

        const controls_p = new OrbitControls(this.camera, this.container);
        controls_p.target.set(0, 0, 0);
        controls_p.update();
        controls_p.enablePan = false;
        controls_p.enableDamping = true;
        controls_p.enableZoom = false;
        controls_p.minPolarAngle = Math.PI * 0.5;
        controls_p.maxPolarAngle = Math.PI * 0.5;
        controls_p.autoRotate = true;
        controls_p.autoRotateSpeed = 1.5;
        this.controls_particle = controls_p;

        this.canvasWrap.appendChild(this.renderer_particle.domElement);
        this.canvasWrap.className = 'avatar-gl-canvas-wrap';

        this.container_particle.appendChild(this.canvasWrap);
        this.container_particle.className =
            'avatar-gl-container app-container-loading loading';

        // this.canvas_particle.style.pointerEvents = 'none';
        this.canvasWrap.className = 'avatar-gl-canvas-wrap';
        this.canvasWrap.appendChild(this.renderer_particle.domElement);
        this.container.appendChild(this.canvasWrap);

        // this.btnWrap.className = 'avatar-particle-btn-wrap';
        // let downTime = +new Date();
        // let downX: number;
        // let downY: number;
        // this.btnWrap.addEventListener('pointerdown', (e) => {
        //     downTime = +new Date();
        //     downX = e.clientX;
        //     downY = e.clientY;
        // });

        // this.container.addEventListener('pointerup', (e) => {
        //     GAevent('event','Infra-switch');
        //     if (
        //         downTime &&
        //         +new Date() - downTime < 300 &&
        //         Math.abs(e.clientX - downX) < 50 &&
        //         Math.abs(e.clientY - downY) < 50
        //     ) {
        //         // 没有移动太远，表明是点击事件。以此来兼容 gl 的拖动
        //         this.toggleParticle(!this.isShowParticle);
        //     }
        // });
        // this.btnWrap.addEventListener('mouseenter', () => {
        //     document.getElementById('avatar-mouse')?.classList.add('hover');
        // });
        // this.btnWrap.addEventListener('mouseleave', () => {
        //     document.getElementById('avatar-mouse')?.classList.remove('hover');
        // });
        // this.container.appendChild(this.btnWrap);

        this.rendererWrap.style.height = '100%';
        this.rendererWrap.style.opacity = '0';
        // this.rendererWrap.style.height = '0%';
        this.canvasWrap.style.height = '100%';
    }
    enter() {
        this.emit('enter', { isShowParticle: this.isShowParticle });
        super.enter();
        // 4秒自动切换
        this.toggleTimeId = window.setTimeout(() => {
            this.toggleParticle(false);
        }, 4000);
    }
    leave() {
        super.leave();
        clearTimeout(this.toggleTimeId);
    }

    // getParticleIndex() {
    //     return Math.floor(
    //         (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
    //             this.imageDataArray.length +
    //             this.imageDataArray.length +
    //             0) %
    //             this.imageDataArray.length
    //     );
    // }

    public render() {
        super.render();
        if (!this.loaded) {
            return;
        }
        // const index = this.getParticleIndex();
        // // console.log(index);
        this.controls_particle.update();
        this.renderer.render(this.scene_particle, this.camera_particle);

        // if (this.renderedImageIndex !== index && this.context) {
        //     this.renderedImageIndex = index;
        //     this.context.drawImage(this.imageDataArray[index], 0, 0);
        //     // const imageData = this.context.getImageData(
        //     //     0,
        //     //     0,
        //     //     this.canvas.width,
        //     //     this.canvas.height
        //     // );
        //     // const data = imageData.data;
        //     // for (let i = 0; i < data.length; i += 4) {
        //     //     // 提出黑边
        //     //     if (data[i] + data[i + 1] + data[i + 2] < 2) {
        //     //         data[i + 3] = 0;
        //     //     }
        //     // }
        //     // this.context.putImageData(imageData, 0, 0);
        // }
    }

    public animate() {
        super.animate();
        this.frameId_particle = requestAnimationFrame(() => this.animate());
        this.render();
    }

    protected resize() {
        super.resize();
        this.camera_particle.aspect =
            this.container_particle.clientWidth / this.container_particle.clientHeight;
        this.camera_particle.updateProjectionMatrix();
        this.renderer_particle.setSize(
            this.container_particle.clientWidth,
            this.container_particle.clientHeight
        );
        this.renderer_particle.domElement.style.width = `${this.container_particle.clientWidth}px`;
        this.renderer_particle.domElement.style.height = `${this.container_particle.clientHeight}px`;
    }

    toggleParticle(isShow) {
        clearTimeout(this.toggleTimeId);
        if (isShow === this.isShowParticle) {
            return;
        }
        this.isShowParticle = isShow;
        this.emit('toggled', { isShowParticle: this.isShowParticle });
        const _this = this;
        gsap.to(
            {},
            {
                duration: 0.4,
                ease: 'none',
                onStart: function () {
                    // _this.controls.autoRotate = false;
                },
                onUpdate: function () {
                    const pro = this.progress();
                    // _this.canvasWrap.style.height = `${
                    //     (_this.isShowParticle ? pro : 1 - pro) * 100
                    // }%`;
                    // _this.rendererWrap.style.height = `${
                    //     (_this.isShowParticle ? 1 - pro : pro) * 100
                    // }%`;

                    _this.canvasWrap.style.opacity = `${
                        _this.isShowParticle ? pro : 1 - pro
                    }`;
                    _this.rendererWrap.style.opacity = `${
                        _this.isShowParticle ? 1 - pro : pro
                    }`;
                },
                onComplete: function () {
                    // _this.controls.autoRotate = true;
                },
            }
        );
    }
}
