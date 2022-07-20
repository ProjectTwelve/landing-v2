import { includes, cloneDeep } from 'lodash-es';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getPublicAssetPath, IS_MOBILE } from '../../../../../utils';
import { loadingEE } from '../../../../app/App.utils';
import { AvatarGLItemBaseWithParticle } from '../base/AvatarGLItemBaseWithParticle';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'


export class AvatarGLModel extends AvatarGLItemBaseWithParticle {
    public particleCanvasWidth = IS_MOBILE ? 178 : 600;
    public particleCanvasHeight = IS_MOBILE ? 320 : 1080;

    public extraNode = (<> </>);

    public GLTFURL: string = '';
    public HFBXURL: string = '';
    public LFBXURL: string = '';
    public name: string = '';
    public loadingStatus: boolean[] = [false, false, false]

    constructor(props) {
        super();
        const { extraNode, GLTFURL, HFBXURL, LFBXURL, name } = props;
        this.extraNode = extraNode;
        this.GLTFURL = GLTFURL;
        this.HFBXURL = HFBXURL;
        this.LFBXURL = LFBXURL;
        this.name = name;
    }

    getParticleIndex() {
        return Math.floor(
            (((this.controls.getAzimuthalAngle() / Math.PI + 1) / 2) *
                this.imageDataArray.length +
                this.imageDataArray.length +
                204) %
            this.imageDataArray.length
        );
    }

    dealWithHParticles(group: THREE.Group) {
        const box3 = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        box3.getSize(size);

        const param = 0.035;
        group.scale.set(param, param, param);
        group.position.set(0.06, -3.09, -0.2);
        let v3 = new THREE.Vector3();
        group.traverse(child => {
            if (child instanceof THREE.Mesh) {
                let pos = child.geometry.attributes.position;
                console.log(pos, 'pos.count');

                child.material = new THREE.MeshBasicMaterial({ color: "black" })
                for (let i = 1; i < pos.count; i += 20) {
                    v3.fromBufferAttribute(pos, i)
                    v3.x = v3.x * param + 0.06;
                    v3.y = v3.y * param - 3.09;
                    v3.z = v3.z * param - 0.2;
                    this.pts.push(v3.clone());
                }
            }
        });
        this.particlesGroup.visible = false;
        this.particlesGroup.add(group);
        this.m.emissive = this.m_color
        this.m.emissiveIntensity = 0.3
        this.m.color = this.m_color

        this.cluster = new THREE.InstancedMesh(this.g, this.m, this.pts.length)
        this.cluster.instanceMatrix.needsUpdate = true

        var dummy = new THREE.Object3D();
        for (let i = 0; i < this.pts.length; i++) {
            dummy.position.set(this.pts[i].x, this.pts[i].y, this.pts[i].z);
            dummy.updateMatrix()
            this.cluster.setMatrixAt(i, dummy.matrix)
        }
        this.particlesGroup.add(this.cluster);
        this.scene.add(this.particlesGroup);
    }

    dealWithLParticles(group: THREE.Group) {
        const box3 = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        box3.getSize(size);
        const param = 0.035;
        group.scale.set(param, param, param);
        group.position.set(0.06, -3.09, -0.2);
        this.center = new THREE.Vector3();
        box3.getCenter(this.center);

        let v3 = new THREE.Vector3();
        group.traverse(child => {
            if (child instanceof THREE.Mesh) {
                let pos = child.geometry.attributes.position;
                console.log(pos.count)
                for (let i = 1; i < pos.count; i += 10) {
                    v3.fromBufferAttribute(pos, i)
                    v3.x = v3.x * param + 0.06;
                    v3.y = v3.y * param - 3.09;
                    v3.z = v3.z * param - 0.2;
                    this.pts_l.push(v3.clone());
                }
            }
        });

        this.m_l.emissive = this.m_l_color
        this.m_l.emissiveIntensity = 0.3
        this.m_l.color = this.m_l_color

        this.cluster_l = new THREE.InstancedMesh(this.g_l, this.m_l, this.pts_l.length)
        this.cluster_l.instanceMatrix.needsUpdate = true

        var dummy = new THREE.Object3D();
        for (let i = 0; i < this.pts_l.length; i++) {
            dummy.position.set(this.pts_l[i].x, this.pts_l[i].y, this.pts_l[i].z);
            dummy.updateMatrix()
            this.cluster_l.setMatrixAt(i, dummy.matrix)
        }
        this.particlesGroup.visible = false;
        this.particlesGroup.add(this.cluster_l);
        this.scene.add(this.particlesGroup)
    }

    dealWithTriangle(g: THREE.Group) {
        const group = cloneDeep(g);
        const box3 = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        box3.getSize(size);
        const param = 60 / Math.max(size.x, size.y, size.z);
        group.scale.set(param, param, param);
        const d = 1.5;
        const d2 = d / 2;
        let v3 = new THREE.Vector3();
        group.traverse(child => {
            if (child instanceof THREE.Mesh) {
                let pos = child.geometry.attributes.position;
                child.material = new THREE.MeshBasicMaterial({ color: "black" })
                for (let i = 1; i < pos.count; i += 40) {
                    v3.fromBufferAttribute(pos, i)
                    v3.x = v3.x * param
                    v3.y = v3.y * param
                    v3.z = v3.z * param
                    this.trianglePts.push(v3.clone());
                }
            }
        });
        this.trianglesGroup.visible = false;
        this.trianglesGroup.add(group);

        for (let i = 0; i < this.trianglePts.length; i++) {
            // positions

            const x = this.trianglePts[i].x;
            const y = this.trianglePts[i].y;
            const z = this.trianglePts[i].z;

            const ax = x + Math.random() * d - d2;
            const ay = y + Math.random() * d - d2;
            const az = z + Math.random() * d - d2;

            const bx = x + Math.random() * d - d2;
            const by = y + Math.random() * d - d2;
            const bz = z + Math.random() * d - d2;

            const cx = x + Math.random() * d - d2;
            const cy = y + Math.random() * d - d2;
            const cz = z + Math.random() * d - d2;

            this.trianglePositions.push(ax, ay, az);
            this.trianglePositions.push(bx, by, bz);
            this.trianglePositions.push(cx, cy, cz);

            // flat face normals

            this.pA.set(ax, ay, az);
            this.pB.set(bx, by, bz);
            this.pC.set(cx, cy, cz);

            this.cb.subVectors(this.pC, this.pB);
            this.ab.subVectors(this.pA, this.pB);
            this.cb.cross(this.ab);

            this.cb.normalize();

            const nx = this.cb.x;
            const ny = this.cb.y;
            const nz = this.cb.z;

            this.triangleNormals.push(nx, ny, nz);
            this.triangleNormals.push(nx, ny, nz);
            this.triangleNormals.push(nx, ny, nz);

            // colors
            const vx = (x / 50) + 0.2;
            const vy = (y / 50) + 0.17;
            const vz = (z / 50) + 0.95;

            // const vx = 0.6;
            // const vy = 0.87;
            // const vz = 1;

            this.triangleColor.setRGB(vx, vy, vz);

            const alpha = Math.random();

            this.triangleColors.push(this.triangleColor.r, this.triangleColor.g, this.triangleColor.b, alpha);
            this.triangleColors.push(this.triangleColor.r, this.triangleColor.g, this.triangleColor.b, alpha);
            this.triangleColors.push(this.triangleColor.r, this.triangleColor.g, this.triangleColor.b, alpha);

        }

        // Add triangles to the scene
        function disposeArray() {
            // this.array = null;
        }

        this.triangleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(this.trianglePositions, 3).onUpload(disposeArray));
        this.triangleGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(this.triangleNormals, 3).onUpload(disposeArray));
        this.triangleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(this.triangleColors, 4).onUpload(disposeArray));

        this.triangleGeometry.computeBoundingSphere();

        const material = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            // specular: 0xffffff,
            // shininess: 250,
            side: THREE.DoubleSide,
            vertexColors: true,
            transparent: true
        });

        const mesh = new THREE.Mesh(this.triangleGeometry, material);
        this.trianglesGroup.add(mesh);
        this.scene.add(this.trianglesGroup);

    }

    load() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = new Promise((resolve, reject) => {
            new GLTFLoader().load(
                getPublicAssetPath(this.GLTFURL),
                (gltf) => {
                    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
                    this.camera.add(this.ambientLight);
                    const directionalLight = new THREE.DirectionalLight(
                        0xedf1b9,
                        1.3
                    );
                    directionalLight.position.set(0.5, 0, 0.866); // ~60º
                    this.camera.add(directionalLight);

                    const model = gltf.scene;
                    model.position.set(0.06, -3.09, -0.2);
                    model.scale.set(3.5, 3.5, 3.5);
                    this.modelGroup.add(model);
                    this.scene.add(this.modelGroup);
                    this.mixer = new THREE.AnimationMixer(model);
                    // this.mixer?.clipAction(gltf.animations?.[0])?.play();
                    this.loadingStatus[0] = true;
                    if (!includes(this.loadingStatus, false)) {
                        this.container.classList.remove('loading');
                        resolve(true);
                    }
                    loadingEE.emit(
                        `progress.${this.name}`,
                        1
                    );
                },
                (event) => {
                    loadingEE.emit(
                        `progress.${this.name}`,
                        Math.min(
                            event.loaded / (event.total || 1024 * 1024 * 25),
                            0.95
                        )
                    );
                }
            );

            const loader = new FBXLoader();
            const _this = this;
            loader.load(getPublicAssetPath(this.HFBXURL), function (group) {
                _this.dealWithHParticles(group);
                _this.dealWithTriangle(group);
                _this.loadingStatus[1] = true;
                if (!includes(_this.loadingStatus, false)) {
                    _this.container.classList.remove('loading');
                    resolve(true);
                }
            });

            loader.load(getPublicAssetPath(this.LFBXURL), function (group) {
                _this.dealWithLParticles(group);
                _this.loadingStatus[2] = true;
                if (!includes(_this.loadingStatus, false)) {
                    _this.container.classList.remove('loading');
                    resolve(true);
                }
            });

        }).then(() => {
            setTimeout(() => {
                // 首次渲染，做个延时防止影响首屏的入场
                this.render();
            }, 3000);
        });
        return this.loadingPromise;
    }
}
