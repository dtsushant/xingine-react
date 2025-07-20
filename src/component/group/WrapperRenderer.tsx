import React from 'react';
import { WrapperMeta} from "xingine";
import {bindMultipleEvents,  toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {DangerousRenderer} from "./index";
import {RenderComponent} from "../layout/utils/Layout.utils";


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

  return (
      <div style={toCSSProperties(style?.style)} className={toCSSClassName(style?.className)} {...bindMultipleEvents(event, scope)} {...props}>
        <ShowMetaContent meta={meta} showMeta={showMeta} />
        {content && <DangerousRenderer content={content}/>}

        {children?.map((child, index) => {
          if(debug){
            console.info("Rendering child", child.meta?.component, "with properties", child.meta?.properties);
          }

          return <RenderComponent {...child} />

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

