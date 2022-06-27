import classnames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { IS_MOBILE, playClickAudio } from '../../utils';
import { CONTENT_PAGES, PageBadges, PageType } from './App.config';
import './App.less';
import { AppContext, loadingEE } from './App.utils';
import { initGA } from '../../utils';
import { useLocalStorageState } from 'ahooks';

const pageTypes = CONTENT_PAGES.filter(
    (v) => v.Content && v.type !== PageType.Loading
).map((v) => v.type);

export const App = () => {
    const [current, setCurrent] = useState(PageType.Loading);
    // const [current, setCurrent] = useState(PageType.Wall);
    const isLoading = current === PageType.Loading;
    const [musicPlaying, setMusicPlaying] = useState(true);
    const nextPageType = getNextPageType();
    const [pulseState, setPulseState] = useLocalStorageState('hasPulse', { defaultValue: 'pulse' });

    useEffect(() => {
        initGA();

        const handleProgress = (progress) => {
            // 当前是 loading 界面 且 loading 完成
            if (progress >= 1) {
                setTimeout(() => {
                    setCurrent(PageType.Home);
                }, 700);
            }
        };
        if (isLoading) {
            loadingEE.on('progress', handleProgress);
        }
        return () => {
            loadingEE.off('progress', handleProgress);
        };
    }, [isLoading, current]);

    const contextValue = useMemo(
        () => ({
            visiblePage: current,
            setVisiblePage: setCurrent,
        }),
        [current, setCurrent]
    );

    return (
        <AppContext.Provider value={contextValue}>
            <div
                className={classnames('app', { 'app--loading': isLoading })}
                onWheel={handleWheel}
            >
                {/* <AppBg /> */}
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
                                        !p.Content && 'nav__item--no-content',
                                        p.dropdown && 'nav__item--dropdown'
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
                <div className={classnames(['coming-btn', pulseState])}>
                    <a
                        href='https://airdrop.p12.games'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <div className='coming-btn__item' onMouseEnter={() => setPulseState('')}></div>
                    </a>
                </div>
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
                {/* pc 端只在第一页展示 */}
                {!IS_MOBILE && current === PageType.Home && (
                    <div
                        className='app__mouse-tips'
                        onClick={() => nextPageType && setCurrent(nextPageType)}
                    ></div>
                )}
                {/* 手机端一直展示 */}
                {IS_MOBILE && nextPageType && (
                    <div
                        className='app__mouse-tips'
                        onClick={() => setCurrent(nextPageType)}
                    ></div>
                )}
            </div>
        </AppContext.Provider>
    );

    function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
        // 正在切换和 loading 时，阻止切换，防止滚轮导致界面乱飞
        if (
            isLoading ||
            window.appVisibleAnimating ||
            window.appHideAnimating ||
            !e
        ) {
            return;
        }
        if (Math.abs(e.deltaY) < 35) {
            // 剔除 mac 的惯性和 轻轻转动的事件
            return;
        }

        let newPage: PageType | null = null;
        if (e.deltaY <= 0) {
            if (document.body.scrollTop <= 0) {
                // 滚动到达顶部了，切换至上一页
                newPage = getPrevPageType();
            }
        } else {
            const rootDom = document.getElementById('root');
            if (
                rootDom &&
                Math.ceil(document.body.scrollTop) +
                    document.body.clientHeight >=
                    rootDom.clientHeight
            ) {
                // 滚动到达底部了
                newPage = getNextPageType();
            }
        }
        if (!newPage || newPage === current) return;
        setCurrent(newPage);
    }

    function getPrevPageType() {
        const index = pageTypes.indexOf(current) || 0;
        return pageTypes[index - 1] || null;
    }
    function getNextPageType() {
        const index = pageTypes.indexOf(current) || 0;
        return pageTypes[index + 1] || null;
    }
};
