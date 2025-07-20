import React, {createContext, useState, useContext, useEffect, ReactElement, useRef, useSyncExternalStore} from "react";
import {RouteObject, useNavigate} from "react-router-dom";
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
import {getAllMappedComponents, mapXingineRoutes} from "./XingineContextBureau.utils";
import {
  ActionContext, ActionContextRegistry, ActionContextSubscribers,
  LayoutComponentDetail,
  LayoutRenderer,
  ModuleProperties,
  modulePropertiesListDecoder,
  PanelControlContext,
  PartySeal
} from "xingine";
import { getDefaultInternalComponents } from "../component/group";
import {ColorPalette} from "./ContextBureau";



export type PanelControlBureau = PanelControlContext;

export interface XingineUIMandate {
  panelControl: PanelControlContext;
  moduleProperties?: ModuleProperties[];
  routes: RouteObject[];
  layouts: Record<string, LayoutRenderer>;
  menuItems: LayoutComponentDetail[];
  allMappedComponents:Record<string, React.ComponentType<unknown>>;
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
          processComponentDetail(layoutRenderer.content.meta[0]);
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
      if (layoutRegistry && component.meta?.component) {
        try {
          layoutRegistry.register(component);
          console.log(`Registered layout component: ${component.meta.component}`);
        } catch (error) {
          console.warn(`Failed to register layout component ${component.meta.component}:`, error);
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

        setRoutes([...mapXingineRoutes(data, config, allLayouts),...(config.additionalRoutes || [])]);
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
    allMappedComponents: {...getDefaultInternalComponents(),...config.component},
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

    },
  },
  content: {
    meta: [],
  },
  sider:{

  },
  footer:{

  }
});

const createPublicLayout = (): LayoutRenderer => ({
  type: "public",
  header: {

  },
  content: {
    meta: [],
  },
  footer: {

  },
});

const createCustomLayout = (): LayoutRenderer => ({
  type: "custom",
  content: {
    meta: [],
  },
});