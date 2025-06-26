import React, {Attributes, FC, FunctionComponent, JSX} from "react";
import {getUIComponentDetails, ModuleProperties} from "xingine";
import {XingineComponentMetaMap} from "./types/renderer.types";

type ModuleRegistry = {
  moduleProperties: ModuleProperties[];
  component: Record<
    string,
    {
      name: string;
      path: string;
      props?: XingineComponentMetaMap[keyof XingineComponentMetaMap];
      fc: React.FC<unknown>;
    }
  >;
};

class ModuleRegistryService {
  private modules: ModuleRegistry = {
    moduleProperties: [],
    component: {},
  };
  private readonly componentMap: Record<string, FunctionComponent<unknown>>;

  constructor(componentMap: Record<string, FunctionComponent<unknown>>) {
    this.componentMap = componentMap;
  }

  register(moduleProperty: ModuleProperties) {
    moduleProperty.uiComponent && getUIComponentDetails(moduleProperty.uiComponent)?.forEach((component) => {
      const key = component.component;
      const Component = this.componentMap[key];
      let fc: React.FC<unknown>;
      if (Component) {
        fc = Component;
      } else {
        console.error(
          `Component '${key}' not found in component map, mapping to default component from meta ${component.meta?.component}.`,
        );
        if (!component.meta?.component) {
          throw Error(`Component '${key}' not found in component map.`);
        }
        const metaComponent = component.meta?.component!;

        fc = this.componentMap[metaComponent];
        //throw Error(`Component '${key}' not found in component map.`);
      }

      this.modules.component[key] = {
        name: key,
        path: component.path,
        props: component.meta?.properties,
        fc: fc,
      };
    });
    this.modules.moduleProperties.push(moduleProperty);
  }

  get(
    name: string,
    props?: XingineComponentMetaMap[keyof XingineComponentMetaMap],
  ): JSX.Element | undefined {
    const Component = this.modules.component[name];
    if (!Component) return undefined;
    return React.createElement<XingineComponentMetaMap[keyof XingineComponentMetaMap]>(Component.fc, props);
  }


  getAll(): ModuleRegistry {
    return this.modules;
  }

  getComponentPath(name: string): string {
    const componentProperty = this.modules.component[name];
    return componentProperty?.path ?? "notFound";
  }
}

let instance: ModuleRegistryService | null = null;

export function initializeModuleRegistry(
  componentMap: Record<string, FunctionComponent<unknown>>,
) {
  if (instance) {
    throw new Error("ModuleRegistryService is already initialized");
  }
  instance = new ModuleRegistryService(componentMap);
}

export function getModuleRegistryService(): ModuleRegistryService | undefined {
  if (!instance) {
    return undefined;
  }
  return instance;
}
