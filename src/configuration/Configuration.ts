import {ComponentType, FC} from "react";

export interface XingineConfig {
  component?: Record<string, ComponentType<unknown>>;
  layout?: Record<string, FC<unknown>>;
}
