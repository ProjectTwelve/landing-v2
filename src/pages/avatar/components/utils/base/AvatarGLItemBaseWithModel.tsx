import { includes } from 'lodash-es';
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
    public loadingStatus: boolean[] = [false, false, false, false];
    // 点的密度
    public HDensity:number = 40;
    public LDensity:number = 40;
    public TDensity:number = 40;
    public scale: number = 0.035;
    public gltfScale: number = 3;
    public position = {
        x: 0,
        y: 0,
        z: 0,
    }



    constructor(props) {
        super();
        const { extraNode, GLTFURL, HFBXURL, LFBXURL, name, HDensity, LDensity, TDensity, scale, position, gltfScale } = props;
        this.extraNode = extraNode;
        this.GLTFURL = GLTFURL;
        this.HFBXURL = HFBXURL;
        this.LFBXURL = LFBXURL;
        this.name = name;
        this.HDensity = HDensity;
        this.LDensity = LDensity;
        this.TDensity = TDensity;
        this.scale = scale;
        this.position = position;
        this.gltfScale = gltfScale;
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
        group.scale.set(this.scale, this.scale, this.scale);
        group.position.set(this.position.x, this.position.y, this.position.z);
        let v3 = new THREE.Vector3();
        this.HFBXModel = group;
        group.traverse(child => {
            if (child instanceof THREE.Mesh) {
                let pos = child.geometry.attributes.position;
                child.material = new THREE.MeshBasicMaterial({ color: "#000000", opacity: 0, transparent: true });
                // child.material.visible = false;
                for (let i = 1; i < pos.count; i += this.HDensity) {
                    v3.fromBufferAttribute(pos, i);

                    v3.x = v3.x * this.scale + this.position.x;
                    v3.y = v3.y * this.scale + this.position.y;
                    v3.z = v3.z * this.scale + this.position.z;
                    this.pts.push(v3.clone());
                }
            }
        });
        // this.particlesGroup.visible = false;
        this.particlesGroup.add(group);
        this.m.emissive = this.m_color;
        this.m.emissiveIntensity = 0.3;
        this.m.color = this.m_color;

        this.m.transparent = true;
        this.m.opacity = 0;

        this.cluster = new THREE.InstancedMesh(this.g, this.m, this.pts.length)
        this.cluster.instanceMatrix.needsUpdate = true

        
        for (let i = 0; i < this.pts.length; i++) {
            var dummy = new THREE.Object3D();
            dummy.position.set(this.pts[i].x, this.pts[i].y, this.pts[i].z);
            dummy.updateMatrix()
            this.cluster.setMatrixAt(i, dummy.matrix)
        }
        this.particlesGroup.add(this.cluster);
        this.particlesGroup.visible = false;
        this.scene.add(this.particlesGroup);
    }

    dealWithLParticles(group: THREE.Group) {
        const box3 = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        box3.getSize(size);
        group.scale.set(this.scale, this.scale, this.scale);
        group.position.set(this.position.x, this.position.y, this.position.z);
        this.center = new THREE.Vector3();
        box3.getCenter(this.center);

        let v3 = new THREE.Vector3();
        group.traverse(child => {
            if (child instanceof THREE.Mesh) {
                let pos = child.geometry.attributes.position;
                for (let i = 1; i < pos.count; i += this.LDensity) {
                    v3.fromBufferAttribute(pos, i)
                    v3.x = v3.x * this.scale + this.position.x;
                    v3.y = v3.y * this.scale + this.position.y;
                    v3.z = v3.z * this.scale + this.position.z;
                    this.pts_l.push(v3.clone());
                }
            }
        });

        this.m_l.emissive = this.m_l_color;
        this.m_l.emissiveIntensity = 0.3;
        this.m_l.color = this.m_l_color;
        this.m.transparent = true;
        this.m.opacity = 0;

        this.cluster_l = new THREE.InstancedMesh(this.g_l, this.m_l, this.pts_l.length)
        this.cluster_l.instanceMatrix.needsUpdate = true

        for (let i = 0; i < this.pts_l.length; i++) {
            var dummy = new THREE.Object3D();
            dummy.position.set(this.pts_l[i].x, this.pts_l[i].y, this.pts_l[i].z);
            dummy.updateMatrix()
            this.cluster_l.setMatrixAt(i, dummy.matrix)
        }
        this.particlesGroup.add(this.cluster_l);
        this.particlesGroup.visible = false;
        this.scene.add(this.particlesGroup)
    }

    dealWithTriangle(group: THREE.Group) {
        const box3 = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        box3.getSize(size);
        group.scale.set(this.scale, this.scale, this.scale);
        group.position.set(this.position.x, this.position.y, this.position.z);
        const d = 0.1;
        const d2 = d / 2;
        let v3 = new THREE.Vector3();
        this.HFBX_TModel = group;
        group.traverse(child => {
            if (child instanceof THREE.Mesh) {
                let pos = child.geometry.attributes.position;
                child.material = new THREE.MeshBasicMaterial({ color: "#000000", opacity: 0, transparent: true })
                for (let i = 1; i < pos.count; i += this.TDensity) {
                    v3.fromBufferAttribute(pos, i);

                    v3.x = v3.x * this.scale + this.position.x;
                    v3.y = v3.y * this.scale + this.position.y;
                    v3.z = v3.z * this.scale + this.position.z;
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
            const vx = (x / 3) + 0.2;
            const vy = (y / 3) + 0.17;
            const vz = (z / 3) + 0.95;

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
            transparent: true,
            opacity: 0,
        });

        const mesh = new THREE.Mesh(this.triangleGeometry, material);
        this.triangleMesh = mesh;

        this.trianglesGroup.add(mesh);
        this.trianglesGroup.visible = false;
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
                    this.gltfModel = model;
                    model.traverse(child => {
                        if (child instanceof THREE.Mesh) {
                            const material = child.material;
                            material.transparent = true; // enable to modify opacity correctly
                            material.opacity = 1;
                        }
                    });
                    model.position.set(this.position.x, this.position.y, this.position.z);
                    model.scale.set(this.gltfScale, this.gltfScale, this.gltfScale);
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

            loader.load(getPublicAssetPath(this.HFBXURL), function (group) {
                _this.dealWithTriangle(group);
                _this.loadingStatus[3] = true;
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
