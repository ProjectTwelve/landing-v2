import { gsap } from 'gsap';
import { AvatarGLItemBase } from './AvatarGLItemBase';
import { GAevent } from '../../../../../utils';

export class AvatarGLItemBaseWithParticle extends AvatarGLItemBase {
    public particleCanvasWidth = 1920;
    public particleCanvasHeight = 1080;
    // 序列帧和 glb 模型位置对应，所需的 offset 图片张数
    public particleImgOffset = 0;

    // public canvasWrap = document.createElement('div');
    // public canvas = document.createElement('canvas');
    // public context = this.canvas.getContext('2d');
    // private renderedImageIndex = -1;
    // protected imageDataArray: HTMLImageElement[] = [];
    private btnWrap = document.createElement('div');
    private toggleTimeId = 0;

    private isShowParticle = true;

    constructor() {
        super();
        // this.canvas.style.pointerEvents = 'none';
        // this.canvasWrap.className = 'avatar-gl-canvas-wrap';
        // this.canvasWrap.appendChild(this.canvas);
        // this.container.appendChild(this.canvasWrap);

        this.btnWrap.className = 'avatar-particle-btn-wrap';
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
        //         // this.toggleParticle(!this.isShowParticle);
        //     }
        // });
        // this.btnWrap.addEventListener('mouseenter', () => {
        //     document.getElementById('avatar-mouse')?.classList.add('hover');
        // });
        // this.btnWrap.addEventListener('mouseleave', () => {
        //     document.getElementById('avatar-mouse')?.classList.remove('hover');
        // });
        this.container.appendChild(this.btnWrap);

        this.rendererWrap.style.height = '100%';
        this.rendererWrap.style.opacity = '1';
        // this.rendererWrap.style.height = '0%';
        // this.canvasWrap.style.height = '100%';
    }
    enter() {
        this.emit('enter', { isShowParticle: this.isShowParticle });
        super.enter();
        // 4秒自动切换
        // this.toggleTimeId = window.setTimeout(() => {
        //     this.toggleParticle(false);
        // }, 4000);
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

    // protected render() {
    //     super.render();
    //     if (!this.loaded) {
    //         return;
    //     }
    //     const index = this.getParticleIndex();
    //     // console.log(index);
    //     if (this.renderedImageIndex !== index && this.context) {
    //         this.renderedImageIndex = index;
    //         this.context.drawImage(this.imageDataArray[index], 0, 0);
    //         // const imageData = this.context.getImageData(
    //         //     0,
    //         //     0,
    //         //     this.canvas.width,
    //         //     this.canvas.height
    //         // );
    //         // const data = imageData.data;
    //         // for (let i = 0; i < data.length; i += 4) {
    //         //     // 提出黑边
    //         //     if (data[i] + data[i + 1] + data[i + 2] < 2) {
    //         //         data[i + 3] = 0;
    //         //     }
    //         // }
    //         // this.context.putImageData(imageData, 0, 0);
    //     }
    // }
    // protected resize() {
    //     super.resize();
    //     this.canvas.style.width = 'auto';
    //     this.canvas.style.height = `${this.container.clientHeight}px`;
    //     this.canvas.width = this.particleCanvasWidth;
    //     this.canvas.height = this.particleCanvasHeight;
    // }

    // toggleParticle(isShow) {
    //     clearTimeout(this.toggleTimeId);
    //     if (isShow === this.isShowParticle) {
    //         return;
    //     }
    //     this.isShowParticle = isShow;
    //     this.emit('toggled', { isShowParticle: this.isShowParticle });
    //     const _this = this;
    //     gsap.to(
    //         {},
    //         {
    //             duration: 4,
    //             ease: 'none',
    //             onStart: function () {
    //                 // _this.controls.autoRotate = false;
    //             },
    //             onUpdate: function () {
    //                 const pro = this.progress();
    //                 // _this.canvasWrap.style.height = `${
    //                 //     (_this.isShowParticle ? pro : 1 - pro) * 100
    //                 // }%`;
    //                 // _this.rendererWrap.style.height = `${
    //                 //     (_this.isShowParticle ? 1 - pro : pro) * 100
    //                 // }%`;
    //                 _this.canvasWrap.style.opacity = `${
    //                     _this.isShowParticle ? pro : 1 - pro
    //                 }`;
    //                 _this.rendererWrap.style.opacity = `${
    //                     _this.isShowParticle ? 1 - pro : pro
    //                 }`;
    //             },
    //             onComplete: function () {
    //                 // _this.controls.autoRotate = true;
    //             },
    //         }
    //     );
    // }
}
