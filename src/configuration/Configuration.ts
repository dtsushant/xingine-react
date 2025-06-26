import { FC } from "react";

export interface XingineConfig {
  component?: Record<string, FC<unknown>>;
  layout?: Record<string, FC<unknown>>;
}
