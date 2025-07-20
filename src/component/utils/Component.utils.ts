import React, {ComponentType, CSSProperties, lazy, LazyExoticComponent, useMemo} from "react";
import {
  ComponentMetaMap,
  EventBindings,
  extrapolate,
  getActionRef,
  getTypedValue,
  LayoutComponentDetail, runAction
} from "xingine";
import {usePanelControlContext, useXingineContext} from "../../context/XingineContextBureau";
import {useActionContext, useAllSharedState} from "../../context/ActionContextBureau";


export function lazyLoadComponent<K extends keyof ComponentMetaMap>(
    componentName: string,
) {
  return lazy(() =>
      import(`../group/${componentName}.tsx`).then((module) => {
        if (!module.default) {
          throw new Error(
              `Dynamic import failed: ${componentName} has no default export`,
          );
        }
        return { default: module.default as ComponentType<{
            meta: ComponentMetaMap[K];
          }> };
      }),
  );
}

export function getBreadcrumbs(
  path: string,
): { title: string; path: string }[] {
  const parts = path.split("/").filter(Boolean);

  return parts.map((part, index) => ({
    title: part.charAt(0).toUpperCase() + part.slice(1),
    path: "/" + parts.slice(0, index + 1).join("/"),
  }));
}

export function safeSluggedRoute(route: string): string {
  return route.replace(/:([a-zA-Z0-9_.]+)/g, (_, key) => {
    return ":" + key.replace(/\./g, "_"); // → ":user_username"
  });
}

export function nestParamsSluggedParams(
  flat: Record<string, string | undefined>,
  separator = "_",
): Record<string, unknown> {
  const nested: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const keys = key.split(separator);
    let current = nested;

    for (let i = 0; i < keys.length - 1; i++) {
      const part = keys[i];
      if (!(part in current)) current[part] = {};
      current = current[part] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
  }

  return nested;
}

export function toCSSProperties(style?: Record<string, unknown>): CSSProperties {
  if (!style || typeof style !== 'object') return {};

  const result: CSSProperties = {};

  for (const [key, value] of Object.entries(style)) {
    // only keep keys that exist in React.CSSProperties
   // if (key in ({} as CSSProperties)) {
      // Basic check: allow string, number, null, or undefined
      if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          value === null ||
          value === undefined
      ) {
        result[key as keyof CSSProperties] = value as any;
      } else {
        console.warn(`Discarded style property "${key}" with unsafe value:`, value);
      }
    /*} else {
      console.warn(`Discarded unknown CSS property: "${key}"`);
    }*/
  }

  return result;
}

/*export function toCSSClassName(classes?: string): string {
  const { panelProps, darkMode } = usePanelControlContext();

  const baseClass = classes ? extrapolate(classes, panelProps) : "";


  return baseClass;
}*/

export function toCSSClassName(classes?: string): string {
  //const { headerActionContext } = usePanelControlContext();
  const allSharedState = useAllSharedState();

  return useMemo(() => {
    return classes ? extrapolate(classes, allSharedState) : '';
  }, [classes, allSharedState]);
}

export function getAllComponentMap():Record<string, ComponentType<any>>{
    const { allMappedComponents } = useXingineContext();
    return allMappedComponents;
}

export function bindMultipleEvents(
    bindings?: EventBindings,
    scope?: Record<string, unknown>
): Record<string, (...args: unknown[]) => void> {
  const result: Record<string, (...args: unknown[]) => void> = {};
  if (!bindings) return result;
  const context = useActionContext();
    if (!context) {
        console.warn("No ActionContext available for event bindings");
        return result;
    }
  for (const [eventName, action] of Object.entries(bindings)) {
    result[eventName] = (...args: unknown[]) => {
      runAction(action , context, args[0]);
    };
  }
  return result;
}

