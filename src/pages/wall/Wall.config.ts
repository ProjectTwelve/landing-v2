import { CSSProperties } from 'react';

type PartnerData = {
    name: string;
    href?: string;
    logo: string;
    style?: CSSProperties;
    mobileStyle?: CSSProperties;
};
export const INVESTORS_DATA: PartnerData[][] = [
    [
        { name: 'primavera', logo: require('../../assets/wall/partners/primavera.png') },

        { name: 'galxe', logo: require('../../assets/wall/partners/galxe.png') },

        {
            name: 'cyber connect',
            logo: require('../../assets/wall/partners/cyber connect.png'),
        },
        {
            name: 'CCV',
            logo: require('../../assets/wall/partners/CCV.png'),
            mobileStyle: {
                height: '0.12rem',
            },
        },
        {
            name: 'smrti lab',
            logo: require('../../assets/wall/partners/smrtiLab.png'),
            style: {
                height: '38px',
            },
            mobileStyle: {
                height: '0.2rem',
            },
        },
    ],
];
export const PARTNERS_DATA: PartnerData[][] = [
    [
        {
            name: 'Linea',
            logo: require('../../assets/wall/partners/linea.png'),
        },
        {
            name: 'zetachain',
            logo: require('../../assets/wall/partners/zetaChain.png'),
        },
        {
            name: 'bnbChain',
            logo: require('../../assets/wall/partners/bnbChain.png'),
        },
        {
            name: 'xterio',
            logo: require('../../assets/wall/partners/xterio.png'),
        },
        {
            name: 'nodereal',
            logo: require('../../assets/wall/partners/nodereal.png'),
        },
    ],
];

export const FEATURED_ON_DATA = [
    {
        name: 'Bloomberg',
    },
    {
        name: 'Yahoo! Finance',
    },
    {
        name: 'Seeking Alpha',
    },
    {
        name: 'Benzinga',
    },
];
