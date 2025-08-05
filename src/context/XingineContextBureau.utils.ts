import React from "react";
import { RouteObject } from "react-router-dom";
import { LayoutRenderer,  Commissar, PathProperties} from "xingine";
import { DefaultLayoutRenderer } from "../component/layout/DefaultLayoutRenderer";
import { DefaultContentRenderer } from "../component/layout/DefaultContentRenderer";
import { StateManagementContentRenderer } from "../component/layout/StateManagementContentRenderer";


export function getRoutesFromLayout(layout: LayoutRenderer): RouteObject[] {
    const l = {...layout, content: undefined}
    return [
        {
            path: '/',
            element: React.createElement(DefaultLayoutRenderer, layout),
            children: layout.content.meta.map((commissar: Commissar) => {
                const routePath = typeof commissar.path === 'string' 
                    ? commissar.path 
                    : (commissar.path as PathProperties).path;
                
                // Use specialized content renderer for state management page
                const ContentRenderer = routePath === '/state-management' 
                    ? StateManagementContentRenderer 
                    : DefaultContentRenderer;
                
                return {
                    path: routePath,
                    element: React.createElement(ContentRenderer, { ...commissar }),
                };
            }),
        },
    ];
}
