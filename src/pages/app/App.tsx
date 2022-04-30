import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { AppBg } from './components/AppBg';
import './App.less';
import classnames from 'classnames';
import { PageType, CONTENT_PAGES, PageBadges } from './App.config';
import { playClickAudio } from '../../utils';
import { AppContext, loadingEE } from './App.utils';
import gsap from 'gsap';

export const App = () => {
    const [current, setCurrent] = useState(PageType.Loading);
    const isLoading = current === PageType.Loading;
    const [musicPlaying, setMusicPlaying] = useState(true);

    useEffect(() => {
        const handleProgress = (progress) => {
            // loading 界面 且 loading 完成
            if (progress >= 1) {
                setTimeout(() => {
                    setCurrent(PageType.Home);
                }, 300);
            }
        };
        if (isLoading) {
            loadingEE.on('progress', handleProgress);
        }
        return () => {
            loadingEE.off('progress', handleProgress);
        };
    }, [isLoading]);

    const contextValue = useMemo(
        () => ({
            visiblePage: current,
            setVisiblePage: setCurrent,
        }),
        [current, setCurrent]
    );

    return (
        <AppContext.Provider value={contextValue}>
            <div className={classnames('app', { 'app--loading': isLoading })}>
                <AppBg />
                <div className='content'>
                    {CONTENT_PAGES.map((p, i) => {
                        return (
                            p.Content &&
                            p.type && (
                                <div
                                    className={classnames(
                                        'page-wrap',
                                        `page-wrap-${p.type}`,
                                        {
                                            active: p.type === current,
                                        }
                                    )}
                                    key={`${p.type}-${i}`}
                                >
                                    {p.Content}
                                </div>
                            )
                        );
                    })}
                </div>
                <div
                    className='logo'
                    onClick={() => {
                        // playClickAudio();
                        // setCurrent(PageType.Home);
                        window.location.reload();
                    }}
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
                                    onClick={() => {
                                        playClickAudio();
                                        p.type && setCurrent(p.type);
                                    }}
                                >
                                    {p.NavText}
                                </div>
                            )
                        );
                    })}
                </div>
                {PageBadges.includes(current) && (
                    <div className='badge-wrap'>
                        <div className='badge-circle'></div>
                        {PageBadges.map((v, i) => (
                            <div
                                key={v}
                                style={{
                                    opacity: v === current ? 1 : 0,
                                    zIndex: v === current ? 2 : 1,
                                }}
                                className={classnames([
                                    'badge-icon',
                                    `badge-icon--${i + 1}`,
                                ])}
                            ></div>
                        ))}
                    </div>
                )}
                <div className='coming-btn'></div>
                <div className='footer'>
                    <div className='footer__info'></div>
                    {/* <div
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
                </div> */}
                </div>
            </div>
        </AppContext.Provider>
    );
};
