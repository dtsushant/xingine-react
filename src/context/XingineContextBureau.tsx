import React, {createContext, useState, useContext, useEffect, ReactElement, useRef, useSyncExternalStore} from "react";
import {RouteObject} from "react-router-dom";
import {
  get,
} from "../xingine-react.service";

import { XingineConfig } from "../configuration/Configuration";
import {getRoutesFromLayout} from "./XingineContextBureau.utils";
import {
  LayoutRenderer,  layoutRendererListDecoder,
} from "xingine";
import { getDefaultInternalComponents } from "../component/group";




export interface XingineUIMandate {
  routes: RouteObject[];
  allMappedComponents:Record<string, React.ComponentType<unknown>>;
}

export const XingineContext = createContext<XingineUIMandate | null>(null);


export const XingineContextBureau: React.FC<{
  children: React.ReactNode;
  config: XingineConfig;
}> = ({ children, config }) => {


  const[layoutRendererList, setLayoutRendererList] = useState<LayoutRenderer[]>([]);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [layoutError, setLayoutError] = useState<Error | null>(null);
  const [routes, setRoutes] = useState<RouteObject[]>([]);

  // Register components and routes based on LayoutComponentDetail

  // Fetch component definitions and setup routes
  useEffect(() => {
    const fetchAllRenderers = async () => {
      try {
        setIsLoadingLayout(true);
        setLayoutError(null);

        const data = await get<LayoutRenderer[]>(
          layoutRendererListDecoder,
          "commissars",
        );

        setLayoutRendererList(data);

        // Process all module components to extract routes and menu items
        const allRoutes: RouteObject[] = data.reduce<RouteObject[]>((acc: RouteObject[], layoutRenderer: LayoutRenderer) => {
          return [...acc, ...getRoutesFromLayout(layoutRenderer)];
        }, []);

        setRoutes([...allRoutes, ...(config.additionalRoutes || [])]);

      } catch (err) {
        console.error("Failed to fetch module properties for layout:", err);
        setLayoutError(
          err instanceof Error
            ? err
            : new Error("An unknown error occurred during layout data fetch."),
        );
      } finally {
        setIsLoadingLayout(false);
      }
    };

    fetchAllRenderers();
  }, [])




  const mandate: XingineUIMandate = {
    routes: routes,
    allMappedComponents: {...getDefaultInternalComponents(),...config.component},
  };

  if (isLoadingLayout) {
    return <div>Loading layout...</div>;
  }

  if (layoutError) {
    return <div>Error loading layout: {layoutError.message}</div>;
  }

  return (
    <XingineContext.Provider value={mandate}>
      {children}
    </XingineContext.Provider>
  );
};

export const useXingineContext = (): XingineUIMandate => {
  const context = useContext(XingineContext);
  if (!context) {
    throw new Error("useXingineContext must be used within a XingineContext");
  }
  return context;
};
