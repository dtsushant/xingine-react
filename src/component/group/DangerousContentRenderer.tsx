import React, {useMemo} from 'react';
import {extrapolate, StyleMeta} from "xingine";
import {useAllSharedState} from "../../context/ActionContextBureau";
type DangerousRenderProps = {
    content?: string;
    style?: StyleMeta;
};

export const DangerousRenderer: React.FC<DangerousRenderProps> = ({ content, style }) => {
    if (!content) return null;

    const allSharedState = useAllSharedState();
    const dangerContent = useMemo(() => {
        return content ? extrapolate(content,allSharedState ) : '';
    }, [content, allSharedState]);

    return (
            <div dangerouslySetInnerHTML={{ __html: dangerContent }} />
        );
};