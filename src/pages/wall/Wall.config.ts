import { CSSProperties } from 'react';

type PartnerData = {
    name: string;
    href: string;
    logo: string;
    style?: CSSProperties;
    mobileStyle?: CSSProperties;
};
export const PARTNERS_DATA: PartnerData[][] = [
    [
        {
            name: 'primavera',
            href: 'https://www.primavera-capital.com/',
            logo: require('../../assets/wall/partners/primavera.png'),
            style: {
                marginTop: '-10px',
            },
        },
        {
            name: 'metaapp',
            href: 'https://www.metaapp.cn/',
            logo: require('../../assets/wall/partners/metaapp.png'),
            style: {
                height: '24px',
            },
            mobileStyle: {
                height: '0.12rem',
                marginBottom: '-0.04rem',
            },
        },
        {
            name: 'CCV',
            href: 'https://en.ccvcap.com/',
            logo: require('../../assets/wall/partners/CCV.png'),
            mobileStyle: {
                height: '0.12rem',
            },
        },
        {
            name: 'cyber connect',
            href: 'https://cyberconnect.me/',
            logo: require('../../assets/wall/partners/cyber connect.png'),
        },
        {
            name: 'smrti lab',
            href: 'https://www.smrtilab.xyz/',
            logo: require('../../assets/wall/partners/smrtiLab.png'),
            style: {
                height: '38px',
            },
            mobileStyle: {
                height: '0.2rem',
            },
        },
    ],
    [
        {
            name: 'galxe',
            href: 'https://galxe.com/',
            logo: require('../../assets/wall/partners/galxe.png'),
        },
        {
            name: 'degenReborn',
            href: 'https://degenreborn.xyz/',
            logo: require('../../assets/wall/partners/degenReborn.png'),
            style: {
                height: '32px',
            },
        },
        {
            name: 'questn',
            href: 'https://questn.com/',
            logo: require('../../assets/wall/partners/questn.png'),
        },
        {
            name: 'deGame',
            href: 'https://degame.com/',
            logo: require('../../assets/wall/partners/degame.png'),
            style: {
                height: '30px',
            },
        },
        {
            name: 'bnbChain',
            href: 'https://www.bnbchain.org/',
            logo: require('../../assets/wall/partners/bnbChain.png'),
        },
        {
            name: 'spaceID',
            href: 'https://space.id/',
            logo: require('../../assets/wall/partners/spaceID.png'),
        },
        {
            name: 'salad',
            href: 'https://www.salad.ventures/',
            logo: require('../../assets/wall/partners/salad.png'),
        },
    ],
    [
        {
            name: 'xterio',
            href: 'https://xter.io/',
            logo: require('../../assets/wall/partners/xterio.png'),
        },
        {
            name: 'archloot',
            href: 'https://www.archloot.com/',
            logo: require('../../assets/wall/partners/archloot.png'),
        },
        {
            name: 'ambrusStudio',
            href: 'https://www.ambrus.studio/',
            logo: require('../../assets/wall/partners/ambrusStudio.png'),
            style: {
                height: '48px',
            },
            mobileStyle: {
                height: '0.2rem',
            },
        },
        {
            name: 'yeehaGames',
            href: 'https://yeehagames.com/',
            logo: require('../../assets/wall/partners/yeehaGames.png'),
        },
        {
            name: 'mixmob',
            href: 'https://www.mixmob.io/',
            logo: require('../../assets/wall/partners/mixmob.png'),
        },
        {
            name: 'WOB',
            href: 'https://balatroon.world/',
            logo: require('../../assets/wall/partners/WOB.png'),
            style: {
                height: '48px',
            },
            mobileStyle: {
                height: '0.25rem',
            },
        },
        {
            name: 'revoland',
            href: 'https://www.revoland.com/',
            logo: require('../../assets/wall/partners/revoland.png'),
            style: {
                height: '44px',
            },
            mobileStyle: {
                height: '0.25rem',
            },
        },
        {
            name: 'bitKeep',
            href: 'https://bitkeep.com/',
            logo: require('../../assets/wall/partners/bitKeep.png'),
            style: {
                height: '36px',
            },
            mobileStyle: {
                height: '0.25rem',
            },
        },
    ],
];

export const FEATURED_ON_DATA = [
    {
        name: 'Bloomberg',
        href: 'https://www.bloomberg.com/',
    },
    {
        name: 'Yahoo! Finance',
        href: 'https://finance.yahoo.com/news/project-twelve-closes-8-million-124000354.html',
    },
    {
        name: 'MarketWatch',
        href: 'https://www.marketwatch.com/press-release/p12-secures-8m-to-build-sustainable-web3-gaming-amid-ongoing-genesis-soul-bound-nft-airdrop-2022-06-28?mod=search_headline',
    },
    {
        name: 'Finanzen.net',
        href: 'http://www.finanzen.net/nachricht/aktien/project-twelve-closes-8-million-funding-round-to-build-sustainable-web3-gaming-ecosystem-launches-genesis-nft-airdrop-11483912',
    },
    {
        name: 'Seeking Alpha',
        href: 'https://seekingalpha.com/pr/18848162-project-twelve-closes-8-million-funding-round-to-build-sustainable-web3-gaming-ecosystem-and',
    },
    {
        name: 'Benzinga',
        href: 'http://www.benzinga.com/pressreleases/22/06/n27880417/project-twelve-closes-8-million-funding-round-to-build-sustainable-web3-gaming-ecosystem-launches-',
    },
    {
        name: 'Morningstar',
        href: 'https://www.morningstar.com/news/pr-newswire/20220628ph01728/project-twelve-closes-8-million-funding-round-to-build-sustainable-web3-gaming-ecosystem-launches-genesis-nft-airdrop',
    },
    {
        name: 'JustGamers',
        href: 'https://www.justgamers.net/gaming/project-twelve-raises-8-million-to-accelerate-web3-gaming-development/',
    },
];
