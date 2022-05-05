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
    },
    {
        type: PageType.Home,
        NavText: <>Vision</>,
        Content: <Home />,
    },
    {
        type: PageType.Poster,
        NavText: <>The&nbsp;Editor</>,
        Content: <Poster />,
    },
    {
        type: PageType.Avatar,
        NavText: <>The&nbsp;Infra</>,
        Content: <Avatar />,
    },
    {
        type: PageType.Tree,
        NavText: <>The&nbsp;Econs</>,
        Content: <Tree />,
    },
    {
        type: null,
        NavText: (
            <a
                className='nav-whitepaper-wrap'
                href='https://twitter.com/_p12_'
                target='_blank'
                rel='noreferrer'>
                Whitepaper
            </a>
        ),
        Content: null,
    },
    {
        type: PageType.About,
        NavText: <>Team</>,
        Content: <About />,
    },
    {
        type: PageType.Wall,
        NavText: <>Partners</>,
        Content: <Wall />,
    },
    {
        type: null,
        NavText: (
            <div className='nav-community-wrap'>
                ..And&nbsp;Frens
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
    },
];
