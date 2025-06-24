import React, { createContext, useState, useContext, useEffect } from "react";
import { RouteObject } from "react-router-dom";
import {
  get,
  registerModule,
} from "../xingine-react.service";
import { getModuleRegistryService } from "../xingine-react.registry";
import { XingineConfig } from "../configuration/Configuration";
import { mapXingineRoutes } from "./XingineContextBureau.utils";
import { ModuleProperties, modulePropertiesListDecoder } from "xingine";
import { UIComponent, LayoutComponentDetail, LayoutRenderer } from "../types/renderer.types";

export interface ColorPalette {
  [key: string]: string;
}

export interface PartySeal {
  emblemUrl: string;
  motto: string;
  colorPalette: ColorPalette;
  issuedBy: string;
}

export interface PanelControlBureau {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuVisible: boolean;
  setMobileMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  partySeal: PartySeal;
  layoutLoading: boolean;
}

export interface XingineUIMandate {
  panelControl: PanelControlBureau;
  moduleProperties?: ModuleProperties[];
  routes: RouteObject[];
  layouts: Record<string, LayoutRenderer>;
  menuItems: LayoutComponentDetail[];
}

export const XingineContext = createContext<XingineUIMandate | null>(null);

const defaultColorPalette: ColorPalette = {
  primary: "#6f42c1",
  secondary: "#fd7e14",
  background: "#f8f9fa",
  surface: "#ffffff",
  accent: "#17a2b8",
};

const defaultPartySeal: PartySeal = {
  emblemUrl: "/assets/default-emblem.svg",
  motto: "Unity, Integrity, Progress",
  colorPalette: defaultColorPalette,
  issuedBy: "Commissar Authority",
};

export const XingineContextBureau: React.FC<{
  children: React.ReactNode;
  config: XingineConfig;
}> = ({ children, config }) => {
  const [moduleProperties, setModuleProperties] = useState<
    ModuleProperties[] | undefined
  >(undefined);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [layoutError, setLayoutError] = useState<Error | null>(null);
  const [routes, setRoutes] = useState<RouteObject[]>([]);
  const [layouts, setLayouts] = useState<Record<string, LayoutRenderer>>({});
  const [menuItems, setMenuItems] = useState<LayoutComponentDetail[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // Register components and routes based on LayoutComponentDetail
  const registerComponentsAndRoutes = (components: any[]): { routes: RouteObject[], menuItems: LayoutComponentDetail[] } => {
    const routesList: RouteObject[] = [];
    const menuItemsList: LayoutComponentDetail[] = [];

    const processComponent = (component: any) => {
      if (component && typeof component === 'object' && 'type' in component) {
        // This is a LayoutRenderer
        const layoutRenderer = component as LayoutRenderer;
        // Process header, content, sider, footer recursively
        if (layoutRenderer.header?.meta) {
          processComponentDetail(layoutRenderer.header.meta);
        }
        if (layoutRenderer.content?.meta) {
          processComponentDetail(layoutRenderer.content.meta);
        }
        if (layoutRenderer.sider?.meta) {
          processComponentDetail(layoutRenderer.sider.meta);
        }
        if (layoutRenderer.footer?.meta) {
          processComponentDetail(layoutRenderer.footer.meta);
        }
      } else if (component && typeof component === 'object') {
        // This might be a LayoutComponentDetail or other component
        processComponentDetail(component as LayoutComponentDetail);
      }
    };

    const processComponentDetail = (component: LayoutComponentDetail) => {
      // Register component to module registry if it has a component name
      if (component.component && component.meta) {
        // This will be handled by the module registry service
        console.log(`Registering component: ${component.component}`);
      }

      // Register route if it has a path
      if (component.path) {
        const element = getModuleRegistryService()?.get(
          component.component,
          component.meta?.properties
        );
        
        if (element) {
          routesList.push({
            path: component.path,
            element,
          });
        }
      }

      // Add to menu items if isMenuItem is true
      if (component.isMenuItem) {
        menuItemsList.push(component);
      }

      // Process children recursively
      if (component.children) {
        component.children.forEach(processComponentDetail);
      }
    };

    components.forEach(processComponent);
    
    return { routes: routesList, menuItems: menuItemsList };
  };

  // Fetch component definitions and setup routes
  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setIsLoadingLayout(true);
        setLayoutError(null);

        const data = await get<ModuleProperties[]>(
          modulePropertiesListDecoder,
          "modules",
        );
        setModuleProperties(data);
        
        if (!getModuleRegistryService() && data) {
          registerModule(config, data!);
        }

        // Process all module components to extract routes and menu items
        let allRoutes: RouteObject[] = [];
        let allMenuItems: LayoutComponentDetail[] = [];
        let allLayouts: Record<string, LayoutRenderer> = {};

        for (const module of data) {
          if (module.uiComponent) {
            const { routes: moduleRoutes, menuItems: moduleMenuItems } = registerComponentsAndRoutes(module.uiComponent);
            allRoutes = [...allRoutes, ...moduleRoutes];
            allMenuItems = [...allMenuItems, ...moduleMenuItems];
          }
        }

        // Set up default layouts
        allLayouts = {
          default: createDefaultLayout(),
          public: createPublicLayout(),
          custom: createCustomLayout(),
        };

        setRoutes(mapXingineRoutes(data, config, allLayouts));
        setLayouts(allLayouts);
        setMenuItems(allMenuItems);
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

    fetchModuleData();
  }, []);

  const panelControlBureau: PanelControlBureau = {
    collapsed: collapsed,
    setCollapsed,
    darkMode,
    setDarkMode,
    mobileMenuVisible,
    setMobileMenuVisible,
    partySeal: defaultPartySeal,
    layoutLoading: isLoadingLayout,
  };

  const mandate: XingineUIMandate = {
    panelControl: panelControlBureau,
    moduleProperties: moduleProperties,
    routes: routes,
    layouts: layouts,
    menuItems: menuItems,
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

// Default layout factory functions
const createDefaultLayout = (): LayoutRenderer => ({
  type: "default",
  header: {
    meta: {
      component: "HeaderRenderer",
      isMenuItem: false,
      children: [],
    },
  },
  sider: {
    meta: {
      component: "SidebarRenderer",
      isMenuItem: false,
      children: [],
    },
  },
  content: {
    meta: {
      component: "ContentRenderer",
      isMenuItem: false,
      children: [],
    },
  },
  footer: {
    meta: {
      component: "FooterRenderer",
      isMenuItem: false,
      children: [],
    },
  },
});

const createPublicLayout = (): LayoutRenderer => ({
  type: "public",
  header: {
    meta: {
      component: "HeaderRenderer",
      isMenuItem: false,
      children: [],
    },
  },
  content: {
    meta: {
      component: "ContentRenderer",
      isMenuItem: false,
      children: [],
    },
  },
  footer: {
    meta: {
      component: "FooterRenderer",
      isMenuItem: false,
      children: [],
    },
  },
});

const createCustomLayout = (): LayoutRenderer => ({
  type: "custom",
  content: {
    meta: {
      component: "ContentRenderer",
      isMenuItem: false,
      children: [],
    },
  },
});