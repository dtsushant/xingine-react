import React, {useMemo, useContext} from 'react';
import {extrapolate, StyleMeta} from "xingine";
import {useActionExecutionContext} from "../../context/HierarchicalActionContext";

type DangerousRenderProps = {
    content?: string;
    style?: StyleMeta;
};

export const DangerousRenderer: React.FC<DangerousRenderProps> = ({ content, style }) => {
    if (!content) return null;

    const actionExecutionContext = useActionExecutionContext();
    
    // Access component state directly from action execution context
    // This will give us access to ALL component stores in the content context
    const componentStores = actionExecutionContext.content.getComponentStateStore ? 
        (() => {
            try {
                // Try to get all component stores
                const allStores: Record<string, unknown> = {};
                ['simpleCounter', 'simpleToggle', 'simpleInput'].forEach(componentId => {
                    try {
                        const store = actionExecutionContext.content.getComponentStateStore(componentId);
                        if (store) {
                            allStores[componentId] = store.getState(componentId);
                        }
                    } catch {
                        // Component store not found, continue
                    }
                });
                return allStores;
            } catch {
                return {};
            }
        })() : {};
    
    // Combine all available state for interpolation
    const combinedState = useMemo(() => ({
        ...actionExecutionContext.global.getAllState(),
        ...actionExecutionContext.content.getAllContentState?.(),
        ...componentStores
    }), [actionExecutionContext, componentStores]);

    const dangerContent = useMemo(() => {
        return content ? extrapolate(content, combinedState) : '';
    }, [content, combinedState]);

    return (
            <div dangerouslySetInnerHTML={{ __html: dangerContent }} />
        );
};