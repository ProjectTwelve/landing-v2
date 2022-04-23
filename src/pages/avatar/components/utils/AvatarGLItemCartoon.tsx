import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { AvatarGLItemBase } from './AvatarGLItemBase';

export class AvatarGLItemCartoon extends AvatarGLItemBase {
    load() {
        super.load();
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-cartoon.glb'),
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, -3.18, 0);
                model.scale.set(3.5, 3.5, 3.5);
                this.scene.add(model);
                this.mixer = new THREE.AnimationMixer(model);
                this.loaded = true;
            }
        );
    }
}
