import * as THREE from 'three';
import {Points, PointsMaterial, BufferGeometry, Float32BufferAttribute, Vector3, Mesh, CylinderGeometry, MeshBasicMaterial} from 'three';
import { LinkedList, Node } from './utils/LinkedList';
import { calculateDistance } from './utils/PointLineDistance';

interface OrbitParticle {
    speed: number; // 轨道粒子的速度是一个弧度值，表示每一帧绕圆形旋转的弧度
    currentAngle: number; // 当前弧度数值
    opacity: number; // 粒子透明度;
    opacityDelta: number;
}
interface CollisionPaticle {
    velocity: Vector3;
    opacity: number;
    lifeSpan: number;
    age: number;
    position: Vector3,
    color: [number, number, number, number]
}

interface CirclePlaneBaseVectors {
  base1: Vector3,
  base2: Vector3
}

export class AvatarCycle {
    public loading = false;
    public loaded = false;
    public container = document.createElement('div');
    public rendererWrap = document.createElement('div');
    public renderer = new THREE.WebGLRenderer({ alpha: true });
    public readonly scene = new THREE.Scene();
    protected frameId: number = 0;
    public camera: THREE.PerspectiveCamera;
    protected mixer?: THREE.AnimationMixer;
    public mountContainer?: HTMLDivElement;
    protected clock = new THREE.Clock();
    protected observer?: ResizeObserver;
    private positions: Array<number> = [];
    private colors: Array<number> = [];
    private particles: Array<OrbitParticle> = [];
    private PARTICLE_COUNT = 0;
    private R = 2.3; // 圆环半径
    private geometry: BufferGeometry = new BufferGeometry();
    private points: Points| null = null;
    private origin = new Vector3(0, 0, 0.5);
    private GAP_ANGLE = Math.PI * 45 / 100; // 圆环豁口大小
    private alphas: Array<number> = [];
    private ALPHA_CANDIDATES = [.8, .64, .64, .48, .32 , .48, .32, .16, .16]; // 例子透明度分布，每个粒子的透明度从这个数组中随机抽取
    private POINT_MATERIAL: PointsMaterial = new PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        alphaTest: 0,
        map: this.createCanvasMaterial('#'+new THREE.Color(1, 1, 1).getHexString(), 256),
        sizeAttenuation: true,
    });
    private circlePlaneBaseVectors: CirclePlaneBaseVectors = {
        base1: new Vector3(1, 0, 0),
        base2: new Vector3(0, 1, 0)
    };
    private cube?: Mesh<CylinderGeometry, MeshBasicMaterial>;
    private MouseCollisionRange = 0.1;
    private geometryBufferOfCollisionParticle = new BufferGeometry();
    private collisionPaticles: LinkedList<CollisionPaticle> = new LinkedList<CollisionPaticle>();
    private collisionPointsCloud?: Points<BufferGeometry, PointsMaterial>;
    private MOUSER_PROJECT_PLANE_Z = 7.0;

    initCollisionPaticles() {
        this.collisionPointsCloud = new Points(this.geometryBufferOfCollisionParticle, this.POINT_MATERIAL);
    }

    createCollisionParticles(position: Vector3, direction: Vector3, opacity: number = .64) {
        const normalizedDirection = direction.normalize().applyAxisAngle(new Vector3(1,0 ,0), Math.random() * 2 * Math.PI).applyAxisAngle(new Vector3(0, 1, 0), Math.random() * 2 * Math.PI);
        this.collisionPaticles.add(
            {
                position: new Vector3().copy(position),
                velocity: new Vector3(normalizedDirection.x, normalizedDirection.y, 0).multiplyScalar(.005),
                opacity: opacity * 0.5,
                lifeSpan: 250,
                age: 0, 
                color: [1, 1, 1, 1],
            }
        )
    }

    updateCollisionParticles() {
        const collisionParticlePositions: number[] = [];
        const collisionParticleColors: number[] = [];
        this.collisionPaticles.forEach( (currentNode: Node<CollisionPaticle>, index: Number, deleteCurrentNode) => {
            const { value: cp } = currentNode;
            if(cp) {
                cp.position.add(cp.velocity);
                collisionParticlePositions.push(cp.position.x, cp.position.y, cp.position.z);
                if(cp.color) {
                    collisionParticleColors.push(...cp.color.slice(0,3), cp.opacity * (1 - cp.age / cp.lifeSpan));
                }
                if(cp.age > cp.lifeSpan) {
                    deleteCurrentNode();
                } else {
                    cp.age += 1;
                }
            }
        });

        this.geometryBufferOfCollisionParticle.setAttribute(
            'position',
            new Float32BufferAttribute(collisionParticlePositions, 3),
        );

        this.geometryBufferOfCollisionParticle.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(collisionParticleColors, 4),
        );
    }

    // 绘制圆形材质
    createCanvasMaterial(color: string, size: number) {
        var matCanvas = document.createElement('canvas');
        matCanvas.width = matCanvas.height = size;
        var matContext = matCanvas.getContext('2d');
        // create exture object from canvas.
        var texture = new THREE.Texture(matCanvas);
        // Draw a circle
        var center = size / 2;
        if(matContext) {
            matContext.beginPath();
            matContext.arc(center, center, size / 2, 0, 2 * Math.PI, false);
            matContext.closePath();
            matContext.fillStyle = color;
            matContext.fill();
        }
        // need to set needsUpdate
        texture.needsUpdate = true;
        // return a texture made from the canvas
        return texture;
    }

    constructor(particleCount = 250) {
        this.PARTICLE_COUNT = particleCount;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.camera = new THREE.PerspectiveCamera(40, 1, 1, 100);
        this.camera.position.set(0, 0, 8);

        this.rendererWrap.appendChild(this.renderer.domElement);
        this.rendererWrap.className = 'avatar-gl-renderer-wrap';

        this.container.appendChild(this.rendererWrap);
        this.container.className = 'avatar-gl-container';
        this.calcBaseVector();
    }

    // 获得圆环所在平面的基向量
    calcBaseVector() {
        const rotateX = -Math.PI * 40 / 100, rotateY = Math.PI * 3 / 13, rotateZ = Math.PI * - 4 / 100;
        var base1 = new Vector3(1, 0, 0);
        var base2 = new Vector3(0, 1, 0);
        var xAxis = new Vector3(1, 0, 0);
        var yAxis = new Vector3(0, 1, 0);
        var zAxis = new Vector3(0, 0, 1);
        base1.applyAxisAngle(xAxis, rotateX);
        base2.applyAxisAngle(xAxis, rotateX);
        base1.applyAxisAngle(yAxis, rotateY);
        base2.applyAxisAngle(yAxis, rotateY);
        base1.applyAxisAngle(zAxis, rotateZ);
        base2.applyAxisAngle(zAxis, rotateZ);
        this.circlePlaneBaseVectors = {
            base1: base1.multiplyScalar(this.R),
            base2: base2.multiplyScalar(this.R)
        }
    }
    
    private vec = new THREE.Vector3();
    private mousePos: Vector3 = new THREE.Vector3(); // 鼠标投影到XY平面上的坐标
    onMouseMove(event: MouseEvent) {
        this.vec.set(
            (event.clientX / this.container.clientWidth ) * 2 - 1,
            - ( event.clientY / this.container.clientHeight ) * 2 + 1,
            0.5
        );

        this.vec.unproject( this.camera );

        this.vec.sub( this.camera.position ).normalize();

        var distance = (this.MOUSER_PROJECT_PLANE_Z - this.camera.position.z) / this.vec.z;

        this.mousePos.copy( this.camera.position ).add( this.vec.multiplyScalar( distance ) );

        // this.cube?.position.setX(this.mousePos.x);
        // this.cube?.position.setY(this.mousePos.y);
    }

    getCirclePlaneBaseVectorsCopy() {
        return [
            this.circlePlaneBaseVectors.base1.clone(),
            this.circlePlaneBaseVectors.base2.clone(),
        ];
    }
    
    getPositionByAngle(angle: number): Array<number> {
        const [ base1, base2 ] = this.getCirclePlaneBaseVectorsCopy();
        base1.multiplyScalar(Math.cos(angle));
        base2.multiplyScalar(Math.sin(angle));
        base1.add(base2).add(this.origin);
        return [base1.x, base1.y, base1.z];
    }

    getAlphaByAngle(angle: number, cap = 1): number {
        let alpha = 1;
        const coff =  Math.min(angle - this.GAP_ANGLE, 2* Math.PI - angle)
        const fraction = Math.PI / 4;
        alpha = coff / fraction;
        return alpha * cap;
    }

    getColorByAngle(angle: number, alphaCap: number = .8): Array<number> {
        return [
            1,
            1,
            1,
            (this.getAlphaByAngle(angle, alphaCap))
        ]
    }

    updatePosition() {
        this.geometry.setAttribute(
            'position',
            new Float32BufferAttribute(this.positions, 3),
        );
    }

    updateAlpha() {
        this.geometry.setAttribute(
            'alpha',
            new Float32BufferAttribute(this.alphas, 1),
        );
    }

    updateColor() {
        this.geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(this.colors, 4)
        )
    }

    initParticles () {
        const steeper = 2 * Math.PI / this.PARTICLE_COUNT;
        for(let angle = 0;angle < 2 * Math.PI; angle+=steeper) {
            if(angle > 0 && angle < this.GAP_ANGLE) continue;
            this.positions.push(...this.getPositionByAngle(angle));
            const opacity = this.ALPHA_CANDIDATES[Math.round(Math.random() * (this.ALPHA_CANDIDATES.length-1 ))];
            this.colors.push(...this.getColorByAngle(angle, opacity));
            this.particles.push({
                speed: Math.PI / 3200,
                currentAngle: angle,
                opacity,
                opacityDelta: 0,
            });
        }
        this.updatePosition();
        this.updateColor();
        this.updateAlpha();
        this.points = new Points(this.geometry, this.POINT_MATERIAL);
        var g = new CylinderGeometry( .2, .2, 10, 50 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( g, material );
    }

    updateParticles() {
        this.particles.forEach((particle: OrbitParticle, index: number) => {
            const positionIndex = index * 3;
            const colorIndex = index * 4;
            const currenPosition = new Vector3(this.positions[positionIndex], this.positions[positionIndex+1], this.positions[index+2]);
            const currentMousPos = new Vector3(this.mousePos.x, this.mousePos.y, this.mousePos.z);
            
            // console.log(currenPosition, currentMousPos, currenPosition.distanceTo(currenPosition));
            // if(
            //     /**
            //      * 目前的碰撞检测原理: 相机位置与鼠标投影位置确定一条直线
            //      * TODO： 碰撞检测的优化思路，从环上采样，将采样点按照与【鼠标(窗口坐标系)投影到世界坐标系】相反的方式投影回窗口坐标系，这样就能够根据指针的窗口坐标系位置得到其最合适的投影平面的Z坐标 
            //      * */ 
            //     calculateDistance(currenPosition, this.camera.position, currentMousPos) <= this.MouseCollisionRange
            // ) {
            //     this.createCollisionParticles(currenPosition, new Vector3().copy(currenPosition).sub(currentMousPos), this.getAlphaByAngle(particle.currentAngle, particle.opacity + particle.opacityDelta));
            //     // particle.opacityDelta -= 0.01;
            // }
            //
            // looks like a rerendering issue 
            if (index % 3 === 0 && calculateDistance(currenPosition, this.camera.position, currentMousPos) <= this.MouseCollisionRange) {
                this.createCollisionParticles(currenPosition, new Vector3().copy(currenPosition).sub(currentMousPos), this.getAlphaByAngle(particle.currentAngle, particle.opacity + particle.opacityDelta));
            }

            particle.currentAngle += particle.speed;
            if(particle.currentAngle > Math.PI * 2) {
                particle.currentAngle = particle.currentAngle - Math.PI * 2;
            }
            let newPosition: Array<number> = [];
            if(particle.currentAngle > 0 && particle.currentAngle < this.GAP_ANGLE) {
                particle.currentAngle = this.GAP_ANGLE; // 复位
                particle.opacityDelta = 0;
            }
            newPosition = this.getPositionByAngle(particle.currentAngle);
            const newAlpha = this.getAlphaByAngle(particle.currentAngle, particle.opacity + particle.opacityDelta);
            this.positions[positionIndex] = newPosition[0]
            this.positions[positionIndex+1] = newPosition[1];
            this.positions[positionIndex+2] = newPosition[2];
            this.colors[colorIndex + 3] = newAlpha
        });
        this.updatePosition();
        this.updateColor();
    }

    load() {
        if (this.loaded || this.loading) {
            return;
        }
        this.loading = true;
        this.initParticles();
        this.initCollisionPaticles();
        if(this.points) {
            this.scene.add(this.points);
        }
        // if(this.cube) { // debug 垂直投影方式所用的柱体
        //     this.scene.add(this.cube);
        //     this.cube.rotateX(Math.PI / 2);
        // }
        if(this.collisionPointsCloud) {
            this.scene.add(this.collisionPointsCloud);
        }
        this.loaded= true;
        this.loading = false;
        this.animate();
    }

    protected resize() {
        this.camera.aspect =
            this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
            this.container.clientWidth,
            this.container.clientHeight
        );
        this.renderer.domElement.style.width = `${this.container.clientWidth}px`;
        this.renderer.domElement.style.height = `${this.container.clientHeight}px`;
    }

    protected animate() {
        this.frameId = requestAnimationFrame(() => this.animate());
        this.render();
    }

    protected render() {
        if (!this.loaded) {
            return;
        }
        const delta = this.clock.getDelta();
        this.updateParticles();
        this.updateCollisionParticles();
        this.mixer?.update(delta);
        this.renderer.render(this.scene, this.camera);
    }

    unMount() {
        this.container.style.zIndex = '1';
        cancelAnimationFrame(this.frameId);
        this.observer?.disconnect();
        this.mountContainer?.removeChild(this.container);
    }

    mount(mountContainer: HTMLDivElement) {
        this.mountContainer = mountContainer;
        this.resize();
        this.observer = new ResizeObserver(() => {
            this.resize();
        });
        this.observer.observe(this.container);
        this.mountContainer.appendChild(this.container);
        this.container.style.zIndex = '4';
        this.container.style.pointerEvents = 'none';
        // this.container.addEventListener('pointermove', this.onMouseMove.bind(this));
    }
}
