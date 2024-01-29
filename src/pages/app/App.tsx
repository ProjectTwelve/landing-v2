import { default as classNames, default as classnames } from 'classnames';
import { useAtom, useAtomValue } from 'jotai';
import _ from 'lodash-es';
import React, { cloneElement, useEffect, useMemo } from 'react';
import { useEvent, useSessionStorage } from 'react-use';
import { MOBILE_BASE_SIZE, MOBILE_BASE_WIDTH, STORAGE_KEY } from '../../constants';
import { useIsPortrait } from '../../hooks/useIsPortrait';
import { currentPageAtom, lockScrollAtom } from '../../store/app/state';
import { homeActiveExtraIndexAtom } from '../../store/home/state';
import { IS_MOBILE, initGA } from '../../utils';
import { CONTENT_PAGES, PageRoute, PageType } from './App.config';
import './App.less';
import Badge from './components/badge';
import ComingButton from './components/comingButton/ComingButton';
import { Navigator } from './components/navigator';

const pageTypes = CONTENT_PAGES.filter((v) => v.Content && v.type !== PageType.Loading).map((v) => v.type);

export const App = () => {
    const [current, setCurrent] = useAtom(currentPageAtom);
    const lockScroll = useAtomValue(lockScrollAtom);
    const isLoading = current === PageType.Loading;
    const nextPageType = getNextPageType();
    const prevPageType = getPrevPageType();

    const activatedHomeExtraIndex = useAtomValue(homeActiveExtraIndexAtom);
    const isPortrait = useIsPortrait();
    const [enableMouseTipAnim, setEnableMouseTipAnim] = useSessionStorage(STORAGE_KEY.ENABLE_MOUSE_TIP_ANIM, true);

    const initFontSize = () => {
        if (IS_MOBILE) {
            document.documentElement.style.fontSize = (window.innerWidth / MOBILE_BASE_WIDTH) * MOBILE_BASE_SIZE + 'px';
            return;
        }
        if (isPortrait) {
            document.documentElement.style.fontSize = '135px';
            return;
        }
        document.documentElement.style.fontSize = 'unset';
    };

    useEffect(() => initFontSize(), []);
    useEvent('resize', _.throttle(initFontSize, 1000));

    useEffect(() => {
        initGA();
    }, []);

    // 链接跳转
    useEffect(() => {
        if (isLoading) return;
        const path = window?.location?.pathname?.substring(1);
        if (!path || !PageRoute?.[path]) return;
        setCurrent(PageRoute[path]);
    }, [isLoading, window.location, setCurrent]);

    const contextValue = useMemo(
        () => ({
            visiblePage: current,
            setVisiblePage: setCurrent,
        }),
        [current, setCurrent],
    );

    return (
        <div
            className={classnames('app', { 'app--loading': isLoading }, `page-${current}-active`, {
                'home-extra-active': activatedHomeExtraIndex !== null,
            })}
            onWheel={handleWheel}
        >
            {/* <AppBg /> */}
            <div className="content">
                {CONTENT_PAGES.map((p, i) => {
                    return (
                        p.Content &&
                        p.type && (
                            <div
                                className={classnames('page-wrap', `page-wrap-${p.type}`, {
                                    active: p.type === current,
                                })}
                                key={`${p.type}-${i}`}
                            >
                                {p.type === PageType.Avatar ? cloneElement(p.Content, { currentPage: current }) : p.Content}
                            </div>
                        )
                    );
                })}
            </div>

            <div
                className="logo"
                onClick={() => {
                    setCurrent(PageType.Home);
                    // window.location.reload();
                }}
            ></div>
            <Navigator />
            {/* <div className="nav">
                {CONTENT_PAGES.map((p, i) => {
                    return (
                        p.NavText && (
                            <div
                                key={`${p.type}-${i}`}
                                className={classnames(
                                    'nav__item',
                                    p.type === current && 'active',
                                    !p.Content && 'nav__item--no-content',
                                    p.dropdown && 'nav__item--dropdown',
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
            </div> */}
            <Badge current={current} />
            <ComingButton />
            <div className="footer">
                <div className="footer__info"></div>
            </div>
            {/* pc 端只在第一页展示 */}
            {/* {!isPortrait && current !== PageType.Wall && (
                <div className="app__mouse-tips" onClick={() => nextPageType && setCurrent(nextPageType)}></div>
            )} */}
            {/* 手机端一直展示 */}
            {/* {isPortrait && ( */}
            <div className={classNames('app__mouse-tips', { wave: enableMouseTipAnim && current === PageType.Home })}>
                {prevPageType && (
                    <div
                        className="app__mouse-tips-item app__mouse-tips-prev"
                        onClick={() => {
                            if (enableMouseTipAnim) setEnableMouseTipAnim(false);
                            setCurrent(prevPageType);
                        }}
                    />
                )}
                {nextPageType && (
                    <div
                        className="app__mouse-tips-item app__mouse-tips-next"
                        onClick={() => {
                            if (enableMouseTipAnim) setEnableMouseTipAnim(false);
                            setCurrent(nextPageType);
                        }}
                    />
                )}
            </div>
            {/* )} */}
        </div>
    );

    function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
        // 正在切换和 loading 时，阻止切换，防止滚轮导致界面乱飞
        if (isLoading || window.appVisibleAnimating || window.appHideAnimating || !e || lockScroll) {
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
            if (rootDom && Math.ceil(document.body.scrollTop) + document.body.clientHeight >= rootDom.clientHeight) {
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
