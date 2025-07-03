import React, { createContext, useState, useContext, useEffect, ReactElement } from "react";
import { RouteObject } from "react-router-dom";
import {
  get,
  registerModule,
} from "../xingine-react.service";
import { getModuleRegistryService } from "../xingine-react.registry";
import { 
  getLayoutComponentRegistryService, 
  initializeLayoutComponentRegistry 
} from "../xingine-layout-registry";
import { XingineConfig } from "../configuration/Configuration";
import { mapXingineRoutes } from "./XingineContextBureau.utils";
import {
  LayoutComponentDetail,
  LayoutRenderer,
  ModuleProperties,
  modulePropertiesListDecoder,
  PanelControlContext,
  PartySeal
} from "xingine";
import { getDefaultInternalComponents } from "../component/group";
import {ColorPalette} from "./ContextBureau";

/*export interface ColorPalette {
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
  panelProps: Record<string,unknown>;
}*/

export type PanelControlBureau = PanelControlContext;

export interface XingineUIMandate {
  panelControl: PanelControlContext;
  moduleProperties?: ModuleProperties[];
  routes: RouteObject[];
  layouts: Record<string, LayoutRenderer>;
  menuItems: LayoutComponentDetail[];
  // Helper functions for rendering
  renderLayoutComponent: (component: LayoutComponentDetail, props?: any) => ReactElement | undefined;
  renderComponentTree: (components: LayoutComponentDetail[], props?: any) => ReactElement[];
  getComponentByPath: (path: string) => LayoutComponentDetail | undefined;
  hasComponent: (name: string) => boolean;
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
  const[panelControlProps, setPanelControlProps] = useState<Record<string, unknown>>({});
  const[headerActionContext,setHeaderActionContext] = useState<Record<string, unknown>>({});


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
      // Register component to layout registry
      const layoutRegistry = getLayoutComponentRegistryService();
      if (layoutRegistry && component.component) {
        try {
          layoutRegistry.register(component);
          console.log(`Registered layout component: ${component.component}`);
        } catch (error) {
          console.warn(`Failed to register layout component ${component.component}:`, error);
        }
      }

      // Register route if it has a path
      /*if (component.path) {
        const element = layoutRegistry?.renderLayoutComponent(component);
        
        if (element) {
          routesList.push({
            path: component.path,
            element,
          });
        }
      }*/

      // Add to menu items if isMenuItem is true
      /*if (component.isMenuItem) {
        menuItemsList.push(component);
      }*/

      // Process children recursively
     /* if (component.children) {
        component.children.forEach(processComponentDetail);
      }*/
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
        
        // Initialize layout component registry
        const combinedComponentRegistry = {
          ...(getDefaultInternalComponents() as Record<string, React.FC<unknown>>),
          ...(config.component || {}),
        };
        
        if (!getLayoutComponentRegistryService()) {
          initializeLayoutComponentRegistry(combinedComponentRegistry);
        }
        
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
  }, [])


  const panelControlBureau: PanelControlContext = {
    collapsed: collapsed,
    setCollapsed,
    darkMode,
    setDarkMode,
    mobileMenuVisible,
    setMobileMenuVisible,
    partySeal: defaultPartySeal,
    layoutLoading: isLoadingLayout,
    panelProps: {
        'darkMode':'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
        'lightMode': 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500',
        ...panelControlProps,
    },
    headerActionContext:headerActionContext,
    setHeaderActionContext: setHeaderActionContext,
  };

  // Helper functions for rendering
  const renderLayoutComponent = (component: LayoutComponentDetail, props?: any): ReactElement | undefined => {
    const layoutRegistry = getLayoutComponentRegistryService();
    return layoutRegistry?.renderLayoutComponent(component, props);
  };

  const renderComponentTree = (components: LayoutComponentDetail[], props?: any): ReactElement[] => {
    const layoutRegistry = getLayoutComponentRegistryService();
    return layoutRegistry?.renderComponentTree(components, props) || [];
  };

  const getComponentByPath = (path: string): LayoutComponentDetail | undefined => {
    const layoutRegistry = getLayoutComponentRegistryService();
    return layoutRegistry?.getComponentByPath(path);
  };

  const hasComponent = (name: string): boolean => {
    const layoutRegistry = getLayoutComponentRegistryService();
    return layoutRegistry?.hasComponent(name) || false;
  };

  const mandate: XingineUIMandate = {
    panelControl: panelControlBureau,
    moduleProperties: moduleProperties,
    routes: routes,
    layouts: layouts,
    menuItems: menuItems,
    renderLayoutComponent,
    renderComponentTree,
    getComponentByPath,
    hasComponent,
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

export const usePanelControlContext = (): PanelControlContext => {
  const context = useContext(XingineContext);
  if (!context) {
    throw new Error("useXingineContext must be used within a XingineContext");
  }
  const {panelControl} = context;
  return panelControl;
};

// Default layout factory functions
const createDefaultLayout = (): LayoutRenderer => ({
  type: "default",
  header: {
    meta: {
      component: "HeaderRenderer",
    },
  },
  sider: {
    meta: {
      component: "SidebarRenderer",
    },
  },
  content: {
    meta: {
      component: "ContentRenderer",
    },
  },
  footer: {
    meta: {
      component: "FooterRenderer",
    },
  },
});

const createPublicLayout = (): LayoutRenderer => ({
  type: "public",
  header: {
    meta: {
      component: "HeaderRenderer",
    },
  },
  content: {
    meta: {
      component: "ContentRenderer",
    },
  },
  footer: {
    meta: {
      component: "FooterRenderer",
    },
  },
});

const createCustomLayout = (): LayoutRenderer => ({
  type: "custom",
  content: {
    meta: {
      component: "ContentRenderer",
    },
  },
});