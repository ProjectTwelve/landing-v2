import React from 'react';
import { Home } from '../home/Home';
import { Avatar } from '../avatar/Avatar';
import { Tree } from '../tree/Tree';
import { Poster } from '../poster/Poster';
import { About } from '../about/About';
import { Loading } from '../loading/Loading';
import { Wall } from '../wall/Wall';

export enum PageType {
    Loading = 'loading',
    Home = 'home',
    Avatar = 'avatar',
    Tree = 'tree',
    Poster = 'poster',
    About = 'about',
    Wall = 'wall',
}

export const PageBadges = [
    PageType.Home,
    PageType.Avatar,
    PageType.Tree,
    PageType.Poster,
    PageType.About,
    PageType.Wall,
];

export const CONTENT_PAGES = [
    {
        type: PageType.Loading,
        NavText: null,
        Content: <Loading />,
        dropdown: false,
    },
    {
        type: PageType.Home,
        NavText: <>Vision</>,
        Content: <Home />,
        dropdown: false,
    },
    {
        type: PageType.Poster,
        NavText: <>The&nbsp;Editor</>,
        Content: <Poster />,
        dropdown: false,
    },
    {
        type: PageType.Avatar,
        NavText: <>The&nbsp;Infra</>,
        Content: <Avatar />,
        dropdown: false,
    },
    {
        type: PageType.Tree,
        NavText: <>The&nbsp;Econs</>,
        Content: <Tree />,
        dropdown: false,
    },
    // {
    //     type: null,
    //     NavText: (
    //         <a
    //             className='nav-link-wrap'
    //             href='https://twitter.com/_p12_'
    //             target='_blank'
    //             rel='noreferrer'
    //         >
    //             Whitepaper
    //         </a>
    //     ),
    //     Content: null,
    //     dropdown: false,
    // },
    {
        type: PageType.About,
        NavText: <>Team</>,
        Content: <About />,
        dropdown: false,
    },
    {
        type: PageType.Wall,
        NavText: <>Partners</>,
        Content: <Wall />,
        dropdown: false,
    },
    {
        type: null,
        NavText: (
            <div className='nav-community-wrap'>
                And&nbsp;Frens
                <div className='nav-community'>
                    <a
                        href='https://twitter.com/_p12_'
                        target='_blank'
                        className='nav-community__item nav-community__item--twitter'
                        rel='noreferrer'
                    >
                        <i></i>
                        Twitter
                    </a>
                    <a
                        href='https://discord.com/invite/EMrbsZPbxs'
                        target='_blank'
                        className='nav-community__item nav-community__item--discord'
                        rel='noreferrer'
                    >
                        <i></i>
                        Discord
                    </a>
                    <a
                        href='https://t.me/project_twelve'
                        target='_blank'
                        className='nav-community__item nav-community__item--telegram'
                        rel='noreferrer'
                    >
                        <i></i>
                        Telegram
                    </a>
                </div>
            </div>
        ),
        Content: null,
        dropdown: true,
    },
];
