import {ComponentType, FC} from "react";
import {RouteObject} from "react-router-dom";

export interface XingineConfig {
  component?: Record<string, ComponentType<unknown>>;
  layout?: Record<string, FC<unknown>>;
  additionalRoutes?:RouteObject[];
}
