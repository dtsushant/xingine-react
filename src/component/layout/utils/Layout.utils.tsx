import React, {FunctionComponent, useEffect, useRef} from 'react';

import {EventBindings, LayoutComponentDetail, runAction, SerializableAction} from "xingine";
import {getAllComponentMap} from "../../utils/Component.utils";
import {useActionExecutionContext, ComponentStateProvider} from "../../../context/HierarchicalActionContext";

export const onInitRegister = (actions: SerializableAction[], actionContext: any) => {
    actions.forEach(action => {
        console.info("registering the action", action);
        runAction(action, actionContext);
    });
};

export interface ComponentScope{
    parent: string;
    current: string;
    [key:string]: unknown;
}

export interface LayoutComponentDetailExtended extends LayoutComponentDetail {
    scope: ComponentScope;
}

export interface EmptyLayoutComponentDetail {
    meta?: undefined;
    scope: ComponentScope;
}

/**
 * Initializes a LayoutComponentDetail with scope information
 * 
 * @param {LayoutComponentDetail} componentDetail - The original layout component detail
 * @param {string} initializer - The parent value to set in the ComponentScope
 * @returns {LayoutComponentDetailExtended} The extended component detail with scope
 */
export const initComponentDetailWithScope = (
    componentDetail: LayoutComponentDetail | undefined, 
    initializer: string
): LayoutComponentDetailExtended | EmptyLayoutComponentDetail => {
    const scope: ComponentScope = {
        parent: "__",
        current: initializer
    };
    
    if (!componentDetail) {
        return {
            scope
        };
    }

    return {
        ...componentDetail,
        scope
    };
};

/**
 * Builds an extended component detail with custom parent and current values
 * 
 * @param {LayoutComponentDetail} componentDetail - The original layout component detail
 * @param {string} parent - The parent value for the ComponentScope
 * @param {string} current - The current value for the ComponentScope
 * @returns {LayoutComponentDetailExtended} The extended component detail with scope
 */
export const buildExtendedComponentDetail = (
    componentDetail: LayoutComponentDetail,
    parent: string,
    current: string
): LayoutComponentDetailExtended => {
    const componentName = componentDetail.meta?.component || '';
    const scope: ComponentScope = {
        parent: current,  // Set parent to the current value
        current: `${current}.${componentName}`  // Concatenate current with component name using a dot
    };
    
    return {
        ...componentDetail,
        scope
    };
};

/**
 * RenderComponent is a React functional component that renders a layout component
 * based on the provided meta information. It handles initialization actions and
 * ensures that the component is rendered with its properties.
 *
 * @param {LayoutComponentDetail} component - The layout component detail containing metadata.
 * @returns {JSX.Element | null} The rendered component or null if not found.
 */

export const RenderComponent: React.FC<LayoutComponentDetailExtended | EmptyLayoutComponentDetail> = (component) => {
    // ✅ HOOKS MUST BE CALLED IN THE SAME ORDER EVERY TIME
    const { meta } = component;
    const actionContext = useActionExecutionContext();
    const hasRunInit = useRef<Record<string, boolean>>({});

    // ✅ Always call useEffect - no conditional hook calls
    useEffect(() => {
        if (!meta) return;
        const compId = meta.component || 'unknown';
        if (hasRunInit.current[compId]) return;

        const events = meta.properties?.event as EventBindings;
        const init = events?.onInit;
        if (init) {
            runAction(init, actionContext);
            hasRunInit.current[compId] = true;
        }
    }, [meta, actionContext]);

    // ✅ Always get component map - no conditional calls
    const compMap = getAllComponentMap();
    
    // ✅ Early return AFTER all hooks are called
    if (!meta || !meta.component || !compMap[meta.component]) {
        // console.warn(`Component "${meta?.component}" not found in component map.`);
        return null;
    }

    const Comp = compMap[meta.component];
    
    // Use specific componentId from properties if provided, otherwise generate unique ID for state isolation
    const componentId = (meta?.properties?.componentId as string) || `${meta.component}_${Math.random().toString(36).substr(2, 9)}`;
    return (
        <ComponentStateProvider componentId={componentId}>
            {Comp && <ComponentRenderer Component={Comp} props={meta?.properties} scope={component.scope} />}
        </ComponentStateProvider>
    );
};

const ComponentRenderer = ({ 
    Component, 
    props, 
    scope 
}: { 
    Component?: React.ComponentType<any>, 
    props?: Record<string, unknown>,
    scope?: ComponentScope 
}) => {
    if (!Component) return null;
    return <Component {...props} scope={scope} />;
};