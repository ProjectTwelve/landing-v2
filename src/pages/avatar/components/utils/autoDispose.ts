import { Mesh, Object3D } from 'three';

export function autoDispose(g: Object3D) {
    g.traverse((o: Object3D) => {
        if (isMesh(o)) {
            const geom = o.geometry;

            if (geom.index) {
                geom.index.onUploadCallback = () => {
                    setTimeout(() => {
                        geom.index!.array = null as any;
                    }, 1000);
                };
            }

            const attrs = Object.values(geom.attributes);
            attrs.forEach((a: any) => {
                if (a.isBufferAttribute) {
                    a.onUploadCallback = () => {
                        setTimeout(() => {
                            a.array = null as any;
                        }, 1000);
                    };
                }
            });
        }
    });
}

function isMesh(o: Object3D): o is Mesh {
    return !!(o as any).isMesh;
}
