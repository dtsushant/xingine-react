import React from "react";
import { Commissar } from "xingine";
import {RenderComponent} from "./utils/Layout.utils";

export const DefaultContentRenderer: React.FC<Commissar> = (meta) => {
  return (
        <RenderComponent {...meta} />
  );
};
