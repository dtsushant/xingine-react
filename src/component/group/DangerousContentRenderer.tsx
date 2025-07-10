import React, {useMemo} from 'react';
import {extrapolate, StyleMeta} from "xingine";
import {usePanelControlContext} from "../../context/XingineContextBureau";
type DangerousRenderProps = {
    content?: string;
    style?: StyleMeta;
};

export const DangerousRenderer: React.FC<DangerousRenderProps> = ({ content, style }) => {
    if (!content) return null;

    const {headerActionContext} = usePanelControlContext();

    const dangerContent = useMemo(() => {
        return content ? extrapolate(content, headerActionContext) : '';
    }, [content, headerActionContext]);

    return (
            <div dangerouslySetInnerHTML={{ __html: dangerContent }} />
        );
};