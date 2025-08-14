import React, {useEffect, useMemo, useState} from "react";
import {ConditionalExpression, ConditionalMeta, evaluateCondition} from "xingine";
import {useGlobalState, useContentState, useComponentState} from "../../context/HierarchicalActionContext";
import {buildExtendedComponentDetail, ComponentScope, RenderComponent} from "../layout/utils/Layout.utils";


interface ConditionalMetaExtended extends ConditionalMeta {
    scope: ComponentScope;
}

export function extractFieldsFromCondition(
    condition?: ConditionalExpression,
): string[] {
    const fields = new Set<string>();

    const walk = (cond?: ConditionalExpression) => {
        if (!cond) return;

        if ("field" in cond && typeof cond.field === "string") {
            fields.add(cond.field);
        }

        if ("and" in cond && Array.isArray(cond.and)) {
            cond.and.forEach(walk);
        }

        if ("or" in cond && Array.isArray(cond.or)) {
            cond.or.forEach(walk);
        }
    };

    walk(condition);
    return [...fields];
}

export function useReactiveCondition(
    condition: ConditionalExpression,
    evaluate: (
        condition: ConditionalExpression,
        state: Record<string, unknown>,
    ) => boolean,
): boolean {
    const fields = extractFieldsFromCondition(condition);
    const globalState = useGlobalState();
    const contentState = useContentState();

    // Helper function to get state value from appropriate scope
    const getStateValue = (field: string) => {
        // Try global state first, then content state
        const globalValue = globalState.getState(field);
        if (globalValue !== undefined) {
            return globalValue;
        }
        return contentState.getState(field);
    };

    const values: Record<string, unknown> = {};
    for (const field of fields) {
        values[field] = getStateValue(field);
    }

    return useMemo(() => {
        return evaluate(condition, values);
    }, [condition, ...fields.map((f) => values[f])]);
}
export const ConditionalRenderer: React.FC<ConditionalMetaExtended> = (
    meta,
) => {
    const { condition, trueComponent, falseComponent, scope } = meta;

    const predicate = useReactiveCondition(condition, evaluateCondition);

    const component = predicate
        ? trueComponent.meta?.component && trueComponent
        : falseComponent?.meta?.component && falseComponent;
    return component && <RenderComponent {...buildExtendedComponentDetail(component,scope.parent,scope.current)} />;
};

