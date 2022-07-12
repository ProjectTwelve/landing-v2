import { padStart } from 'lodash-es';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { getPublicAssetPath, IS_MOBILE } from '../../../../utils';
import { loadingEE, LoadingSourceType } from '../../../app/App.utils';
import { AvatarGLItemBase } from './base/AvatarGLItemBase';
import { AvatarGLItemBaseWithParticle } from './base/AvatarGLItemBaseWithParticle';
import { GUI } from 'lil-gui';
import { Mesh, Vector3, Vector2, Scene } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import cluster from 'cluster';

export class AvatarGLItemDokv extends AvatarGLItemBaseWithParticle {
    public particleCanvasWidth = IS_MOBILE ? 320 : 1200;
    public particleCanvasHeight = IS_MOBILE ? 288 : 1080;
    public effectComposer;

    // private toggleTimeId = 0;
    // private isShowParticle = true;

    public extraNode = (
        <>
            <div className='avatar-extra-subtitle'>GameArtefact API</div>
            <div className='avatar-extra-text'>→ For NFT</div>
            <div className='avatar-extra-subtitle'>GameCoin API</div>
            <div className='avatar-extra-text'>→ For tokenomics</div>
        </>
    );

    // getParticleIndex() {
    //     return Math.floor(
    //         (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
    //             this.imageDataArray.length +
    //             this.imageDataArray.length +
    //             -266) %
    //             this.imageDataArray.length
    //     );
    // }

    load() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        this.loadingPromise = new Promise((resolve, reject) => {
            let gltfLoaded = false;
            new GLTFLoader().load(
                getPublicAssetPath('files/avatar/avatar-dokv.glb'),
                (gltf) => {
                    const ambientLight = new THREE.AmbientLight(0xb4d1f2, 0.61);
                    this.scene.add(ambientLight);
                    const directionalLight = new THREE.DirectionalLight(
                        0xeacfc1,
                        0.8
                    );
                    // directionalLight.position.set(0.5, 0, 0.866); // ~60º
                    // this.camera.add(directionalLight);

                    const model = gltf.scene;
                    model.position.set(0.41, -2.64, -1.3);
                    model.scale.set(3.55, 3.55, 3.55);

                    // const gui = new GUI();
                    // const folderScale = gui.addFolder('model.scale');
                    // folderScale.add(model.scale, 'x').step(0.01);
                    // folderScale.add(model.scale, 'y').step(0.01);
                    // folderScale.add(model.scale, 'z').step(0.01);
                    // const folderPosition = gui.addFolder('model.position');
                    // folderPosition.add(model.position, 'x').step(0.01);
                    // folderPosition.add(model.position, 'y').step(0.01);
                    // folderPosition.add(model.position, 'z').step(0.01);
                    // const cameraPosition = gui.addFolder('camera.position');
                    // cameraPosition.add(this.camera.position, 'x').step(0.01);
                    // cameraPosition.add(this.camera.position, 'y').step(0.01);
                    // cameraPosition.add(this.camera.position, 'z').step(0.01);
                    // gui.domElement.id = 'home-gl-gui';
                    // document.body.appendChild(gui.domElement);

                    this.scene.add(model);
                    this.mixer = new THREE.AnimationMixer(model);
                    gltfLoaded = true;
                    this.loaded = gltfLoaded;
                    if (this.loaded) {
                        this.container.classList.remove('loading');
                        resolve(true);
                    }
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_DOKV}`,
                        1
                    );
                },
                (event) => {
                    loadingEE.emit(
                        `progress.${LoadingSourceType.AVATAR_GLTF_DOKV}`,
                        Math.min(
                            event.loaded / (event.total || 1024 * 1024 * 25),
                            0.95
                        )
                    );
                }
            );

            // For cluster
            // All shining particles(tiny) are included in this cluster 
            var g = new THREE.SphereBufferGeometry(0.03);
            var m = new THREE.MeshStandardMaterial();
            m.transparent = true;
            m.opacity = 0.8;
            var m_color = new THREE.Color("#99ddff");
            var pts: Vector3[] = [];
            var cluster;

            // For cluster
            // All shining particles(large) are included in this cluster 
            var g_l = new THREE.SphereBufferGeometry(0.06);
            var m_l = new THREE.MeshStandardMaterial();
            m_l.transparent = true;
            m_l.opacity = 0.8;
            var m_l_color = new THREE.Color("#99ddff");
            var pts_l: Vector3[] = [];
            var cluster_l;

            // Load FBX file
            const loader = new FBXLoader();
            // {...}_H models are used to draw shinging particles(tiny)
            loader.load( 'files/avatar/pose/SK_Cartoon_Female_021/SK_Cartoon_Female_021_H.fbx',  ( group ) => {
                var box3 = new THREE.Box3().setFromObject(group);
                var size = new THREE.Vector3();
                box3.getSize(size);
                const param = 15 / Math.max(size.x, size.y, size.z);
                group.scale.set(param, param, param);
                
                let v3 = new THREE.Vector3();
                group.traverse(child => {
                    if (child instanceof Mesh){
                        let pos = child.geometry.attributes.position;
                        child.material = new THREE.MeshStandardMaterial({color:"black"})
                        for (let i = 1; i < pos.count; i+=40){
                            v3.fromBufferAttribute(pos, i)
                            v3.x = v3.x *param
                            v3.y = v3.y *param
                            v3.z = v3.z *param
                            pts.push(v3);
                        }
                    }
                });
            
                // Group is the original model with a completely black skin
                this.scene_particle.add(group)
                
                m.emissive = m_color
                m.emissiveIntensity = 0.3
                m.color = m_color
            
                cluster = new THREE.InstancedMesh(g, m, pts.length)
                cluster.instanceMatrix.needsUpdate = true
            
                var dummy = new THREE.Object3D();
                for (let i = 0; i < pts.length; i++){
                    dummy.position.set(pts[i].x, pts[i].y, pts[i].z);
                    dummy.updateMatrix()
                    cluster.setMatrixAt(i, dummy.matrix)
                }
            
                this.scene_particle.add(cluster)
            } );

            // {...}_L models are used to draw shinging particles(large)
            loader.load( 'files/avatar/pose/SK_Cartoon_Female_021/SK_Cartoon_Female_021_L.fbx',  ( group ) => {

                const box3 = new THREE.Box3().setFromObject(group);
                const size = new THREE.Vector3();
                box3.getSize(size);
                const param = 15 / Math.max(size.x, size.y, size.z);
                group.scale.set(param, param, param);
                
                let v3 = new THREE.Vector3();
                group.traverse(child => {
                    if (child instanceof Mesh){
                        let pos = child.geometry.attributes.position;
                        console.log(pos.count)
                        for (let i = 1; i < pos.count; i+=10){
                            v3.fromBufferAttribute(pos, i)
                            v3.x = v3.x *param
                            v3.y = v3.y *param
                            v3.z = v3.z *param
                            pts_l.push(v3.clone());
                        }
                    }
                });
                
                m_l.emissive = m_l_color
                m_l.emissiveIntensity = 0.3
                m_l.color = m_l_color
            
                cluster_l = new THREE.InstancedMesh(g_l, m_l, pts_l.length)
                cluster_l.instanceMatrix.needsUpdate = true
            
                var dummy = new THREE.Object3D();
                for (let i = 0; i < pts_l.length; i++){
                    dummy.position.set(pts_l[i].x, pts_l[i].y, pts_l[i].z);
                    dummy.updateMatrix()
                    cluster_l.setMatrixAt(i, dummy.matrix)
                }
                
                this.scene_particle.add(cluster_l)
            } );

            // effectComposer = new EffectComposer(this.renderer)
            // effectComposer.setSize(this.container.clientWidth , this.container.clientHeight)
            // effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            // const renderPass = new RenderPass(this.scene, this.camera)
            // effectComposer.addPass(renderPass)
            
            // const unrealBloomPass = new UnrealBloomPass(
            //     new Vector2(500, 500),
            //     5,
            //     1,
            //     0.5,
            // )
            // unrealBloomPass.renderToScreen = true;
            // effectComposer.addPass(unrealBloomPass)
            // console.log(effectComposer)
            // effectComposer.render()


            // const gui = new GUI();
            // gui.add(unrealBloomPass, 'enabled')
            // gui.add(unrealBloomPass, 'strength').min(0).max(5).step(0.001)
            // gui.add(unrealBloomPass, 'radius').min(0).max(100).step(0.001)
            // gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)

            // console.log(unrealBloomPass)

            // const imageUrls = new Array(480).fill(0).map((_, i) => {
            //     return getPublicAssetPath(
            //         `files/avatar/avatar-dokv-particle${
            //             IS_MOBILE ? '-mobile' : ''
            //         }/${padStart(`${i + 1}`, 3, '0')}.jpg`
            //     );
            // });
            // const imageLoader = new THREE.ImageLoader();
            // Promise.all(imageUrls.map((url) => imageLoader.load(url))).then(
            //     (data) => {
            //         this.imageDataArray = data;
            //         imageLoaded = true;
            //         this.loaded = gltfLoaded && imageLoaded;
            //         if (this.loaded) {
            //             this.container.classList.remove('loading');
            //             resolve(true);
            //         }
            //         loadingEE.emit(
            //             `progress.${LoadingSourceType.AVATAR_GLTF_DOKV_PARTICLE}`,
            //             1
            //         );
            //     }
            // );
        }).then(() => {
            setTimeout(() => {
                // 首次渲染，做个延时防止影响首屏的入场
                this.render();
            }, 3000);
        });
        return this.loadingPromise;
    }
    render() {
        super.render();
        
    }
}
