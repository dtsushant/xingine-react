import React, {FunctionComponent, useEffect, useRef} from 'react';

import {EventBindings, LayoutComponentDetail, runAction, SerializableAction} from "xingine";
import {getAllComponentMap} from "../../utils/Component.utils";
import {useActionContext} from "../../../context/ActionContextBureau";

export const onInitRegister = (actions: SerializableAction[], actionContext: any) => {
    actions.forEach(action => {
        runAction(action, actionContext);
    });
};

export const RenderComponent: React.FC<LayoutComponentDetail> = (component) => {
    const { meta } = component;
    const actionContext = useActionContext();
    const hasRunInit = useRef<Record<string, boolean>>({});

    useEffect(() => {
        if (!meta) return;
        const compId = meta.component;
        if (hasRunInit.current[compId]) return;

        const events = meta.properties?.event as EventBindings;
        const init = events?.onInit;
        if (init) {
            runAction(init, actionContext);
            hasRunInit.current[compId] = true;
        }
    }, [meta, actionContext]);

    const compMap = getAllComponentMap();
    if( !meta || !meta.component || !compMap[meta.component]) {
        console.warn(`Component "${meta?.component}" not found in component map.`);
        return null;
    }

    const Comp =  compMap[meta?.component];
    return Comp && <ComponentRenderer Component={Comp} props={meta?.properties} />;
};

const ComponentRenderer = ({ Component, props }: { Component?: React.ComponentType<any>, props?: Record<string, unknown> }) => {
    if (!Component) return null;
    return <Component {...props} />;
};