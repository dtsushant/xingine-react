import {ComponentType, FC} from "react";
import {RouteObject} from "react-router-dom";
import { LayoutRenderer } from "xingine";

export interface XingineConfig {
  component?: Record<string, ComponentType<unknown>>;
  layout?: Record<string, FC<unknown>>;
  layoutMap?: Record<string, LayoutRenderer>;
  additionalRoutes?:RouteObject[];
}
