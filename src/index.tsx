import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './styles/reset.less';
import './styles/index.less';
import './utils';
import { addResizeHandle, IS_MOBILE, resizeBodyRotation } from './utils';
import { App } from './pages/app/App';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { SENTRY_DSN, SENTRY_TRACES_SAMPLE_RATE } from './constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
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
    root.render(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>,
    );
}
