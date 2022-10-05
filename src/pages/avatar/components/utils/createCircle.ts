import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three';

const RADIUS = 1;
const COUNT = 300;

export function createCircle(): Points {
    const points = new Points();

    // build attributes
    const posArr = [] as number[];
    const randomArr = [] as number[];
    for (let i = 0; i < COUNT; i++) {
        const theta = (i / COUNT) * Math.PI * 2;
        // 极坐标转直角坐标
        const x = RADIUS * Math.cos(theta);
        const y = RADIUS * Math.sin(theta);
        posArr.push(x, y, 0);

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

    matr.vertexShader = /* glsl */ `
		// uniform float time;
		attribute float random;

		varying float vRandom;
		varying float vOpacity;

		void main() {
			vRandom = random;

			// vec4 modelPos = modelMatrix * vec4( position, 1.0 );
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			vec4 mvCenter = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
			gl_Position = projectionMatrix * mvPosition;
			gl_PointSize = 10.0  / -mvPosition.z;

			vOpacity = vRandom;

			float factor = smoothstep(1.4, -0.3, mvCenter.z - mvPosition.z);
			vOpacity *= factor;

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
		}
	`;

    points.material = matr;
    points.geometry = geom;

    return points;
}
