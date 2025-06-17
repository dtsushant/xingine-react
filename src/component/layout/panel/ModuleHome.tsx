import { Link } from "react-router-dom";
import React from "react";
import { ModuleProperties } from "xingine";
import {IconRenderer} from "../../group";

export const ModuleHome: React.FC<ModuleProperties> = (module) => {
  return (
  <div className="flex flex-wrap gap-4 p-4 justify-center">
    {module.uiComponent?.map((comp, idx) => (
      <Link to={comp.path} key={idx} className="flex-1 min-w-[120px] max-w-[200px] aspect-square">
        <div className="w-full h-full bg-white shadow-md rounded-xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
          <div className="text-2xl mb-2">
            <IconRenderer {...comp.expositionRule?.icon}/>
          </div>
          <div className="text-sm font-semibold px-2">{comp.component}</div>
        </div>
      </Link>
    ))}
  </div>
);

};
