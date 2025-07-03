import React from 'react';
import { Button } from 'antd';
import {ButtonMeta} from "../../../.yalc/xingine";
import {bindMultipleEvents, toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {IconRenderer} from "./IconRenderer";
import {DangerousRenderer} from "./DangerousContentRenderer";

export interface ButtonMetaExtended extends  ButtonMeta{
  scope:Record<string,unknown>;
}


export const ButtonRenderer: React.FC<ButtonMetaExtended> = (meta) => {
const { style, event, name, content, scope, ...props } = meta;
const { style: innerStyle, className } = style || {};
  return (
      <Button
          name={name}
          style={toCSSProperties(innerStyle)}
          className={toCSSClassName(className)} {...bindMultipleEvents(event, scope)} {...props}
      >
          {typeof content === 'string' && content ? (
              <DangerousRenderer content={content} />
          ) : content && typeof content === 'object' ? (
              <IconRenderer {...content} />
          ) : (
              'Default Button'
          )}

      </Button>
  );
};

export default ButtonRenderer;