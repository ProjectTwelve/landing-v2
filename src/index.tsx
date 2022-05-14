import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './styles/reset.less';
import './styles/index.less';
import './utils';
import { App } from './pages/app/App';
import { IS_MOBILE, resizeMobileRoot } from './utils';

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

const container = document.getElementById('root');
if (container) {
    const root = ReactDOMClient.createRoot(container);
    root.render(<App />);
}
