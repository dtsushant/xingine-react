import React from "react";
import { RouteObject } from "react-router-dom";
import { LayoutRenderer,  Commissar, PathProperties} from "xingine";


export function getRoutesFromLayout(layout: LayoutRenderer): RouteObject[] {
    const l = {...layout, content: undefined}
    return [
        {
            path: '/',
            element: React.createElement(require("../component/layout/LayoutWithActionProvider").LayoutWithActionProvider, l),
            children: layout.content.meta.map((commissar: Commissar) => {
                const routePath = typeof commissar.path === 'string' 
                    ? commissar.path 
                    : (commissar.path as PathProperties).path;
                
                return {
                    path: routePath,
                    element: React.createElement(require("../component/layout/DefaultContentRenderer").DefaultContentRenderer, { ...commissar }),
                };
            }),
        },
    ];
}
