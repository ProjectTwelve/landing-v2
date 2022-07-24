import * as THREE from 'three';
import { AvatarGLItemBase } from './AvatarGLItemBase';
import { GAevent } from '../../../../../utils';
import TWEEN from '@tweenjs/tween.js';
import { PageType } from '../../../../app/App.config';

enum ShowWayEnum {
    NORMAL = 'NORMAL',
    PARTICLE = 'PARTICLE',
    TRIANGLE = 'TRIANGLE',
}
type ShowWayType = ShowWayEnum.NORMAL | ShowWayEnum.PARTICLE | ShowWayEnum.TRIANGLE;
const showWayArray = Object.values(ShowWayEnum);

export class AvatarGLItemBaseWithParticle extends AvatarGLItemBase {
    public particleCanvasWidth = 1920;
    public particleCanvasHeight = 1080;
    // 序列帧和 glb 模型位置对应，所需的 offset 图片张数
    public particleImgOffset = 0;

    public canvasWrap = document.createElement('div');
    public canvas = document.createElement('canvas');
    public context = this.canvas.getContext('2d');
    private renderedImageIndex = -1;
    protected imageDataArray: HTMLImageElement[] = [];
    private btnWrap = document.createElement('div');
    public toggleTimeId = 0;

    public isEnter = false;
    public isAvatarPage = false;
    public isAllLoaded = false;
    public clearRender = true;

    public isChanged = false;

    private isShowParticle = false;

    public showType: number = 0;

    public easingEffect = TWEEN.Easing.Quadratic.InOut;

    constructor() {
        super();
        this.canvas.style.pointerEvents = 'none';
        this.canvasWrap.className = 'avatar-gl-canvas-wrap';
        // this.canvasWrap.appendChild(this.canvas);
        // this.container.appendChild(this.canvasWrap);

        this.btnWrap.className = 'avatar-particle-btn-wrap';
        let downTime = +new Date();
        let downX: number;
        let downY: number;
        this.btnWrap.addEventListener('pointerdown', (e) => {
            downTime = +new Date();
            downX = e.clientX;
            downY = e.clientY;
        });
        this.container.addEventListener('pointerup', (e) => {
            GAevent('event', 'Infra-switch');
            if (
                downTime &&
                +new Date() - downTime < 300 &&
                Math.abs(e.clientX - downX) < 50 &&
                Math.abs(e.clientY - downY) < 50
            ) {
                // 没有移动太远，表明是点击事件。以此来兼容 gl 的拖动
                this.toggleParticle(-1, true);
            }
        });
        this.btnWrap.addEventListener('mouseenter', () => {
            document.getElementById('avatar-mouse')?.classList.add('hover');
        });
        this.btnWrap.addEventListener('mouseleave', () => {
            document.getElementById('avatar-mouse')?.classList.remove('hover');
        });
        this.container.appendChild(this.btnWrap);

        this.rendererWrap.style.height = '100%';
        this.rendererWrap.style.opacity = '1';
        // this.rendererWrap.style.height = '0%';
        this.canvasWrap.style.height = '100%';
        this.canvasWrap.style.opacity = '0';
    }
    enter(currentPage: PageType = PageType.Loading, isLoading = true) {
        super.enter();
        this.isEnter = true;
        this.isAvatarPage = currentPage === PageType.Avatar;
        if (currentPage === PageType.Avatar && !isLoading) {
            clearTimeout(this.toggleTimeId);
            this.startTime();
        }


    }

    active(currentPage: PageType) {
        this.isAvatarPage = currentPage === PageType.Avatar;
        if (this.isEnter && this.isAllLoaded) {
            clearTimeout(this.toggleTimeId);
            this.startTime();
        }
    }

    stopTimeout() {
        clearTimeout(this.toggleTimeId);
    }

    restartTimout() {
        clearTimeout(this.toggleTimeId);
        // 4秒自动切换
        this.toggleTimeId = window.setTimeout(() => {
            this.toggleParticle(-1, false);
        }, 4000);
    }

    allLoaded() {
        this.isAllLoaded = true;
        if (this.isAvatarPage && this.isEnter) {
            clearTimeout(this.toggleTimeId);
            this.startTime();
        }
        this.emit('allLoaded');
    }

    startTime() {
        // 4秒自动切换
        this.toggleTimeId = window.setTimeout(() => {
            this.toggleParticle(-1, false);
        }, 4000);
    }

    leave() {
        this.isEnter = false;
        super.leave(this.clearRender);
        if (!this.clearRender) {
            this.toggleParticle(0, true, true);
        }
        clearTimeout(this.toggleTimeId);
    }

    getParticleIndex() {
        return Math.floor(
            (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
                this.imageDataArray.length +
                this.imageDataArray.length +
                0) %
            this.imageDataArray.length
        );
    }

    protected render() {
        super.render();
        if (!this.loaded) {
            return;
        }
        const index = this.getParticleIndex();
        // console.log(index);
        if (this.renderedImageIndex !== index && this.context) {
            this.renderedImageIndex = index;
            this.context.drawImage(this.imageDataArray[index], 0, 0);
            // const imageData = this.context.getImageData(
            //     0,
            //     0,
            //     this.canvas.width,
            //     this.canvas.height
            // );
            // const data = imageData.data;
            // for (let i = 0; i < data.length; i += 4) {
            //     // 提出黑边
            //     if (data[i] + data[i + 1] + data[i + 2] < 2) {
            //         data[i + 3] = 0;
            //     }
            // }
            // this.context.putImageData(imageData, 0, 0);
        }
    }
    protected resize() {
        super.resize();
        this.canvas.style.width = 'auto';
        this.canvas.style.height = `${this.container.clientHeight}px`;
        this.canvas.width = this.particleCanvasWidth;
        this.canvas.height = this.particleCanvasHeight;
    }

    toggleParticle(showType: number = -1, forceChange: boolean, resetChanged: boolean = false) {
        clearTimeout(this.toggleTimeId);
        if (!forceChange && this.isChanged) {
            // 非强制更改
            return
        }

        this.isChanged = true;
        
        // this.startTime();
        if (showType === this.showType) {
            return
        }
        if (showType === -1) {
            if (this.showType === 0) {
                if (Math.random() < 0.5) {
                    this.showType = 1;
                } else {
                    this.showType = 2;
                }
            } else {
                this.showType = 0;
            }
            // this.emit('toggled', { showType: this.showType });

        } else {
            this.showType = showType;
            // this.emit('toggled', { showType: showType });
        }


        if (showWayArray[this.showType] === ShowWayEnum.NORMAL) {
            // 粒子or三角慢慢消失
            this.modelOpacity(this.HFBXModel, 0, 1000);
            new TWEEN.Tween(this.m).to({ opacity: 0 }, 1000).easing(this.easingEffect).onComplete(() => {
                this.particlesGroup.visible = false;
                this.light = false;
            }).start();
            new TWEEN.Tween(this.m_l).to({ opacity: 0 }, 1000).easing(this.easingEffect).start();

            this.modelOpacity(this.HFBX_TModel, 0, 1000);
            new TWEEN.Tween(this.triangleMesh.material).to({ opacity: 0 }, 1000).easing(this.easingEffect).onComplete(() => {
                this.trianglesGroup.visible = false;
            }).start();

            setTimeout(() => {
                this.particlesGroup.visible = false;
                this.light = false;
                this.trianglesGroup.visible = false;
                this.modelGroup.visible = true;
                this.modelOpacity(this.gltfModel, 1, 1000);
            }, 700)
        } else if (showWayArray[this.showType] === ShowWayEnum.PARTICLE) {
            this.modelOpacity(this.gltfModel, 0);
            setTimeout(() => {
                this.modelGroup.visible = false;
                this.particlesGroup.visible = true;
                // 灯光处理
                this.scene.remove(this.ambientLight)
                this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
                this.scene.add(this.ambientLight)
                this.effectComposer.removePass(this.unrealBloomPass);
                this.unrealBloomPass.strength = 2.7;
                this.unrealBloomPass.radius = 1;
                this.unrealBloomPass.threshold = 0.5;
                this.effectComposer.addPass(this.unrealBloomPass)
                this.light = true;
                this.modelOpacity(this.HFBXModel, 1, 0);
                new TWEEN.Tween(this.m).to({ opacity: 1 }, 1500).easing(this.easingEffect).start();
                new TWEEN.Tween(this.m_l).to({ opacity: 1 }, 1500).easing(this.easingEffect).start();

            }, 500)
            // this.particlesGroup.visible = true;

            this.trianglesGroup.visible = false;
            this.modelOpacity(this.HFBX_TModel, 0, 0);
            new TWEEN.Tween(this.triangleMesh.material).to({ opacity: 0 }, 0).easing(this.easingEffect).start();

        } else if (showWayArray[this.showType] === ShowWayEnum.TRIANGLE) {
            // gltf 模型1.5s消失
            this.modelOpacity(this.gltfModel, 0);
            setTimeout(() => {
                this.modelGroup.visible = false;
                this.trianglesGroup.visible = true;
                // 灯光处理
                this.scene.remove(this.ambientLight)
                this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
                this.scene.add(this.ambientLight);
                this.effectComposer.removePass(this.unrealBloomPass);
                this.unrealBloomPass.strength = 2.4;
                this.unrealBloomPass.radius = 0.5;
                this.unrealBloomPass.threshold = 0;
                this.effectComposer.addPass(this.unrealBloomPass);
                this.light = true;
                // 三角数据
                this.modelOpacity(this.HFBX_TModel, 1, 0);
                new TWEEN.Tween(this.triangleMesh.material).to({ opacity: 1 }, 1500).easing(this.easingEffect).start();
                new TWEEN.Tween(this.triangleMesh.material).to({ opacity: 1 }, 1500).easing(this.easingEffect).start();
            }, 500)
            this.particlesGroup.visible = false;
            this.modelOpacity(this.HFBXModel, 0, 0);
            new TWEEN.Tween(this.m).to({ opacity: 0 }, 0).start();
            new TWEEN.Tween(this.m_l).to({ opacity: 0 }, 0).start();

        } else {
            this.modelOpacity(this.HFBXModel, 0, 1000);
            new TWEEN.Tween(this.m).to({ opacity: 0 }, 1000).easing(this.easingEffect).onComplete(() => {
                this.particlesGroup.visible = false;
                this.trianglesGroup.visible = false;
                this.light = false;
            }).start();
            new TWEEN.Tween(this.m_l).to({ opacity: 0 }, 1000).easing(this.easingEffect).start();

            this.modelOpacity(this.HFBX_TModel, 0, 1000);
            new TWEEN.Tween(this.triangleMesh.material).to({ opacity: 0 }, 1000).easing(this.easingEffect).onComplete(() => {
                this.trianglesGroup.visible = false;
            }).start();

            setTimeout(() => {
                this.modelGroup.visible = true;
                this.modelOpacity(this.gltfModel, 1, 1000);
            }, 500)
        }

        if(resetChanged){
            this.isChanged = false;
        }

    }

    modelOpacity(model, opacity: number, delay = 1000) {
        model.traverse(child => {
            if (child instanceof THREE.Mesh) {
                const material = child.material;
                let effect = TWEEN.Easing.Quartic.In;
                if (opacity === 1) {
                    effect = TWEEN.Easing.Quartic.Out;
                } else {
                    effect = TWEEN.Easing.Quartic.In;
                }
                new TWEEN.Tween(material).to({ opacity: opacity }, delay).easing(effect).start();
            }
        });
    }
}
