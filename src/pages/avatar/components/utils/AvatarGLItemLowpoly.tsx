import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { AvatarGLItemBase } from './AvatarGLItemBase';
import { gsap } from 'gsap';

export class AvatarGLItemLowpoly extends AvatarGLItemBase {
    public canvas = document.createElement('canvas');
    public context = this.canvas.getContext('2d');
    private renderedImageIndex = -1;
    // private imageDataArray: ImageData[] = [];
    private imageDataArray: HTMLImageElement[] = [];

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

        const imageUrls = new Array(150).fill(0).map((_, i) => {
            return getPublicAssetPath(
                `files/avatar/avatar-particle/${i + 1 + 40000}.jpg`
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

    mount(container: HTMLDivElement) {
        super.mount(container);
        container.appendChild(this.canvas);
        this.canvas.style.pointerEvents = 'none';
    }
    enter() {
        super.enter();
        this.canvas.style.zIndex = '3';
        gsap.to(this.canvas, {
            duration: 0.6,
            opacity: 1,
            onComplete: () => {},
        });
    }
    leave() {
        super.leave();
        this.canvas.style.zIndex = '1';
        gsap.to(this.canvas, {
            duration: 0.6,
            opacity: 0,
            onComplete: () => {},
        });
    }
    unMount() {
        super.unMount();
        this.container?.removeChild(this.canvas);
    }
    protected animate() {
        super.animate();
        const index = Math.floor(
            (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
                this.imageDataArray.length +
                this.imageDataArray.length +
                60) %
                this.imageDataArray.length
        );
        if (this.renderedImageIndex !== index && this.context) {
            this.renderedImageIndex = index;
            console.log(index);
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
        if (!this.container) {
            return;
        }
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.clientHeight;
    }
}
