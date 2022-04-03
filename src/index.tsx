import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './styles/reset.css';
import './styles/index.css';
import './utils';
import { App } from './pages/app/App';

const container = document.getElementById('root');
if (container) {
    const root = ReactDOMClient.createRoot(container);
    root.render(<App />);
}
