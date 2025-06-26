import React from "react";
import { RouteObject } from "react-router-dom";
import {getUIComponentDetails, LayoutRenderer, ModuleProperties} from "xingine";
import { XingineConfig } from "../configuration/Configuration";
import { getModuleRegistryService } from "../xingine-react.registry";
import { ModuleHome } from "../component/layout/panel/ModuleHome";

export function mapXingineRoutes(
  data: ModuleProperties[],
  config: XingineConfig,
  layouts: Record<string, LayoutRenderer>,
): RouteObject[] {
  const layoutRoutesMap: Record<string, RouteObject[]> = {};

  // Initialize layout routes
  Object.keys(layouts).forEach(layoutType => {
    layoutRoutesMap[layoutType] = [];
  });

  for (const module of data) {
    const components = module.uiComponent && getUIComponentDetails(module.uiComponent) || [];

    // Add module home route to default layout
    layoutRoutesMap["default"].push({
      path: module.name,
      element: React.createElement(ModuleHome, module),
    });

    for (const comp of components) {
      if (!comp?.path || !comp?.component) continue;

      const element = getModuleRegistryService()?.get(
        comp.component,
        comp.meta?.properties,
      );
      if (!element) continue;

      const layoutKey = comp.layout || "default";

      if (!layoutRoutesMap[layoutKey]) layoutRoutesMap[layoutKey] = [];

      layoutRoutesMap[layoutKey].push({
        path: comp.path,
        element,
      });
    }
  }

  const routes: RouteObject[] = Object.entries(layoutRoutesMap).map(
    ([layoutName, children]) => {
      // Use the corresponding layout component based on type
      let Layout: React.FC;
      
      switch (layoutName) {
        case "default":
          Layout = () => React.createElement(
            require("../component/layout/default/DefaultLayout").DefaultLayout,
            { layout: layouts.default }
          );
          break;
        case "public":
          Layout = () => React.createElement(
            require("../component/layout/public/PublicLayout").PublicLayout,
            { layout: layouts.public }
          );
          break;
        case "custom":
          Layout = () => React.createElement(
            require("../component/layout/custom/CustomLayout").CustomLayout,
            { layout: layouts.custom }
          );
          break;
        default:
          Layout = config.layout?.[layoutName] as React.FC || 
                   (() => React.createElement(
                     require("../component/layout/default/DefaultLayout").DefaultLayout,
                     { layout: layouts.default }
                   ));
      }

      return {
        path: "/",
        element: React.createElement(Layout),
        children,
      };
    },
  );
  
  return routes;
}