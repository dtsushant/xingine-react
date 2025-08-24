import React from 'react';
import { Input } from 'antd';
import {bindMultipleEvents, toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {IconRenderer} from "./IconRenderer";
import {InputMeta} from "xingine";


interface InputMetaExtended extends InputMeta {
    scope?:Record<string, unknown>
}
export const InputRenderer: React.FC<InputMetaExtended> = (meta) => {
    const {name, style, placeholder,event, scope,icon} = meta;
    return (
        <Input
            className = {toCSSClassName(style?.className)}
            style={toCSSProperties(style?.style)}
            placeholder={placeholder}
            prefix={icon && <IconRenderer {...icon} />}
            {...bindMultipleEvents(event, scope)}/>
    )
};

export default InputRenderer;