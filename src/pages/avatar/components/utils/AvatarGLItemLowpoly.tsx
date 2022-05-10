import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { AvatarGLItemBaseWithParticle } from './base/AvatarGLItemBaseWithParticle';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';
import { padStart } from 'lodash-es';

export class AvatarGLItemLowpoly extends AvatarGLItemBaseWithParticle {
    public particleCanvasWidth = 840;
    public particleCanvasHeight = 1080;

    public extraNode = (
        <>
            <div className='avatar-extra-subtitle'>SecretShop</div>
            <div className='avatar-extra-text'>→ The marketplace</div>
            <div className='avatar-extra-subtitle'>GameMaster</div>
            <div className='avatar-extra-text'>→ The governance</div>
        </>
    );

    getParticleIndex() {
        return Math.floor(
            (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
                this.imageDataArray.length +
                this.imageDataArray.length +
                288) %
                this.imageDataArray.length
        );
    }

    load() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        this.loadingPromise = new Promise((resolve, reject) => {
            let gltfLoaded = false;
            let imageLoaded = false;
            new GLTFLoader().load(
                getPublicAssetPath('files/avatar/avatar-lowpoly.glb?v051001'),
                (gltf) => {
                    const ambientLight = new THREE.AmbientLight(0xb4d1f2, 0.2);
                    this.camera.add(ambientLight);
                    const directionalLight = new THREE.DirectionalLight(
                        0xeacfc1,
                        1.5
                    );
                    directionalLight.position.set(0.5, 0, 0.866); // ~60º
                    this.camera.add(directionalLight);

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

            const imageUrls = new Array(480).fill(0).map((_, i) => {
                padStart(`${i + 1}`, 3, '0');
                return getPublicAssetPath(
                    `files/avatar/avatar-lowpoly-particle/${padStart(
                        `${i + 1}`,
                        3,
                        '0'
                    )}.jpg`
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
