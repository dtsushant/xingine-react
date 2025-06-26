import React, { FunctionComponent, ReactElement } from "react";
import {ComponentMetaMap, LayoutComponentDetail} from "xingine";

type LayoutComponentRegistry = {
  layoutComponents: LayoutComponentDetail[];
  component: Record<
    string,
    {
      name: string;
      path?: string;
      isMenuItem?: boolean;
      content?: string;
      children?: LayoutComponentDetail[];
      meta?: any;
      fc: React.FC<unknown>;
    }
  >;
};

class LayoutComponentRegistryService {
  private layouts: LayoutComponentRegistry = {
    layoutComponents: [],
    component: {},
  };
  private readonly componentMap: Record<string, FunctionComponent<unknown>>;

  constructor(componentMap: Record<string, FunctionComponent<unknown>>) {
    this.componentMap = componentMap;
    
    // Debug logging to help troubleshoot component registration issues
    console.log('LayoutComponentRegistryService initialized with components:', 
      Object.keys(componentMap).sort());
  }

  register(layoutComponent: LayoutComponentDetail) {
    const key = layoutComponent.component;
    const Component = this.componentMap[key];
    let fc: React.FC<unknown>;
    
    if (Component) {
      fc = Component;
    } else {
      // Check if we have a meta component to use instead
      if (!layoutComponent.meta?.component) {
        console.error(
          `Component '${key}' not found in component map and no meta component specified.`,
        );
        throw Error(`Component '${key}' not found in component map.`);
      }
      const metaComponent = layoutComponent.meta?.component!;
      fc = this.componentMap[metaComponent];
      if (!fc) {
        console.error(
          `Neither component '${key}' nor meta component '${metaComponent}' found in component map.`,
        );
        throw Error(`Meta component '${metaComponent}' not found in component map.`);
      }
      console.info(
        `Component '${key}' not found directly, using meta component '${metaComponent}'.`,
      );
    }

    this.layouts.component[key] = {
      name: key,
      content: layoutComponent.content,
      meta: layoutComponent.meta,
      fc: fc,
    };

    // Register children recursively
   /* if (layoutComponent.children) {
      layoutComponent.children.forEach(child => this.register(child));
    }*/

    this.layouts.layoutComponents.push(layoutComponent);
  }

  get(
    name: string,
    props?: ComponentMetaMap[keyof ComponentMetaMap],
  ): ReactElement | undefined {
    const Component = this.layouts.component[name];
    if (!Component) return undefined;
    return React.createElement<ComponentMetaMap[keyof ComponentMetaMap]>(Component.fc, props);
  }

  // Helper function to render a LayoutComponentDetail
  renderLayoutComponent(
    layoutComponent: LayoutComponentDetail,
    additionalProps?: any
  ): ReactElement | undefined {
    const Component = this.layouts.component[layoutComponent.component];
    if (!Component) {
      console.warn(`Component '${layoutComponent.component}' not found in registry`);
      return undefined;
    }

    const props = {
      ...layoutComponent.meta?.properties,
      ...additionalProps,
      layoutComponent, // Pass the full layout component for recursive rendering
    };

    return React.createElement(Component.fc, props);
  }

  // Helper function to get all menu items
  getMenuItems(): LayoutComponentDetail[] {
    return [];//this.layouts.layoutComponents.filter(comp => comp.isMenuItem);
  }

  // Helper function to get component by path
  getComponentByPath(path: string): LayoutComponentDetail | undefined {
    return undefined //this.layouts.layoutComponents.find(comp => comp.path === path);
  }

  // Helper function to get all routes
  getRoutes(): Array<{ path: string; component: LayoutComponentDetail }> {
    return [];/*this.layouts.layoutComponents
      .filter(comp => comp.path)
      .map(comp => ({ path: comp.path!, component: comp }));*/
  }

  getAll(): LayoutComponentRegistry {
    return this.layouts;
  }

  getComponentPath(name: string): string {
    const componentProperty = this.layouts.component[name];
    return componentProperty?.path ?? "notFound";
  }

  // Helper function to check if component exists
  hasComponent(name: string): boolean {
    return !!this.layouts.component[name];
  }

  // Helper function to get component metadata
  getComponentMeta(name: string): any {
    return this.layouts.component[name]?.meta;
  }

  // Helper function to render a tree of layout components
  renderComponentTree(
    components: LayoutComponentDetail[],
    additionalProps?: any
  ): ReactElement[] {
    return components
      .map(comp => this.renderLayoutComponent(comp, additionalProps))
      .filter(Boolean) as ReactElement[];
  }
}

let layoutInstance: LayoutComponentRegistryService | null = null;

export function initializeLayoutComponentRegistry(
  componentMap: Record<string, FunctionComponent<unknown>>,
) {
  if (layoutInstance) {
    throw new Error("LayoutComponentRegistryService is already initialized");
  }
  layoutInstance = new LayoutComponentRegistryService(componentMap);
}

export function getLayoutComponentRegistryService(): LayoutComponentRegistryService | undefined {
  if (!layoutInstance) {
    return undefined;
  }
  return layoutInstance;
}

// Helper function to reset the registry (useful for testing)
export function resetLayoutComponentRegistry() {
  layoutInstance = null;
}