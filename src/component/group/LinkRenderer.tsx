import React from 'react';
import {EventBindings, IconMeta, LayoutComponentDetail, StyleMeta} from "xingine";
import {bindMultipleEvents, toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {IconRenderer} from "./IconRenderer";
import {Link} from "react-router-dom";

export interface LinkMeta {
  path: string;
  event?: EventBindings;
  style?: StyleMeta;
  icon?: IconMeta;
  label?: string;
}

export interface LinkMetaExtended extends LinkMeta {
  scope?: Record<string, unknown>;
}

export const LinkRenderer: React.FC<LinkMetaExtended> = (meta) => {
  return (
      <Link
          to={meta.path}
          style={toCSSProperties(meta.style?.style)}
          className={toCSSClassName(meta.style?.className)}
          {...bindMultipleEvents(meta.event, meta.scope)}
      >
        {meta.icon && typeof meta.icon === "object" ? (
            <IconRenderer {...meta.icon} />
        ) : typeof meta.icon === "string" ? (
            <span>{meta.icon}</span>
        ) : null}
        {meta.label}
      </Link>
  );
};


export default LinkRenderer;