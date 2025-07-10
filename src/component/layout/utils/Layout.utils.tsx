import React from 'react';

import {LayoutComponentDetail} from "xingine";
import {getAllComponentMap} from "../../utils/Component.utils";

export const RenderComponent: React.FC<LayoutComponentDetail> = (component) => {
    const {meta} = component;
    if (!component) return null;

    if(!meta) return null;

    const compMap = getAllComponentMap();

    const Comp = compMap[meta.component];

    return (
        <>
            {Comp && <Comp {...meta?.properties} />}
        </>
    );
};