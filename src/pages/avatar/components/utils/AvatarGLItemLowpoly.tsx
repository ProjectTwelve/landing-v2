import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath, IS_MOBILE } from '../../../../utils';
import { AvatarGLItemBaseWithParticle } from './base/AvatarGLItemBaseWithParticle';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';
import { AvatarType } from '../../Avatar.config';
import { padStart } from 'lodash-es';
import { GUI } from 'dat.gui';

export class AvatarGLItemLowpoly extends AvatarGLItemBaseWithParticle {
    public particleCanvasWidth = IS_MOBILE ? 249 : 840;
    public particleCanvasHeight = IS_MOBILE ? 320 : 1080;

    public extraNode = (
        <>
            <div className='avatar-extra-subtitle'>SecretShop</div>
            <div className='avatar-extra-text'>→ The marketplace</div>
            <div className='avatar-extra-subtitle'>GameMaster</div>
            <div className='avatar-extra-text'>→ The governance</div>
        </>
    );

    constructor() {
        super();
        this.iframeElement.id = AvatarType.LOWPOLY+'iframe';
        this.iframeElement.src = 'https://www.sonarmeta.com/p12-viewer?index=2';
    }

    // getParticleIndex() {
    //     return Math.floor(
    //         (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
    //             this.imageDataArray.length +
    //             this.imageDataArray.length +
    //             215) %
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
    //             getPublicAssetPath('files/avatar/avatar-lowpoly.glb'),
    //             (gltf) => {
    //                 const ambientLight = new THREE.AmbientLight(0xb4d1f2, 0.2);
    //                 this.camera.add(ambientLight);
    //                 const directionalLight = new THREE.DirectionalLight(
    //                     0xeacfc1,
    //                     1.5
    //                 );
    //                 directionalLight.position.set(0.5, 0, 0.866); // ~60º
    //                 this.camera.add(directionalLight);

    //                 const model = gltf.scene;
    //                 model.position.set(-0.1, -2.77, 0.1);
    //                 model.scale.set(3.3, 3.3, 3.3);
    //                 // model.rotation.y = Math.PI * 1.7;
    //                 this.scene.add(model);

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

    //                 this.mixer = new THREE.AnimationMixer(model);
    //                 // this.mixer?.clipAction(gltf.animations?.[0])?.play();
    //                 gltfLoaded = true;
    //                 this.loaded = gltfLoaded && imageLoaded;
    //                 if (this.loaded) {
    //                     this.container.classList.remove('loading');
    //                     resolve(true);
    //                 }
    //                 loadingEE.emit(
    //                     `progress.${LoadingSourceType.AVATAR_GLTF_LOWPOLY}`,
    //                     1
    //                 );
    //             },
    //             (event) => {
    //                 loadingEE.emit(
    //                     `progress.${LoadingSourceType.AVATAR_GLTF_LOWPOLY}`,
    //                     Math.min(
    //                         event.loaded / (event.total || 1024 * 1024 * 25),
    //                         0.95
    //                     )
    //                 );
    //             }
    //         );

    //         const imageUrls = new Array(480).fill(0).map((_, i) => {
    //             padStart(`${i + 1}`, 3, '0');
    //             return getPublicAssetPath(
    //                 `files/avatar/avatar-lowpoly-particle${
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
    //                     `progress.${LoadingSourceType.AVATAR_GLTF_LOWPOLY_PARTICLE}`,
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
