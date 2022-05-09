import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';
import { AvatarGLItemBase } from './AvatarGLItemBase';

export class AvatarGLItemDokv extends AvatarGLItemBase {
    public extraNode = (
        <>
            <div className='avatar-extra-subtitle'>GameArtefact API</div>
            <div className='avatar-extra-text'>→ For NFT</div>
            <div className='avatar-extra-subtitle'>GameCoin API</div>
            <div className='avatar-extra-text'>→ For tokenomics</div>
        </>
    );

    load() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        this.loadingPromise = new Promise((resolve, reject) => {
            new GLTFLoader().load(
                getPublicAssetPath('files/avatar/avatar-dokv.glb'),
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(0.2, -3.6, -1);
                    model.scale.set(3, 3, 3);
                    this.scene.add(model);
                    this.mixer = new THREE.AnimationMixer(model);
                    this.mixer.clipAction(gltf.animations?.[0])?.play();
                    this.scene.add(
                        new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
                    );

                    this.loaded = true;
                    this.render();
                    resolve();
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_DOKV}`,
                        1
                    );
                },
                (event) => {
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_DOKV}`,
                        event.total ? (event.loaded / event.total) * 0.95 : 0.5
                    );
                }
            );
        });
        return this.loadingPromise;
    }
}
