import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath } from '../../../../utils';
import { AvatarGLItemBase } from './AvatarGLItemBase';

export class AvatarGLItemDokv extends AvatarGLItemBase {
    load() {
        super.load();
        new GLTFLoader().load(
            getPublicAssetPath('files/avatar/avatar-dokv.glb'),
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0.2, -3.6, -1);
                model.scale.set(3, 3, 3);
                this.scene.add(model);
                this.mixer = new THREE.AnimationMixer(model);
                this.mixer.clipAction(gltf.animations?.[0])?.play();

                // const pmremGenerator = new THREE.PMREMGenerator(renderer);
                // scene.background = new THREE.Color(0x000000);
                // scene.background = new THREE.Color(0xbfe3dd);
                // scene.environment = pmremGenerator.fromScene(
                //     new RoomEnvironment(),
                //     0.02
                // ).texture;
                // const ambient = new THREE.AmbientLight(0xffffff, 0.1);
                // scene.add(ambient);
                this.scene.add(
                    new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
                );

                this.loaded = true;
                this.render();
            }
        );
    }
}
