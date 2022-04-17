import React, { Fragment, useRef, useState } from 'react';
import { AppBg } from './components/AppBg';
import './App.less';
import classnames from 'classnames';
import { PageType, CONTENT_PAGES } from './App.config';

export const App = () => {
    const [current, setCurrent] = useState(PageType.Loading);
    const [musicPlaying, setMusicPlaying] = useState(true);

    return (
        <div className='app'>
            <AppBg />
            <div className='content'>
                {CONTENT_PAGES.map((p, i) => {
                    return (
                        p.Content &&
                        p.type && (
                            <Fragment key={`${p.type}-${i}`}>
                                {p.type === current && p.Content}
                            </Fragment>
                        )
                    );
                })}
            </div>
            <div
                className='logo'
                onClick={() => setCurrent(PageType.Home)}
            ></div>
            <div className='nav'>
                {CONTENT_PAGES.map((p, i) => {
                    return (
                        p.NavText && (
                            <div
                                key={`${p.type}-${i}`}
                                className={classnames(
                                    'nav__item',
                                    p.type === current && 'active',
                                    !p.Content && 'nav__item--no-content'
                                )}
                                onClick={() => p.type && setCurrent(p.type)}
                            >
                                {p.NavText}
                            </div>
                        )
                    );
                })}
            </div>
            <div className='coming-btn'></div>
            <div className='footer'>
                <div className='footer__info'></div>
                <div
                    className={classnames(
                        'footer__audio',
                        'audio-btn',
                        musicPlaying && 'active'
                    )}
                    onClick={() => setMusicPlaying(!musicPlaying)}
                >
                    <i className='footer__audio-item'></i>
                    <i className='footer__audio-item'></i>
                    <i className='footer__audio-item'></i>
                </div>
            </div>
        </div>
    );
};
