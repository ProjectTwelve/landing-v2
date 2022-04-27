import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { AvatarGLItemBase } from './AvatarGLItemBase';
import { gsap } from 'gsap';

export class AvatarGLItemLowpoly extends AvatarGLItemBase {
    public canvasWrap = document.createElement('div');
    public canvas = document.createElement('canvas');
    public context = this.canvas.getContext('2d');
    private renderedImageIndex = -1;
    private imageDataArray: HTMLImageElement[] = [];
    private btnWrap = document.createElement('div');

    private isShowParticle = true;

    constructor() {
        super();
        this.canvas.style.pointerEvents = 'none';
        this.canvas.width = 1080;
        this.canvas.height = 1080;
        this.canvasWrap.className = 'avatar-gl-canvas-wrap';
        this.canvasWrap.appendChild(this.canvas);
        this.container.appendChild(this.canvasWrap);

        this.btnWrap.className = 'avatar-lowpoly-btn-wrap';
        this.btnWrap.addEventListener('click', this.toggleParticle.bind(this));
        this.btnWrap.addEventListener('mouseenter', () => {
            document.getElementById('avatar-mouse')?.classList.add('hover');
        });
        this.btnWrap.addEventListener('mouseleave', () => {
            document.getElementById('avatar-mouse')?.classList.remove('hover');
        });
        this.container.appendChild(this.btnWrap);

        this.rendererWrap.style.height = '100%';
        this.rendererWrap.style.opacity = '0';
        // this.rendererWrap.style.height = '0%';
        this.canvasWrap.style.height = '100%';
    }

    load() {
        super.load();
        let gltfLoaded = false;
        let imageLoaded = false;
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-lowpoly.glb'),
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, -2.9, 0);
                model.scale.set(3.6, 3.6, 3.6);
                model.rotation.y = Math.PI * 1.7;
                this.scene.add(model);
                this.mixer = new THREE.AnimationMixer(model);
                gltfLoaded = true;
                this.loaded = gltfLoaded || imageLoaded;
            }
        );

        const imageUrls = new Array(360).fill(0).map((_, i) => {
            return getPublicAssetPath(
                `files/avatar/avatar-particle/${i + 1 + 60000}.jpg`
            );
        });
        const imageLoader = new THREE.ImageLoader();
        Promise.all(imageUrls.map((url) => imageLoader.load(url))).then(
            (data) => {
                this.imageDataArray = data;
                imageLoaded = true;
                this.loaded = gltfLoaded || imageLoaded;
            }
        );
    }
    enter() {
        super.enter();
    }
    leave() {
        super.leave();
    }
    protected animate() {
        super.animate();
        const index = Math.floor(
            (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
                this.imageDataArray.length +
                this.imageDataArray.length +
                140) %
                this.imageDataArray.length
        );
        // console.log(index);
        if (this.renderedImageIndex !== index && this.context) {
            this.renderedImageIndex = index;
            this.context.drawImage(this.imageDataArray[index], 0, 0);
            const imageData = this.context.getImageData(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] + data[i + 1] + data[i + 2] < 10) {
                    data[i + 3] = 0;
                } else if (data[i] + data[i + 1] + data[i + 2] < 30) {
                    data[i + 3] = 0.6;
                }
            }
            this.context.putImageData(imageData, 0, 0);
        }
    }
    protected resize() {
        super.resize();
        this.canvas.style.width = 'auto';
        this.canvas.style.height = `${this.container.clientHeight}px`;
    }

    toggleParticle() {
        this.isShowParticle = !this.isShowParticle;
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
