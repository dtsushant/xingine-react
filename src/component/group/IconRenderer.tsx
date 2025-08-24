import {IconMeta} from "xingine";
import * as AntIcons from '@ant-design/icons';
import {QuestionCircleOutlined} from "@ant-design/icons";
import {SvgRenderer} from "./SvgRenderer";
import {bindMultipleEvents, toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import React from "react";

interface IconMetaExtended extends IconMeta {
    scope?:Record<string, unknown>
}

export const IconRenderer:React.FC<IconMetaExtended> = (props: IconMetaExtended) => {
    const {
        name,
        color,
        size,
        svg,
        spin,
        rotate,
        event,
        twoToneColor,
        scope,
        style,
    } = props;

    const IconComponent = (AntIcons as Record<string, any>)[name ?? ''];

    if( svg && svg.svg) {
        return <SvgRenderer {...svg} />
    }

    if (!IconComponent) {
        return <QuestionCircleOutlined style={{ fontSize: size, color }} className={style?.className} />;
    }

    return (
        <IconComponent
            spin={spin}
            rotate={rotate}
            twoToneColor={twoToneColor}
            className={toCSSClassName(style?.className)}
            style={toCSSProperties(style?.style)}
            {...bindMultipleEvents(event, scope)}
        />
    );
};