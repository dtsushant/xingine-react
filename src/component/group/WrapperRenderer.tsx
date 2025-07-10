import React, {useMemo} from 'react';
import {extrapolate, getTypedValue, StyleMeta, WrapperMeta} from "xingine";
import {bindMultipleEvents, getAllComponentMap, toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {DangerousRenderer} from "./index";


interface WrapperMetaExtended extends WrapperMeta {
  showMeta?: boolean;
  debug?:boolean;
  scope?:Record<string, unknown>;
}

export const WrapperRenderer: React.FC<WrapperMetaExtended> = (meta) => {
  const {
  children,
  style,
  content,
  event,
  scope,
  debug,
  showMeta,
  ...props
  } = meta;
  const compMap = getAllComponentMap();

 /* const {  headerActionContext} = usePanelControlContext();

  const evaluatedClassName = useMemo(() => {
    return style?.className ? extrapolate(style.className, headerActionContext) : '';
  }, [style?.className, headerActionContext]);*/

  return (
      <div style={toCSSProperties(style?.style)} className={toCSSClassName(style?.className)} {...bindMultipleEvents(event, scope)} {...props}>
        <ShowMetaContent meta={meta} showMeta={showMeta} />
        {content && <DangerousRenderer content={content}/>}

        {children?.filter((child) => !!child.meta).map((child, index) => {
          if(debug){
            console.info("Rendering child", child.meta?.component, "with properties", child.meta?.properties);
          }

          const Comp = compMap[child.meta!.component];
          return (
                <Comp {...child.meta!.properties} key={index}/>
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

