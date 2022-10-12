import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, Vector3 } from 'three';

const RADIUS = 0.4;
const COUNT = 30;

const _vec3 = new Vector3();

export function createCollisionParticles(): Points {
    const points = new Points();

    // build attributes
    const posArr = [] as number[];
    const randomArr = [] as number[];
    for (let i = 0; i < COUNT; i++) {
        _vec3.set(Math.random(), Math.random(), Math.random()).subScalar(0.5).normalize().multiplyScalar(RADIUS);
        posArr.push(..._vec3.toArray());

        const random = Math.random() * 0.8 + 0.2;
        randomArr.push(random);
    }
    const position = new BufferAttribute(new Float32Array(posArr), 3, false);
    const random = new BufferAttribute(new Float32Array(randomArr), 1, false);

    const geom = new BufferGeometry();
    geom.setAttribute('position', position);
    geom.setAttribute('random', random);
    geom.computeBoundingBox();

    const matr = new ShaderMaterial();

    matr.transparent = true;
    matr.depthTest = false;
    matr.depthWrite = false;
    matr.blending = AdditiveBlending;

    matr.uniforms.life = { value: 0 };

    matr.vertexShader = /* glsl */ `
		uniform float life;

		attribute float random;

		varying float vRandom;
		varying float vOpacity;

		void main() {
			vRandom = random;

			// vec4 modelPos = modelMatrix * vec4( position, 1.0 );
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			vec4 mvCenter = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
			gl_Position = projectionMatrix * mvPosition;
			gl_PointSize = 9.0  / -mvPosition.z;

			vOpacity = vRandom;

            vOpacity *= smoothstep(0.0, 0.7, 1.0 - life) * 0.5;

			float factor = smoothstep(1.4, -0.3, mvCenter.z - mvPosition.z);
			vOpacity *= factor;

            vOpacity = clamp(vOpacity, 0.0, 1.0);

			gl_PointSize *= factor;
		}
	`;
    matr.fragmentShader = /* glsl */ `
		// uniform float time;
		varying float vRandom;
		varying float vOpacity;

		void main() {

			gl_FragColor = vec4(1.0);

			// gl_FragColor.rgb = vec3(vRandom);

			gl_FragColor.a = vOpacity;
			gl_FragColor.a *= smoothstep(0.5, 0.4, length(gl_PointCoord - 0.5));

            gl_FragColor.a = clamp(gl_FragColor.a, 0.0, 1.0);

            if (gl_FragColor.a < 0.1) {
                discard;
            }
		}
	`;

    points.material = matr;
    points.geometry = geom;

    points.scale.set(0, 0, 0);

    const lifespan = 2000;
    const birth = performance.now();

    let id;
    const tick = () => {
        const life = (performance.now() - birth) / lifespan;

        if (life < 1) {
            id = requestAnimationFrame(tick);
            // const scale = Math.sqrt(life);
            // const scale = life * life;
            const scale = life;
            matr.uniforms.life.value = life;
            points.scale.set(scale, scale, scale);
        } else {
            points.removeFromParent();
            matr.dispose();
            geom.dispose();
        }
    };
    id = requestAnimationFrame(tick);

    return points;
}
