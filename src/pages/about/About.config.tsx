export const LOCATION_INFO = [
    {
        type: 'presence',
        name: 'Shanghai',
        x: 1612,
        y: 737,
        namePosition: 'right',
    },
    {
        type: 'presence',
        name: 'Hangzhou',
        x: 1591,
        y: 754,
        namePosition: 'left',
    },
    {
        type: 'headquarter',
        name: 'Singapore',
        x: 1563,
        y: 905,
        namePosition: 'right',
    },
    {
        type: 'presence',
        name: 'Berkeley,CA',
        x: 267,
        y: 651,
        namePosition: 'left',
    },
    {
        type: 'presence',
        name: 'Los Angeles,CA',
        x: 295,
        y: 714,
        namePosition: 'left',
    },
    {
        type: 'presence',
        name: 'Chapel Hill,NC',
        x: 505,
        y: 703,
        namePosition: 'right',
    },
    {
        type: 'presence',
        name: 'Kuala Lumpur',
        x: 1489,
        y: 865,
        namePosition: 'left',
    },
    {
        type: 'presence',
        name: 'Tokyo',
        x: 1706,
        y: 672,
        namePosition: 'right',
    },
    {
        type: 'presence',
        name: 'Krakow',
        x: 1063,
        y: 595,
        namePosition: 'right',
    },
    {
        type: 'presence',
        name: 'Seoul',
        x: 1625,
        y: 699,
        namePosition: 'left',
    },
    {
        type: 'origin',
        img: require('../../assets/about/origin-poland.png'),
        name: 'Poland',
        x: 1063,
        y: 559,
        namePosition: 'none',
    },
    {
        type: 'origin',
        img: require('../../assets/about/origin-rwanda.png'),
        name: 'Rwanda',
        x: 1099,
        y: 904,
        namePosition: 'none',
    },
    {
        type: 'origin',
        img: require('../../assets/about/origin-china.png'),
        name: 'China',
        x: 1500,
        y: 694,
        namePosition: 'none',
    },
    {
        type: 'origin',
        img: require('../../assets/about/origin-korea.png'),
        name: 'Korea',
        x: 1640,
        y: 699,
        namePosition: 'none',
    },
    {
        type: 'origin',
        img: require('../../assets/about/origin-japan.png'),
        name: 'Japan',
        x: 1714,
        y: 624,
        namePosition: 'none',
    },
    {
        type: 'origin',
        img: require('../../assets/about/origin-penang.png'),
        name: 'Kuala Lumpar',
        x: 1510,
        y: 855,
        namePosition: 'none',
    },
    {
        type: 'origin',
        img: require('../../assets/about/origin-singapore.png'),
        name: 'Singapore',
        x: 1526,
        y: 897,
        namePosition: 'none',
    },
    {
        type: 'origin',
        img: require('../../assets/about/origin-usa.png'),
        name: 'USA',
        x: 388,
        y: 681,
        namePosition: 'none',
    },
];

export interface PartnerInfo {
    img: string;
    name: any;
    desc: any;
    links: any
}

export const ABOUT_PARTNERS : PartnerInfo[] = [
    {
        img: require('../../assets/about/partner-members/1.png'),
        name: <>Boyang <span className='sep'>|</span> Founder</>,
        desc: (
            <>
                Two times TI Crimson Witness;
                <br />
                Hatsune Miku 39's Live 2011
            </>
        ),
        links: {
            linkedin: 'https://www.linkedin.com/in/wangboyang/',
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/2.png'),
        name: 'Maciej Burno',
        desc: (
            <>
                Game Veteran. First game:
                <br />
                Contra, most /played: WoW
            </>
        ),
        links: {
            linkedin: 'https://www.linkedin.com/in/maciejburno/',
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/3.png'),
        name: 'Amber Drolma',
        desc: (
            <>
                Capoeirista CBLA Clan;
                <br />
                Ecstatic dance Koh Phangan
            </>
        ),
        links: {
            linkedin: 'https://www.linkedin.com/in/kelsangdrolma/',
            twitter: null,
            github: null
        },
    },

    {
        img: require('../../assets/about/partner-members/4.png'),
        name: 'RK',
        desc: (
            <>
                DOTA2 4000+hours; 
                <br />
                WoW FD race member
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/5.png'),
        name: 'Garden',
        desc: (
            <>
                RPG lover, Mixed-race baby, 
                <br />
                Linguistics & football enthusiast
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/6.png'),
        name: 'Blue Dragon',
        desc: (
            <>
                Volcano lover; 
                <br />
                Cat slave
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/7.png'),
        name: 'Yerim Choi',
        desc: (
            <>
                Crazy Arcade was the last game I played, but believe me I love games
            </>
        ),
        links: {
            linkedin: 'https://www.linkedin.com/in/yerim-choi-52ba02200/',
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/8.png'),
        name: 'Chasey',
        desc: (
            <>
                Pray return to The Walking Sands
            </>
        ),
        links: {
            linkedin: 'https://www.linkedin.com/in/yoko-y-94a99115b/',
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/9.png'),
        name: 'River',
        desc: (
            <>
                Favorite game: WOW;
                <br/>
                Owner of all soul beasts
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: 'https://github.com/zh19910202'
        },
    },
    {
        img: require('../../assets/about/partner-members/10.png'),
        name: 'Dongbo',
        desc: (
            <>
                Game addict for 2 decades;
                <br/>
                Guild master
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/11.png'),
        name: 'snow of tirisfal',
        desc: (
            <>
                otaku,
                <br/>
                software engineer
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/12.png'),
        name: 'Noy',
        desc: (
            <>
                Folk dancer,
                <br/>
                newbie but junkie
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: 'https://github.com/Jerrywang959'
        },
    },
    {
        img: require('../../assets/about/partner-members/13.png'),
        name: 'Anthony Lau',
        desc: (
            <>
                Astrophysics enthusiast; 
                <br/>
                Story collector
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/14.png'),
        name: 'Lin',
        desc: (
            <>
                Dota2 meme player,
                'sword-exist-must-get' studio core member
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: 'https://github.com/linchengzzz'
        },
    },
    {
        img: require('../../assets/about/partner-members/15.png'),
        name: 'Garfield',
        desc: (
            <>
                To live is to recognize life
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/16.png'),
        name: 'Grace.J',
        desc: (
            <>
                metaphysics designer; 
                <br/>
                caffiene addict
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/17.png'),
        name: 'Robin',
        desc: (
            <>
                Encoder and decoder
                <br/>
                Digital and IRL nomad
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/18.png'),
        name: 'Dodo',
        desc: (
            <>
                ISFJ: Until I run out of excess organs, why shouldn't I do everything I can to help them?
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/19.png'),
        name: 'Ramping',
        desc: (
            <>
                Psychologically Revacholian;
                <br/>
                TRUE Godardiste
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/20.png'),
        name: 'KK',
        desc: (
            <>
                A fanatic antique collector with a dreamlike collection of Victorian parasols.
            </>
        ),
        links: {
            linkedin: null,
            twitter: 'https://twitter.com/ZeXinKang1',
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/21.png'),
        name: 'JJ Wilde',
        desc: (
            <>
                My favorite yoga position is shavansana
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/22.png'),
        name: 'Zelda Princess',
        desc: (
            <>
                Has the same aesthetic as Shigeru Miyamoto
            </>
        ),
        links: {
            linkedin: 'https://www.linkedin.com/in/zanhui-yang-26490b84/',
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/23.png'),
        name: 'Ruby',
        desc: (
            <>
                Enjoy cooking in Zelda...
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
    {
        img: require('../../assets/about/partner-members/25.png'),
        name: '0xSteven',
        desc: (
            <>
                Robot Dancer 🤖️💃 decreasing entropy.
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null
        },
    },
];
