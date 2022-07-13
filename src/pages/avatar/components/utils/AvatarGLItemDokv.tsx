import { padStart } from 'lodash-es';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath, IS_MOBILE } from '../../../../utils';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';
import { AvatarGLItemBase } from './base/AvatarGLItemBase';
import { AvatarGLItemBaseWithParticle } from './base/AvatarGLItemBaseWithParticle';
import { AvatarType } from '../../Avatar.config';
import { GUI } from 'dat.gui';

export class AvatarGLItemDokv extends AvatarGLItemBaseWithParticle {
    public particleCanvasWidth = IS_MOBILE ? 320 : 1200;
    public particleCanvasHeight = IS_MOBILE ? 288 : 1080;

    public extraNode = (
        <>
            <div className='avatar-extra-subtitle'>GameArtefact API</div>
            <div className='avatar-extra-text'>→ For NFT</div>
            <div className='avatar-extra-subtitle'>GameCoin API</div>
            <div className='avatar-extra-text'>→ For tokenomics</div>
        </>
    );

    constructor() {
        super();
        this.iframeElement.id = AvatarType.DOKV+'iframe';
        this.iframeElement.src = 'https://www.sonarmeta.com/p12-viewer?index=1';
    }

    // getParticleIndex() {
    //     return Math.floor(
    //         (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
    //             this.imageDataArray.length +
    //             this.imageDataArray.length +
    //             -266) %
    //             this.imageDataArray.length
    //     );
    // }

    // load() {
    //     if (this.loadingPromise) {
    //         return this.loadingPromise;
    //     }
    //     this.loadingPromise = new Promise((resolve, reject) => {
    //         let gltfLoaded = false;
    //         let imageLoaded = false;
    //         new GLTFLoader().load(
    //             getPublicAssetPath('files/avatar/avatar-dokv.glb'),
    //             (gltf) => {
    //                 const ambientLight = new THREE.AmbientLight(0xb4d1f2, 0.61);
    //                 this.camera.add(ambientLight);
    //                 const directionalLight = new THREE.DirectionalLight(
    //                     0xeacfc1,
    //                     0.8
    //                 );
    //                 directionalLight.position.set(0.5, 0, 0.866); // ~60º
    //                 this.camera.add(directionalLight);

    //                 const model = gltf.scene;
    //                 model.position.set(0.41, -2.64, -1.3);
    //                 model.scale.set(3.55, 3.55, 3.55);

    //                 // const gui = new GUI();
    //                 // const folderScale = gui.addFolder('model.scale');
    //                 // folderScale.add(model.scale, 'x').step(0.01);
    //                 // folderScale.add(model.scale, 'y').step(0.01);
    //                 // folderScale.add(model.scale, 'z').step(0.01);
    //                 // const folderPosition = gui.addFolder('model.position');
    //                 // folderPosition.add(model.position, 'x').step(0.01);
    //                 // folderPosition.add(model.position, 'y').step(0.01);
    //                 // folderPosition.add(model.position, 'z').step(0.01);
    //                 // const cameraPosition = gui.addFolder('camera.position');
    //                 // cameraPosition.add(this.camera.position, 'x').step(0.01);
    //                 // cameraPosition.add(this.camera.position, 'y').step(0.01);
    //                 // cameraPosition.add(this.camera.position, 'z').step(0.01);
    //                 // gui.domElement.id = 'home-gl-gui';
    //                 // document.body.appendChild(gui.domElement);

    //                 this.scene.add(model);
    //                 this.mixer = new THREE.AnimationMixer(model);
    //                 gltfLoaded = true;
    //                 this.loaded = gltfLoaded && imageLoaded;
    //                 if (this.loaded) {
    //                     this.container.classList.remove('loading');
    //                     resolve(true);
    //                 }
    //                 loadingEE.emit(
    //                     `progress.${LoadingSourceType.AVATAR_GLTF_DOKV}`,
    //                     1
    //                 );
    //             },
    //             (event) => {
    //                 loadingEE.emit(
    //                     `progress.${LoadingSourceType.AVATAR_GLTF_DOKV}`,
    //                     Math.min(
    //                         event.loaded / (event.total || 1024 * 1024 * 25),
    //                         0.95
    //                     )
    //                 );
    //             }
    //         );

    //         const imageUrls = new Array(480).fill(0).map((_, i) => {
    //             return getPublicAssetPath(
    //                 `files/avatar/avatar-dokv-particle${
    //                     IS_MOBILE ? '-mobile' : ''
    //                 }/${padStart(`${i + 1}`, 3, '0')}.jpg`
    //             );
    //         });
    //         const imageLoader = new THREE.ImageLoader();
    //         Promise.all(imageUrls.map((url) => imageLoader.load(url))).then(
    //             (data) => {
    //                 this.imageDataArray = data;
    //                 imageLoaded = true;
    //                 this.loaded = gltfLoaded && imageLoaded;
    //                 if (this.loaded) {
    //                     this.container.classList.remove('loading');
    //                     resolve(true);
    //                 }
    //                 loadingEE.emit(
    //                     `progress.${LoadingSourceType.AVATAR_GLTF_DOKV_PARTICLE}`,
    //                     1
    //                 );
    //             }
    //         );
    //     }).then(() => {
    //         setTimeout(() => {
    //             // 首次渲染，做个延时防止影响首屏的入场
    //             this.render();
    //         }, 3000);
    //     });
    //     return this.loadingPromise;
    // }
}
