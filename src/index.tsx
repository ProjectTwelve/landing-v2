import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './styles/reset.less';
import './styles/index.less';
import './utils';
import { App } from './pages/app/App';

const container = document.getElementById('root');
if (container) {
    const root = ReactDOMClient.createRoot(container);
    root.render(<App />);
}
