import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { XingineContextBureau } from "xingine-react";
import { setupMockAPI } from './mockAPI';
import ErrorPagesDemo from '@parent/component/demos/ErrorPagesDemo';
import { LAYOUT_MAP } from './components/layouts/layout.map';

// Setup mock API before initializing the app
setupMockAPI();

const config = {
    component: {
        ErrorPagesDemo: ErrorPagesDemo
    },
    layoutMap: LAYOUT_MAP,
    additionalRoutes: []
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <XingineContextBureau config={config}>
        <App />
      </XingineContextBureau>
  </React.StrictMode>,
)
