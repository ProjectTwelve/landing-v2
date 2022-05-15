import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './styles/reset.less';
import './styles/index.less';
import './utils';
import { App } from './pages/app/App';
import { IS_MOBILE, resizeBodyRotation, resizeMobileRoot } from './utils';

// 初始化的相关逻辑
if (IS_MOBILE) {
    document.body.classList.add('body-mobile');
    window.addEventListener('resize', () => resizeMobileRoot());
    window.addEventListener('orientationchange', () =>
        setTimeout(() => resizeMobileRoot(), 100)
    );
    resizeMobileRoot();
} else {
    document.body.classList.add('body-pc');
}

// 初始化 横竖屏相关类
window.addEventListener('resize', () => resizeBodyRotation());
window.addEventListener('orientationchange', () =>
    setTimeout(() => resizeBodyRotation(), 100)
);
resizeBodyRotation();

const container = document.getElementById('root');
if (container) {
    const root = ReactDOMClient.createRoot(container);
    root.render(<App />);
}
