import { padStart } from 'lodash-es';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';
import { AvatarGLItemBaseWithParticle } from './base/AvatarGLItemBaseWithParticle';
export class AvatarGLItemCartoon extends AvatarGLItemBaseWithParticle {
    public particleCanvasWidth = 600;
    public particleCanvasHeight = 1080;

    public extraNode = (
        <>
            <div className='avatar-extra-subtitle'>Server DevOps</div>
            <div className='avatar-extra-subtitle'>Data Analytics</div>
            <div className='avatar-extra-subtitle'>Community / Social</div>
        </>
    );

    getParticleIndex() {
        return Math.floor(
            (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
                this.imageDataArray.length +
                this.imageDataArray.length +
                -215) %
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
                getPublicAssetPath('files/avatar/avatar-cartoon.glb?v051001'),
                (gltf) => {
                    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
                    this.camera.add(ambientLight);
                    const directionalLight = new THREE.DirectionalLight(
                        0xedf1b9,
                        1.3
                    );
                    directionalLight.position.set(0.5, 0, 0.866); // ~60º
                    this.camera.add(directionalLight);

                    const model = gltf.scene;
                    model.position.set(0, -3.18, 0);
                    model.scale.set(3.5, 3.5, 3.5);
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
                        `progress.${LoadingSourceType.AVATAR_GLTF_CARTOON}`,
                        1
                    );
                },
                (event) => {
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_CARTOON}`,
                        event.total ? (event.loaded / event.total) * 0.95 : 0.5
                    );
                }
            );

            const imageUrls = new Array(480).fill(0).map((_, i) => {
                return getPublicAssetPath(
                    `files/avatar/avatar-cartoon-particle/${padStart(
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
                        `progress.${LoadingSourceType.AVATAR_GLTF_CARTOON_PARTICLE}`,
                        1
                    );
                }
            );
        });
        return this.loadingPromise;
    }
}
