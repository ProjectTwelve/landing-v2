import React, { useRef, useState } from 'react';
import { AppBg } from './components/AppBg';
import './App.less';
import classnames from 'classnames';
import { PageType, CONTENT_PAGES } from './App.config';

export const App = () => {
    const [current, setCurrent] = useState(PageType.Loading);

    return (
        <div className='app'>
            <AppBg />
            <div className='content'>
                {CONTENT_PAGES.map((p, i) => {
                    return <>{p.Content}</>;
                })}
            </div>
            <div className='logo'></div>
            <div className='nav'>
                {CONTENT_PAGES.map((p, i) => {
                    return (
                        p.NavText && (
                            <div
                                key={`${p.type}-${i}`}
                                className={classnames(
                                    'nav__item',
                                    current === p.type && 'active'
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
                <div className='footer__audio audio-btn'></div>
            </div>
        </div>
    );
};
