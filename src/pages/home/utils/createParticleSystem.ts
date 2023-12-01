import * as THREE from 'three';

export function createParticleSystem({
    radius,
    particleCount,
    particleSize,
    color = 0xffffff,
    map = createCircleTexture(),
}: {
    radius: number;
    particleCount: number;
    particleSize: number;
    color?: THREE.ColorRepresentation;
    map?: THREE.Texture;
}) {
    const geometry = new THREE.BufferGeometry();
    const vertices: any[] = [];
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({
        color,
        size: particleSize,
        map,
        transparent: true,
    });
    return new THREE.Points(geometry, material);
}

// 创建圆形纹理函数
export function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.beginPath();
    context.arc(8, 8, 8, 0, 2 * Math.PI);
    context.fillStyle = '#FFFFFF';
    context.fill();
    return new THREE.CanvasTexture(canvas);
}
