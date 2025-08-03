import React from "react";
import { RouteObject } from "react-router-dom";
import { LayoutRenderer,  Commissar, PathProperties} from "xingine";
import { LayoutWithActionProvider } from "../component/layout/LayoutWithActionProvider";
import { DefaultContentRenderer } from "../component/layout/DefaultContentRenderer";


export function getRoutesFromLayout(layout: LayoutRenderer): RouteObject[] {
    const l = {...layout, content: undefined}
    return [
        {
            path: '/',
            element: React.createElement(LayoutWithActionProvider, layout),
            children: layout.content.meta.map((commissar: Commissar) => {
                const routePath = typeof commissar.path === 'string' 
                    ? commissar.path 
                    : (commissar.path as PathProperties).path;
                
                return {
                    path: routePath,
                    element: React.createElement(DefaultContentRenderer, { ...commissar }),
                };
            }),
        },
    ];
}
