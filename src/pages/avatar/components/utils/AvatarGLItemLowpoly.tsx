import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { AvatarGLItemBaseWithParticle } from './base/AvatarGLItemBaseWithParticle';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';

export class AvatarGLItemLowpoly extends AvatarGLItemBaseWithParticle {
    public particleCanvasWidth = 1080;
    public particleCanvasHeight = 1080;
    public particleImgOffset = 140;

    public extraNode = (
        <>
            <div className='avatar-extra-subtitle'>SecretShop</div>
            <div className='avatar-extra-text'>→ The marketplace</div>
            <div className='avatar-extra-subtitle'>GameMaster</div>
            <div className='avatar-extra-text'>→ The governance</div>
        </>
    );

    load() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        this.loadingPromise = new Promise((resolve, reject) => {
            let gltfLoaded = false;
            let imageLoaded = false;
            new GLTFLoader().load(
                getPublicAssetPath('files/avatar/avatar-lowpoly.glb?v050901'),
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(0, -2.9, 0);
                    model.scale.set(3.6, 3.6, 3.6);
                    model.rotation.y = Math.PI * 1.7;
                    this.scene.add(model);
                    this.mixer = new THREE.AnimationMixer(model);
                    // this.mixer?.clipAction(gltf.animations?.[0])?.play();
                    gltfLoaded = true;
                    this.loaded = gltfLoaded && imageLoaded;
                    this.render();
                    if (this.loaded) {
                        resolve();
                    }
                    this.scene.add(
                        new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
                    );
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_LOWPOLY}`,
                        1
                    );
                },
                (event) => {
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_LOWPOLY}`,
                        event.total ? (event.loaded / event.total) * 0.95 : 0.5
                    );
                }
            );

            const imageUrls = new Array(360).fill(0).map((_, i) => {
                return getPublicAssetPath(
                    `files/avatar/avatar-lowpoly-particle/${i + 1 + 60000}.jpg`
                );
            });
            const imageLoader = new THREE.ImageLoader();
            Promise.all(imageUrls.map((url) => imageLoader.load(url))).then(
                (data) => {
                    this.imageDataArray = data;
                    imageLoaded = true;
                    this.loaded = gltfLoaded && imageLoaded;
                    this.render();
                    if (this.loaded) {
                        resolve();
                    }
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_LOWPOLY_PARTICLE}`,
                        1
                    );
                }
            );
        });
        return this.loadingPromise;
    }
}
