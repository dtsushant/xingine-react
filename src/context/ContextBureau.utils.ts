import React from "react";
import { RouteObject } from "react-router-dom";
import {getUIComponentDetails, ModuleProperties} from "xingine";
import { XingineConfig } from "../configuration/Configuration";
import { getModuleRegistryService } from "../xingine-react.registry";
import { LayoutRenderer } from "../component/layout";
import { ModuleHome } from "../component/layout/panel/ModuleHome";

export function mapDynamicRoutes(
  data: ModuleProperties[],
  config: XingineConfig,
): RouteObject[] {
  const layoutRoutesMap: Record<string, RouteObject[]> = {};

  layoutRoutesMap["default"] = [];
  for (const module of data) {
    const components = module.uiComponent && getUIComponentDetails(module.uiComponent) || [];

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
      const Layout: React.FC =
        layoutName === "default"
          ? LayoutRenderer
          : (config.layout?.[layoutName] as React.FC) || LayoutRenderer;

      return {
        path: "/",
        element: React.createElement(Layout),
        children,
      };
    },
  );
  return routes;
}
