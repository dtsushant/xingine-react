import {bindMultipleEvents, getAllComponentMap, toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {SiderMeta} from "xingine";
import React from "react";
import {DangerousRenderer} from "./DangerousContentRenderer";
import {buildExtendedComponentDetail, RenderComponent} from "../layout/utils/Layout.utils";

export const SiderRenderer: React.FC<SiderMeta> = (meta) => {
    const {
        children,
        style,
        content,
        event,
        scope,
        ...props
    } = meta;

    console.info("The classname", style?.className)
    console.info("The extrapolated classname", toCSSClassName(style?.className))
    return (
        <>
            <aside
                style={toCSSProperties(style?.style)}
                className={toCSSClassName(style?.className)}
                {...bindMultipleEvents(event)}
                {...props}
            >
                {content && <DangerousRenderer content={content} />}

                {children?.map((child, index) => {

                    return <RenderComponent {...buildExtendedComponentDetail(child,scope.parent, scope.current)} />

                    /*return <RenderComponent {...{
                            ...child,
                            ...scope
                        }}
                    />*/
                })}
            </aside>
        </>
    );
};
