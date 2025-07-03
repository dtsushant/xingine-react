import React from 'react';
import {StyleMeta} from "xingine";
import {toCSSClassName, toCSSProperties} from "../utils/Component.utils";

type DangerousRenderProps = {
    content?: string;
    style?: StyleMeta;
};

export const DangerousRenderer: React.FC<DangerousRenderProps> = ({ content, style }) => {
    if (!content) return null;

    return (
            <div dangerouslySetInnerHTML={{ __html: content }} />
        );
};