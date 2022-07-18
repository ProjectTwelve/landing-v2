import { padStart } from 'lodash-es';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath, IS_MOBILE } from '../../../../utils';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';
import { AvatarGLItemBaseWithParticle } from './base/AvatarGLItemBaseWithParticle';
import { GUI } from 'dat.gui';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export class AvatarGLItemCartoon extends AvatarGLItemBaseWithParticle {
    public particleCanvasWidth = IS_MOBILE ? 178 : 600;
    public particleCanvasHeight = IS_MOBILE ? 320 : 1080;

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
                204) %
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
                getPublicAssetPath('files/avatar/pose/SK_Cartoon_Female_021/SK_Cartoon_Female_021.glb'),
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
                    model.position.set(0.06, -3.09, -0.2);
                    model.scale.set(3.5, 3.5, 3.5);
                    this.scene.add(model);
                    this.mixer = new THREE.AnimationMixer(model);
                    // this.mixer?.clipAction(gltf.animations?.[0])?.play();
                    gltfLoaded = true;
                    this.loaded = gltfLoaded && imageLoaded;
                    if (this.loaded) {
                        this.container.classList.remove('loading');
                        resolve(true);
                    }
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_CARTOON}`,
                        1
                    );
                },
                (event) => {
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_CARTOON}`,
                        Math.min(
                            event.loaded / (event.total || 1024 * 1024 * 25),
                            0.95
                        )
                    );
                }
            );

            const loader = new FBXLoader();
            const _this = this;
            loader.load(getPublicAssetPath('files/avatar/pose/SK_Cartoon_Female_021/SK_Cartoon_Female_021_H.fbx'), function (group) {
                console.log(group,  'group--')
                var box3 = new THREE.Box3().setFromObject(group);
                var size = new THREE.Vector3();
                box3.getSize(size);
                console.log(size.x, size.y, size.z, '------');
                
                const param = 50 / Math.max(size.x, size.y, size.z);
                group.scale.set(0.03, 0.03, 0.03);
                group.position.set(0.06, -3.09, -0.2);
                let v3 = new THREE.Vector3();
                group.traverse(child => {
                    if (child instanceof THREE.Mesh) {
                        let pos = child.geometry.attributes.position;
                        
                        child.material = new THREE.MeshStandardMaterial({ color: "black" })
                        for (let i = 1; i < pos.count; i += 40) {
                            v3.fromBufferAttribute(pos, i)
                            v3.x = v3.x * 0.03
                            v3.y = v3.y * 0.03
                            v3.z = v3.z * 0.03
                            _this.pts.push(v3.clone());
                        }
                    }
                });

                // Group is the original model with a completely black skin
                _this.scene.add(group)

                _this.m.emissive = _this.m_color
                _this.m.emissiveIntensity = 0.3
                _this.m.color = _this.m_color

                _this.cluster = new THREE.InstancedMesh(_this.g, _this.m, _this.pts.length)
                _this.cluster.instanceMatrix.needsUpdate = true

                var dummy = new THREE.Object3D();
                for (let i = 0; i < _this.pts.length; i++) {
                    dummy.position.set(_this.pts[i].x, _this.pts[i].y, _this.pts[i].z);
                    dummy.updateMatrix()
                    _this.cluster.setMatrixAt(i, dummy.matrix)
                }

                _this.scene.add(_this.cluster)
            });

            // loader.load(getPublicAssetPath('files/avatar/pose/SK_Cartoon_Female_021/SK_Cartoon_Female_021_L.fbx'), function (group) {

            //     const box3 = new THREE.Box3().setFromObject(group);
            //     const size = new THREE.Vector3();
            //     box3.getSize(size);
            //     const param = 50 / Math.max(size.x, size.y, size.z);
            //     group.scale.set(param, param, param);
            //     group.position.set(0.06, -3.09, -0.2);
            //     _this.center = new THREE.Vector3();
            //     box3.getCenter(_this.center);

            //     let v3 = new THREE.Vector3();
            //     group.traverse(child => {
            //         if (child instanceof THREE.Mesh) {
            //             let pos = child.geometry.attributes.position;
            //             console.log(pos.count)
            //             for (let i = 1; i < pos.count; i += 10) {
            //                 v3.fromBufferAttribute(pos, i)
            //                 v3.x = v3.x * param
            //                 v3.y = v3.y * param
            //                 v3.z = v3.z * param
            //                 _this.pts_l.push(v3.clone());
            //             }
            //         }
            //     });

            //     _this.m_l.emissive = _this.m_l_color
            //     _this.m_l.emissiveIntensity = 0.3
            //     _this.m_l.color = _this.m_l_color

            //     _this.cluster_l = new THREE.InstancedMesh(_this.g_l, _this.m_l, _this.pts_l.length)
            //     _this.cluster_l.instanceMatrix.needsUpdate = true

            //     var dummy = new THREE.Object3D();
            //     for (let i = 0; i < _this.pts_l.length; i++) {
            //         dummy.position.set(_this.pts_l[i].x, _this.pts_l[i].y, _this.pts_l[i].z);
            //         dummy.updateMatrix()
            //         _this.cluster_l.setMatrixAt(i, dummy.matrix)
            //     }

            //     _this.scene.add(_this.cluster_l)
            // });


            const imageUrls = new Array(480).fill(0).map((_, i) => {
                return getPublicAssetPath(
                    `files/avatar/avatar-cartoon-particle${IS_MOBILE ? '-mobile' : ''
                    }/${padStart(`${i + 1}`, 3, '0')}.jpg`
                );
            });
            const imageLoader = new THREE.ImageLoader();
            Promise.all(imageUrls.map((url) => imageLoader.load(url))).then(
                (data) => {
                    this.imageDataArray = data;
                    imageLoaded = true;
                    this.loaded = gltfLoaded && imageLoaded;
                    if (this.loaded) {
                        this.container.classList.remove('loading');
                        resolve(true);
                    }
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_CARTOON_PARTICLE}`,
                        1
                    );
                }
            );
        }).then(() => {
            setTimeout(() => {
                // 首次渲染，做个延时防止影响首屏的入场
                this.render();
            }, 3000);
        });
        return this.loadingPromise;
    }
}
