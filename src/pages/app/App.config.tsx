import React from 'react';
import { Home } from '../home/Home';
import { Avatar } from '../avatar/Avatar';
import { Tree } from '../tree/Tree';
import { Poster } from '../poster/Poster';
import { About } from '../about/About';
import { Loading } from '../loading/Loading';

export enum PageType {
    Loading = 1,
    Home,
    Avatar,
    Tree,
    Poster,
    About,
}

export const CONTENT_PAGES = [
    {
        type: PageType.Loading,
        NavText: null,
        Content: <Loading />,
    },
    {
        type: PageType.Home,
        NavText: null,
        Content: <Home />,
    },
    {
        type: PageType.Avatar,
        NavText: <>GAME&nbsp;CHARACTER</>,
        Content: <Avatar />,
    },
    {
        type: PageType.Tree,
        NavText: <>ECONOMIC&nbsp;SYSTEM</>,
        Content: <Tree />,
    },
    {
        type: PageType.Poster,
        NavText: <>GAME&nbsp;SCENE</>,
        Content: <Poster />,
    },
    {
        type: PageType.About,
        NavText: <>ABOUT&nbsp;US</>,
        Content: <About />,
    },
    {
        type: null,
        NavText: <>COMMUNITY</>,
        Content: null,
    },
];
