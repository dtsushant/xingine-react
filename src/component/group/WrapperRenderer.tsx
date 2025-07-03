import React from 'react';
import {getTypedValue, StyleMeta, WrapperMeta} from "xingine";
import {bindMultipleEvents, toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {DangerousRenderer, getDefaultInternalComponents} from "./index";
import {usePanelControlContext} from "../../context/XingineContextBureau";


interface WrapperMetaExtended extends WrapperMeta {
  showMeta?: boolean
  scope?:Record<string, unknown>
}

export const WrapperRenderer: React.FC<WrapperMetaExtended> = (meta) => {
  const {
  children,
  style,
  className,
  content,
  event,
  scope,
  showMeta,
  ...props
  } = meta;
  const compMap = getDefaultInternalComponents();


  console.debug("the passed event bindings", event);


  return (
      <div style={toCSSProperties(style)} className={toCSSClassName(className)} {...bindMultipleEvents(event, scope)} {...props}>
        <ShowMetaContent meta={meta} showMeta={showMeta} />
        {content && <DangerousRenderer content={content}/>}

        {children?.filter((child) => !!child.meta).map((child, index) => {

          const Comp = compMap[child.meta!.component];
          console.debug("rendering the component", Comp, child.meta!.component, child.meta!.properties);

          return (
              <div key={index}>
                <Comp {...child.meta!.properties} />
              </div>
          );
        })}

      </div>
  );

}

const ShowMetaContent: React.FC<{ meta: unknown; showMeta?: boolean }> = ({ meta, showMeta }) => {

  return showMeta && (
      <pre className="mt-2 text-xs w-full max-w-[600px] max-h-[500px] overflow-x-auto whitespace-pre rounded bg-gray-100 p-2">
      {JSON.stringify(meta, null, 2)}
    </pre>
  );
};

