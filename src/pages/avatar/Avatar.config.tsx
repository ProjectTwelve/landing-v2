export enum AvatarType {
    Dokv = 'Dokv',
    Cartoon = 'Cartoon',
    Lowpoly = 'Lowpoly',
    SK_Cartoon_Female_021 = 'SK_Cartoon_Female_021',
    SK_Cartoon_Female_029 = 'SK_Cartoon_Female_029',
    SK_Cartoon_Female_059 = 'SK_Cartoon_Female_059',
    SK_Lowpoly_Male_002 = 'SK_Lowpoly_Male_002',
    SK_Lowpoly_Male_028 = 'SK_Lowpoly_Male_028',
    SK_Lowpoly_Male_040 = 'SK_Lowpoly_Male_040',
}

export const AvatarTypeArray = Object.values(AvatarType);


export const AVATAR_GL_INFO_MAP = {
    [AvatarType.Dokv]: {
        name: AvatarType.Dokv,
        GLTFURL: 'files/avatar/pose/Dokv/Dokv.gltf',
        LFBXURL: 'files/avatar/pose/Dokv/SK_Dokev_Boy_001_POSE_L.fbx',
        HFBXURL: 'files/avatar/pose/Dokv/SK_Dokev_Boy_001_POSE_H.fbx',
        extraNode:
            (<>
                <div className='avatar-extra-subtitle'>GameArtefact API</div>
                <div className='avatar-extra-text'>→ For NFT</div>
                <div className='avatar-extra-subtitle'>GameCoin API</div>
                <div className='avatar-extra-text'>→ For tokenomics</div>
            </>),
        HDensity: 40,
        LDensity: 40,
        TDensity: 20,
        scale: 0.0355,
        gltfScale: 3.55,
        position: {
            x: 0.41,
            y: -2.64,
            z: -1.3,
        }
    },
    [AvatarType.Cartoon]: {
        name: AvatarType.Cartoon,
        GLTFURL: 'files/avatar/pose/Cartoon/Cartoon.gltf',
        LFBXURL: 'files/avatar/pose/Cartoon/SK_Cartoon_Female_005_L.fbx',
        HFBXURL: 'files/avatar/pose/Cartoon/SK_Cartoon_Female_005_H.fbx',
        extraNode:
            (<>
                <div className='avatar-extra-subtitle'>Server DevOps</div>
                <div className='avatar-extra-subtitle'>Data Analytics</div>
                <div className='avatar-extra-subtitle'>Community / Social</div>
            </>),
        HDensity: 40,
        LDensity: 40,
        TDensity: 20,
        scale: 0.03,
        gltfScale: 3,
        position: {
            x: 0.06,
            y: -3.09,
            z: -0.2,
        }
    },
    [AvatarType.Lowpoly]: {
        name: AvatarType.Lowpoly,
        GLTFURL: 'files/avatar/pose/Lowpoly/Lowpoly.gltf',
        LFBXURL: 'files/avatar/pose/Lowpoly/SK_Lowpoly_Male_001_L.fbx',
        HFBXURL: 'files/avatar/pose/Lowpoly/SK_Lowpoly_Male_001_H.fbx',
        extraNode:
            (<>
                <div className='avatar-extra-subtitle'>SecretShop</div>
                <div className='avatar-extra-text'>→ The marketplace</div>
                <div className='avatar-extra-subtitle'>GameMaster</div>
                <div className='avatar-extra-text'>→ The governance</div>
            </>),
        HDensity: 20,
        LDensity: 20,
        TDensity: 20,
        scale: 0.033,
        gltfScale: 3.3,
        position: {
            x: -0.1,
            y: -2.77,
            z: 0.1,
        }
    },
    [AvatarType.SK_Cartoon_Female_021]: {
        name: AvatarType.SK_Cartoon_Female_021,
        GLTFURL: 'files/avatar/pose/SK_Cartoon_Female_021/SK_Cartoon_Female_021.gltf',
        LFBXURL: 'files/avatar/pose/SK_Cartoon_Female_021/SK_Cartoon_Female_021_L.fbx',
        HFBXURL: 'files/avatar/pose/SK_Cartoon_Female_021/SK_Cartoon_Female_021_H.fbx',
        extraNode: null,
        HDensity: 20,
        LDensity: 20,
        TDensity: 20,
        scale: 0.03,
        gltfScale: 3,
        position: {
            x: 0.06,
            y: -3.09,
            z: -0.2,
        }
    },
    [AvatarType.SK_Cartoon_Female_029]: {
        name: AvatarType.SK_Cartoon_Female_029,
        GLTFURL: 'files/avatar/pose/SK_Cartoon_Female_029/SK_Cartoon_Female_029.gltf',
        LFBXURL: 'files/avatar/pose/SK_Cartoon_Female_029/SK_Cartoon_Female_029_L.fbx',
        HFBXURL: 'files/avatar/pose/SK_Cartoon_Female_029/SK_Cartoon_Female_029_H.fbx',
        extraNode: null,
        HDensity: 30,
        LDensity: 30,
        TDensity: 20,
        scale: 0.03,
        gltfScale: 3,
        position: {
            x: 0.06,
            y: -3.09,
            z: -0.2,
        }
    },
    [AvatarType.SK_Cartoon_Female_059]: {
        name: AvatarType.SK_Cartoon_Female_059,
        GLTFURL: 'files/avatar/pose/SK_Cartoon_Female_059/SK_Cartoon_Female_059.gltf',
        LFBXURL: 'files/avatar/pose/SK_Cartoon_Female_059/SK_Cartoon_Female_059_L.fbx',
        HFBXURL: 'files/avatar/pose/SK_Cartoon_Female_059/SK_Cartoon_Female_059_H.fbx',
        extraNode: null,
        HDensity: 40,
        LDensity: 40,
        TDensity: 30,
        scale: 0.03,
        gltfScale: 3,
        position: {
            x: 0.06,
            y: -3.09,
            z: -0.2,
        }

    },
    [AvatarType.SK_Lowpoly_Male_002]: {
        name: AvatarType.SK_Lowpoly_Male_002,
        GLTFURL: 'files/avatar/pose/SK_Lowpoly_Male_002/SK_Lowpoly_Male_002.gltf',
        LFBXURL: 'files/avatar/pose/SK_Lowpoly_Male_002/SK_Lowpoly_Male_002_L.fbx',
        HFBXURL: 'files/avatar/pose/SK_Lowpoly_Male_002/SK_Lowpoly_Male_002_H.fbx',
        extraNode: null,
        HDensity: 30,
        LDensity: 30,
        TDensity: 20,
        scale: 0.03,
        gltfScale: 3,
        position: {
            x: 0.06,
            y: -2.8,
            z: -0.2,
        }
    },
    [AvatarType.SK_Lowpoly_Male_028]: {
        name: AvatarType.SK_Lowpoly_Male_028,
        GLTFURL: 'files/avatar/pose/SK_Lowpoly_Male_028/SK_Lowpoly_Male_028.gltf',
        LFBXURL: 'files/avatar/pose/SK_Lowpoly_Male_028/SK_Lowpoly_Male_028_L.fbx',
        HFBXURL: 'files/avatar/pose/SK_Lowpoly_Male_028/SK_Lowpoly_Male_028_H.fbx',
        extraNode: null,
        HDensity: 30,
        LDensity: 30,
        TDensity: 30,
        scale: 0.03,
        gltfScale: 3,
        position: {
            x: 0.06,
            y: -3.09,
            z: -0.2,
        }
    },
    [AvatarType.SK_Lowpoly_Male_040]: {
        name: AvatarType.SK_Lowpoly_Male_040,
        GLTFURL: 'files/avatar/pose/SK_Lowpoly_Male_040/SK_Lowpoly_Male_040.gltf',
        LFBXURL: 'files/avatar/pose/SK_Lowpoly_Male_040/SK_Lowpoly_Male_040_L.fbx',
        HFBXURL: 'files/avatar/pose/SK_Lowpoly_Male_040/SK_Lowpoly_Male_040_H.fbx',
        extraNode: null,
        HDensity: 30,
        LDensity: 30,
        TDensity: 20,
        scale: 0.03,
        gltfScale: 3,
        position: {
            x: 0.06,
            y: -2.2,
            z: -0.2,
        }
    },
};