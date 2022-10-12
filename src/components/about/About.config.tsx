export enum SocialType {
    Email = 'email',
    Phone = 'phone',
    Location = 'location',
}
export type ContactInfoType = {
    name: string;
    desc: string;
    socials: {
        [socialtype in SocialType]: string;
    };
};
export const CONTACT_INFO: ContactInfoType = {
    name: 'Issac',
    desc: 'point of contact',
    socials: {
        [SocialType.Email]: 'wanng@p12.dev',
        [SocialType.Phone]: '+1(702)9023147',
        [SocialType.Location]: 'Chino Hills, California',
    },
};

export interface PartnerInfo {
    img: string;
    name: any;
    desc: any;
    links: any;
}

export const ABOUT_PARTNERS: PartnerInfo[] = [
    {
        img: require('../../assets/about/partner-members/1.png'),
        name: (
            <>
                Boyang <span className="sep">|</span> Founder
            </>
        ),
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
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/14.png'),
        name: 'Lin',
        desc: <>Dota2 meme player, 'sword-exist-must-get' studio core member</>,
        links: {
            linkedin: null,
            twitter: null,
            github: 'https://github.com/linchengzzz',
        },
    },
    {
        img: require('../../assets/about/partner-members/10.png'),
        name: 'Dongbo',
        desc: (
            <>
                Game addict for 2 decades;
                <br />
                Guild master
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/12.png'),
        name: 'Noy',
        desc: (
            <>
                Folk dancer,
                <br />
                newbie but junkie
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: 'https://github.com/Jerrywang959',
        },
    },
    {
        img: require('../../assets/about/partner-members/11.png'),
        name: 'snow of tirisfal',
        desc: (
            <>
                otaku,
                <br />
                software engineer
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/18.png'),
        name: 'Dodo',
        desc: <>For small creatures such as we the vastness is bearable only through love.</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/HH.png'),
        name: 'HH',
        desc: <>Econ Research in P12; former quant developer, banker</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/9.png'),
        name: 'River',
        desc: (
            <>
                Favorite game: WOW;
                <br />
                Owner of all soul beasts
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: 'https://github.com/zh19910202',
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
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/16.png'),
        name: 'Grace.J',
        desc: (
            <>
                metaphysics designer;
                <br />
                caffiene addict
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/15.png'),
        name: 'Garfield',
        desc: <>To live is to recognize life</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/Sangwa Chosen.png'),
        name: 'Sangwa Chosen',
        desc: <>You know you were chosen once you were called 'CHOSEN'. So, why run away from it?</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/13.png'),
        name: 'Anthony Lau',
        desc: (
            <>
                Astrophysics enthusiast;
                <br />
                Story collector
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null,
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
            github: null,
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
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/21.png'),
        name: 'JJ Wilde',
        desc: <>My favorite yoga position is shavansana</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/22.png'),
        name: 'Zelda Princess',
        desc: <>Has the same aesthetic as Shigeru Miyamoto</>,
        links: {
            linkedin: 'https://www.linkedin.com/in/zanhui-yang-26490b84/',
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/wanng.png'),
        name: 'wanng',
        desc: <>MMO Maniac; A random guy from the space</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/Hanna.png'),
        name: 'Hanna',
        desc: <>Game visual Designer; Cat slave</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/Charline.png'),
        name: 'Charline',
        desc: <>Love music and music games</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/Green.C.png'),
        name: 'Green.C',
        desc: <>Front-End Engineer; Philosophy enthusiast;</>,
        links: {
            linkedin: null,
            twitter: null,
            github: 'https://github.com/ShallowGreen',
        },
    },
    {
        img: require('../../assets/about/partner-members/Sixian.png'),
        name: 'Sixian',
        desc: <>Love Coding, ACG and Genshin! May enthusiasm last forever</>,
        links: {
            linkedin: null,
            twitter: null,
            github: 'https://github.com/yusixian',
        },
    },
    {
        img: require('../../assets/about/partner-members/Lotus.png'),
        name: 'Lotus',
        desc: <>Cold blooded terminator</>,
        links: {
            linkedin: null,
            twitter: 'https://twitter.com/SandiegoLotu',
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/26.png'),
        name: 'Jane Liu',
        desc: <>An Explorer</>,
        links: {
            linkedin: 'https://www.linkedin.com/in/',
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/Larkloss.png'),
        name: 'Larkloss',
        desc: <>Not Employment Embattled Team Operator</>,
        links: {
            linkedin: null,
            twitter: 'https://twitter.com/HMS_Strider',
            github: null,
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
            github: null,
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
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/8.png'),
        name: 'Chasey',
        desc: <>Pray return to The Walking Sands</>,
        links: {
            linkedin: 'https://www.linkedin.com/in/yoko-y-94a99115b/',
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/20.png'),
        name: 'KK',
        desc: <>A fanatic antique collector with a dreamlike collection of Victorian parasols.</>,
        links: {
            linkedin: null,
            twitter: 'https://twitter.com/ZeXinKang1',
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/17.png'),
        name: 'Robin',
        desc: (
            <>
                Encoder and decoder
                <br />
                Digital and IRL nomad
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/25.png'),
        name: '0xSteven',
        desc: <>Robot Dancer 🤖️💃 decreasing entropy.</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/Akira.png'),
        name: 'Akira',
        desc: <>ACGholic; Start from here, start from now</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/19.png'),
        name: 'Ramping',
        desc: (
            <>
                Psychologically Revacholian;
                <br />
                TRUE Godardiste
            </>
        ),
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/7.png'),
        name: 'Yerim Choi',
        desc: <>Crazy Arcade was the last game I played, but believe me I love games</>,
        links: {
            linkedin: 'https://www.linkedin.com/in/yerim-choi-52ba02200/',
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/23.png'),
        name: 'Ruby',
        desc: <>Enjoy cooking in Zelda...</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/Momo.png'),
        name: 'Momo',
        desc: <>My dream is to travel around the world</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/Vin.png'),
        name: 'Vin',
        desc: <>Firmly believe that a good story is the soul of the game</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
    {
        img: require('../../assets/about/partner-members/William.png'),
        name: 'William',
        desc: <>Veteran fans of the Warring States period in Japan.</>,
        links: {
            linkedin: null,
            twitter: null,
            github: null,
        },
    },
];
