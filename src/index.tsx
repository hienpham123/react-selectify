// Demo entry point - react-scripts will use this
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import './demo/index.css';
import App from './demo/App';

// Initialize FluentUI icons
initializeIcons();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
