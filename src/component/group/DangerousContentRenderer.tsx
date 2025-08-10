import React, {useMemo, useContext, useCallback} from 'react';
import {extrapolate, StyleMeta} from "xingine";
import {useActionExecutionContext} from "../../context/HierarchicalActionContext";

type DangerousRenderProps = {
    content?: string;
    style?: StyleMeta;
};

// Memoized component to prevent unnecessary re-renders
const DangerousRendererBase: React.FC<DangerousRenderProps> = ({ content, style }) => {
    if (!content) return null;

    const actionExecutionContext = useActionExecutionContext();
    
    // Optimize state gathering - only get what we need and memoize it
    const stateData = useMemo(() => {
        const globalState = actionExecutionContext.global.getAllState();
        const contentState = actionExecutionContext.content.getAllContentState?.() || {};
        
        // Only try to get component stores if the content contains component references
        const needsComponentStores = content.includes('${') && (content.includes('simpleCounter') || content.includes('simpleToggle') || content.includes('simpleInput'));
        
        let componentStores: Record<string, unknown> = {};
        if (needsComponentStores && actionExecutionContext.content.getComponentStateStore) {
            try {
                ['simpleCounter', 'simpleToggle', 'simpleInput'].forEach(componentId => {
                    try {
                        const store = actionExecutionContext.content.getComponentStateStore(componentId);
                        if (store) {
                            componentStores[componentId] = store.getAllState();
                        }
                    } catch {
                        // Component store not found, continue
                    }
                });
            } catch {
                // Safe fallback
                componentStores = {};
            }
        }
        
        return {
            ...globalState,
            ...contentState,
            ...componentStores
        };
    }, [actionExecutionContext, content]);

    const dangerContent = useMemo(() => {
        return content ? extrapolate(content, stateData) : '';
    }, [content, stateData]);

    return (
        <div dangerouslySetInnerHTML={{ __html: dangerContent }} />
    );
};

// Export memoized version with shallow comparison
export const DangerousRenderer = React.memo(DangerousRendererBase, (prevProps, nextProps) => {
    // Only re-render if content actually changes
    return prevProps.content === nextProps.content && 
           JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style);
});