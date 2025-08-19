import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { XingineContextBureau } from "xingine-react";
import { setupMockAPI } from './mockAPI';
import {MetaBuilderDemo} from "@/MetaBuilderDemo.tsx";

// Setup mock API before initializing the app
//setupMockAPI();

const config = {
    component: {
    },
    additionalRoutes: [
        {
            path: "/sample",
            index: true,
            element: (
                <MetaBuilderDemo />
            ),
        } as RouteObject,
    ]
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <XingineContextBureau config={config}>
        <App />
      </XingineContextBureau>
  </React.StrictMode>,
)
