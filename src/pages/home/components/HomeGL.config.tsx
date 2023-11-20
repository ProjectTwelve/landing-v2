import * as THREE from 'three';
import { IS_MOBILE } from '../../../utils';

export const HOME_GL_ACTIVE_DATA = [
    {
        // 火龙
        position: new THREE.Vector3(0.7, 0.54, -1.16),
        groupRot: new THREE.Vector3(1.67, -0.52, 1.94),
        groupPos: new THREE.Vector3(0, IS_MOBILE ? -0.8 : -1.5, 0),
        groupSca: new THREE.Vector3(1.3, 1.3, 1.3),
        info: {
            title: 'UGC Ecosystem',
            desc: (
                <>
                    Effortlessly create games using the P12
                    <br />
                    Editor. Inspired, diverse, and voluntary game
                    <br />
                    creations contributed by the P12
                    <br />
                    Community
                </>
            ),
        },
    },
    {
        // 猫
        position: new THREE.Vector3(-0.59, -1.44, -0.58),
        groupRot: new THREE.Vector3(2.69, 1.02, 1.03),
        groupPos: new THREE.Vector3(0, IS_MOBILE ? -1 : -1.39, 0),
        groupSca: new THREE.Vector3(1.3, 1.3, 1.3),
        info: {
            title: (
                <>
                    Empowering <br /> Onchain Games
                </>
            ),
            desc: (
                <>
                    P12 will empower the emergence of <br /> thousands of onchain games, paving the way
                    <br /> for a breakout in onchain gaming landscape
                </>
            ),
        },
    },
    {
        // 车
        position: new THREE.Vector3(0.92, -0.74, 0.86),
        groupRot: new THREE.Vector3(-1.9, 0.71, -1.4),
        groupPos: new THREE.Vector3(0, IS_MOBILE ? -1 : -1.28, 0),
        groupSca: new THREE.Vector3(1.3, 1.3, 1.3),
        info: {
            title: 'P12 GPark Editor',
            desc: (
                <>
                    The first and only onchain engine that
                    <br />
                    pioneers the transition from a Command
                    <br />
                    Line Interface (CLI) to a user-friendly
                    <br />
                    Graphical User Interface (GUI).
                </>
            ),
        },
    },
    {
        // 工厂
        position: new THREE.Vector3(0.03, 1.14, 0.43),
        groupRot: new THREE.Vector3(-1.13, -1.06, -1.05),
        groupPos: new THREE.Vector3(0, IS_MOBILE ? -1 : -1.45, 0),
        groupSca: new THREE.Vector3(1.52, 1.52, 1.52),
        // 文案 todo 补充
        info: {
            title: 'Expanding The Player Base',
            desc: (
                <>
                    P12 pioneers the successful approach to
                    <br />
                    onboard Web2 gamers to Web3 by linking
                    <br />
                    onchain Soulbound NFTs with STEAM
                    <br />
                    credentials
                </>
            ),
        },
    },
];
