import {
    Group,
    Mesh,
    BufferAttribute,
    BufferGeometry,
    ShaderMaterial,
    Object3D,
    Vector3,
    DoubleSide,
    MeshBasicMaterial,
    Material,
} from 'three';

import seedRandom from 'seed-random';

export function createTrianglesFromModel(model: Group): Group {
    console.time('createTrianglesFromModel');
    // const ran = seedRandom(1);
    const ran = Math.random;

    const clone = model.clone(true);
    clone.traverse((o) => {
        if (isMesh(o)) {
            const oldMatr = o.material as Material;
            if (oldMatr.name === 'NewMaterial') {
                // o.removeFromParent();
                o.visible = false;
                return;
            }

            const newPos = [] as number[];
            const newColor = [] as number[];
            forEachTriangles(o.geometry, (p0, p1, p2, n, i) => {
                const areaX2 = p1.clone().sub(p0).multiply(p2.clone().sub(p0)).length();
                const stonerCnt = Math.ceil(areaX2 / 0.0001);

                // const normal = p1.clone().sub(p0).cross(p2.clone().sub(p0)).normalize().multiplyScalar(0.001);
                const normal = n.clone().normalize().multiplyScalar(0.001);

                for (let i = 0; i < stonerCnt; i++) {
                    // drop rate
                    if (ran() > 0.1) continue;

                    // generate a random point in a triangle

                    let rA = ran();
                    let rB = ran();

                    if (rA + rB > 1) {
                        rA = 1 - rA;
                        rB = 1 - rB;
                    }
                    const a = 1 - rA - rB;
                    const newPoint = p0
                        .clone()
                        .multiplyScalar(a)
                        .add(p1.clone().multiplyScalar(rA))
                        .add(p2.clone().multiplyScalar(rB))
                        .add(normal);

                    const newP0 = newPoint
                        .clone()
                        .add(new Vector3(ran(), ran(), ran()).subScalar(0.5).normalize().multiplyScalar(0.01));
                    const newP1 = newPoint
                        .clone()
                        .add(new Vector3(ran(), ran(), ran()).subScalar(0.5).normalize().multiplyScalar(0.01));
                    const newP2 = newPoint
                        .clone()
                        .add(new Vector3(ran(), ran(), ran()).subScalar(0.5).normalize().multiplyScalar(0.01));

                    newPos.push(...newP0.toArray(), ...newP1.toArray(), ...newP2.toArray());

                    // colors
                    const color = newPoint
                        .clone()
                        .multiplyScalar(0.3)
                        .add(new Vector3(0.2, 0.17, 0.95))
                        .multiplyScalar(2)
                        .normalize();

                    newColor.push(...color.toArray(), ...color.toArray(), ...color.toArray());
                }
            });

            const newPosAttr = new BufferAttribute(new Float32Array(newPos), 3, false);
            const newColAttr = new BufferAttribute(new Float32Array(newColor), 3, false);

            const newGeom = new BufferGeometry();
            newGeom.attributes.position = newPosAttr;
            newGeom.attributes.color = newColAttr;

            o.geometry = newGeom;

            o.material = new MeshBasicMaterial({
                color: '#ffffff',
                opacity: 0,
                // specular: 0xffffff,
                // shininess: 250,
                side: DoubleSide,
                vertexColors: true,
                transparent: true,
            });
        }
    });

    console.timeEnd('createTrianglesFromModel');
    return clone;
}

export function createPointsFromModel(model: Group): Group {
    console.time('createPointsFromModel');
    // const ran = seedRandom(1);
    const ran = Math.random;

    const clone = model.clone(true);
    clone.traverseVisible((o) => {
        if (isMesh(o)) {
            (o as any)['isMesh'] = false;
            (o as any)['isPoints'] = true;

            const oldMatr = o.material as Material;
            if (oldMatr.name === 'NewMaterial') {
                o.visible = false;
                return;
            }
            if (!oldMatr.visible) {
                o.visible = false;
                return;
            }

            const newPos = [] as number[];
            forEachTriangles(o.geometry, (p0, p1, p2, n, i) => {
                const areaX2 = p1.clone().sub(p0).multiply(p2.clone().sub(p0)).length();
                const stonerCnt = Math.ceil(areaX2 / 0.0001);

                // const normal = p1.clone().sub(p0).cross(p2.clone().sub(p0)).normalize().multiplyScalar(0.005);
                const normal = n.clone().normalize().multiplyScalar(0.01);

                for (let i = 0; i < stonerCnt; i++) {
                    // drop rate
                    if (ran() > 0.13) continue;

                    // generate a random point in a triangle

                    let rA = ran();
                    let rB = ran();

                    if (rA + rB > 1) {
                        rA = 1 - rA;
                        rB = 1 - rB;
                    }
                    const a = 1 - rA - rB;
                    const newPoint = p0
                        .clone()
                        .multiplyScalar(a)
                        .add(p1.clone().multiplyScalar(rA))
                        .add(p2.clone().multiplyScalar(rB))
                        .add(normal);

                    newPos.push(...newPoint.toArray());
                }
            });

            const newAttr = new BufferAttribute(new Float32Array(newPos), 3, false);

            const newGeom = new BufferGeometry();
            newGeom.attributes.position = newAttr;

            o.geometry = newGeom;

            o.material = new PointMatr();
        }
    });

    console.timeEnd('createPointsFromModel');
    return clone;
}

export function isMesh(o: Object3D): o is Mesh {
    return !!(o as any).isMesh;
}

function forEachTriangles(
    g: BufferGeometry,
    f: (p0: Vector3, p1: Vector3, p2: Vector3, normal: Vector3, idx: number) => void,
): void {
    const index = g.index?.array;
    const position = g.attributes.position?.array;
    const normal = g.attributes.normal?.array;
    if (!index) throw new Error('require index');
    if (!position) throw new Error('require position');
    if (!normal) throw new Error('require normal');

    for (let i = 0; i < index.length / 3; i++) {
        const idx0 = index[i * 3 + 0];
        const idx1 = index[i * 3 + 1];
        const idx2 = index[i * 3 + 2];

        const p0 = new Vector3(position[idx0 * 3 + 0], position[idx0 * 3 + 1], position[idx0 * 3 + 2]);
        const p1 = new Vector3(position[idx1 * 3 + 0], position[idx1 * 3 + 1], position[idx1 * 3 + 2]);
        const p2 = new Vector3(position[idx2 * 3 + 0], position[idx2 * 3 + 1], position[idx2 * 3 + 2]);

        const n = new Vector3(normal[idx0 * 3 + 0], normal[idx0 * 3 + 1], normal[idx0 * 3 + 2]);

        f(p0, p1, p2, n, i);
    }
}

export class PointMatr extends ShaderMaterial {
    constructor() {
        super();

        setInterval(() => {
            this.uniforms.size.value =
                ((Math.min(window.innerWidth, window.innerHeight) * window.devicePixelRatio) / 2048) * 1.2;
        }, 1000);
    }

    uniforms = { opacity: { value: 0 }, size: { value: 1 } };
    transparent = true;

    depthWrite = false;

    vertexShader = /* glsl */ `
        uniform float size;

        float rand(vec2 co){
            return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
            float r = rand(position.xy + position.z);
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_Position = projectionMatrix * mvPosition;
            // gl_PointSize = (r * 9.0 + 5.0)  / -mvPosition.z;
            gl_PointSize = (r * r * 5.0 + 1.0) * 0.5 * size * ${window.devicePixelRatio.toFixed(1)};
        }
    `;
    fragmentShader = /* glsl */ `

        float manhattanDistance(vec2 p1, vec2 p2) {
            float d1 = abs(p1.x - p2.x);
            float d2 = abs(p1.y - p2.y);
            return d1 + d2;
        }

        uniform float opacity;
        void main() {

            gl_FragColor = vec4(1.0, 1.0, 1.0, opacity);
            
            // 圆形
            // gl_FragColor.a *= smoothstep(0.4, 0.2, length(gl_PointCoord - 0.5));

            // 菱形
            // gl_FragColor.a *= smoothstep(0.4, 0.2, manhattanDistance(gl_PointCoord, vec2(0.5)));

            // 方形
            vec2 cP = gl_PointCoord - 0.5;
            gl_FragColor.a *= smoothstep(0.4, 0.2, max(cP.x, cP.y));
        }
    `;
}
