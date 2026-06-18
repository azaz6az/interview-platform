import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeModeProvider>
        <ApiKeyProvider>
          <App />
        </ApiKeyProvider>
      </ThemeModeProvider>
    </HashRouter>
  </React.StrictMode>
);
