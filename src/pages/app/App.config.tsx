import React from 'react';
import { Home } from '../home/Home';
import { Avatar } from '../avatar/Avatar';
import { Tree } from '../tree/Tree';
// import { Poster } from '../poster/Poster';
import { About } from '../about/About';
import { Loading } from '../loading/Loading';
import { Wall } from '../wall/Wall';
import { Social } from '../social/Social';

export enum PageType {
    Loading = 'loading',
    Home = 'home',
    Avatar = 'avatar',
    Tree = 'tree',
    Poster = 'poster',
    About = 'about',
    Wall = 'wall',
    Social = 'social',
}

export const PageBadges = [
    PageType.Home,
    PageType.Avatar,
    PageType.Tree,
    PageType.Poster,
    PageType.About,
    PageType.Wall,
    PageType.Social,
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
        Content: <div>Poster</div>, // <Poster />,
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
        type: PageType.Social,
        NavText: <>Social</>,
        Content: <Social />,
        dropdown: false,
    },
    {
        type: null,
        NavText: (
            <div className="nav-dropdown-wrap">
                Link Tree
                <div className="nav-dropdown nav-dropdown--tree">
                    <a href="https://airdrop.p12.games" target="_blank" className="nav-dropdown__item" rel="noreferrer">
                        Airdrop
                    </a>
                    <a href="https://galaxy.eco/P12/" target="_blank" className="nav-dropdown__item" rel="noreferrer">
                        Badge
                    </a>
                    <a href="https://p12.dev/whitepaper" target="_blank" className="nav-dropdown__item" rel="noreferrer">
                        Whitepaper
                    </a>
                    {/* <a
                        href='https://github.com/ProjectTwelve/contracts/tree/main/audits'
                        target='_blank'
                        className='nav-dropdown__item'
                        rel='noreferrer'
                    >
                        Audit Reports
                    </a> */}
                    <a href="mailto:hi@p12.dev" target="_blank" className="nav-dropdown__item" rel="noreferrer">
                        Say Hi
                    </a>
                </div>
            </div>
        ),
        Content: null,
        dropdown: true,
    },
];
