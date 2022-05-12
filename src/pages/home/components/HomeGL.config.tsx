import * as THREE from 'three';

export const HOME_GL_ACTIVE_DATA = [
    {
        // 火龙
        position: new THREE.Vector3(0.7, 0.54, -1.16),
        groupRot: new THREE.Vector3(1.67, -0.52, 1.94),
        groupPos: new THREE.Vector3(0, -1.17, 0),
        groupSca: new THREE.Vector3(1.3, 1.3, 1.3),
        info: {
            title: 'The Editor',
            desc: (
                <>
                    A full-featured Metaverse content engine
                    <br />
                    for building game worlds; best in its kind
                </>
            ),
        },
    },
    {
        // 猫
        position: new THREE.Vector3(-0.59, -1.44, -0.58),
        groupRot: new THREE.Vector3(2.69, 1.02, 1.03),
        groupPos: new THREE.Vector3(0, -1.39, 0),
        groupSca: new THREE.Vector3(1.3, 1.3, 1.3),
        info: {
            title: 'Empowering Metaworlds',
            desc: (
                <>
                    A Metaverse platform where
                    <br />
                    Web2 and Web3 users co-exist in harmony
                    <br />
                    <br />
                    An open ecosystem with sustainable economy
                </>
            ),
        },
    },
    {
        // 车
        position: new THREE.Vector3(0.92, -0.74, 0.86),
        groupRot: new THREE.Vector3(-1.9, 0.71, -1.4),
        groupPos: new THREE.Vector3(0, -1.28, 0),
        groupSca: new THREE.Vector3(1.3, 1.3, 1.3),
        info: {
            title: 'The Infra',
            desc: (
                <>
                    A set of API / SDK and developer portals
                    <br />
                    for bridging game content on-chain;
                    <br />
                    tokenomics and NFT made easy
                </>
            ),
        },
    },
    {
        // 工厂
        position: new THREE.Vector3(0.03, 1.14, 0.43),
        groupRot: new THREE.Vector3(-1.13, -1.06, -1.05),
        groupPos: new THREE.Vector3(0, -1.45, 0),
        groupSca: new THREE.Vector3(1.52, 1.52, 1.52),
        // 文案 todo 补充
        info: {
            title: 'The Econs',
            desc: (
                <>
                    A set of economic and governmental rules
                    <br />
                    and mechanisms implemented in smart
                    <br />
                    contracts; for prosperity and sustainability
                </>
            ),
        },
    },
];
