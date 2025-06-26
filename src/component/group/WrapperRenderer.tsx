import React from 'react';
import {WrapperMeta} from "xingine";
import {toCSSProperties} from "../utils/Component.utils";
import {getDefaultInternalComponents} from "./index";



export const WrapperRenderer: React.FC<WrapperMeta> = ({
  children, 
  style, 
  className,
  ...props 
}) => {
  const compMap = getDefaultInternalComponents();

  return (
    <div style={toCSSProperties(style)} className={className} {...props}>
      {children?.filter((child)=>!!child.meta).map((child, index) => {

        const Comp = compMap[child.meta!.component] ;
        console.debug("rendering the component", Comp, child.meta!.component, child.meta!.properties);

        return (
            <div key={index}>
              <Comp {...child.meta!.properties} />
            </div>
        );
      })}

    </div>
  );
};