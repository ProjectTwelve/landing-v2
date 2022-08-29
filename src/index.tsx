import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './styles/reset.less';
import './styles/index.less';
import './utils';
import { addResizeHandle, IS_MOBILE, resizeBodyRotation } from './utils';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { App } from './pages/app/App';
import { SENTRY_DSN } from './constants';

Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1,
});

// 初始化的相关逻辑
if (IS_MOBILE) {
    document.body.classList.add('body-mobile');
} else {
    document.body.classList.add('body-pc');
}

// 初始化 横竖屏相关类
addResizeHandle(resizeBodyRotation);

const container = document.getElementById('root');
if (container) {
    const root = ReactDOMClient.createRoot(container);
    root.render(<App />);
}
