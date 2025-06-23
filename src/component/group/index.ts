import {FormRenderer} from "./FormRenderer";
import {DetailRenderer} from "./DetailRenderer";
import {TableRenderer} from "./TableRenderer";
import {TabRenderer} from "./TabRenderer";
import {ChartRenderer} from "./ChartRenderer";
import {IconRenderer} from "./IconRenderer";
import {FileInput} from "./FileInput";
import {WrapperRenderer} from "./WrapperRenderer";

export function getDefaultInternalComponents() {
  return {
    DetailRenderer,
    TableRenderer,
    TabRenderer,
    ChartRenderer,
    IconRenderer,
    FormRenderer,
    WrapperRenderer,
  };
}

export * from "./FormRenderer";
export * from "./DetailRenderer";
export * from "./TableRenderer";
export * from "./TabRenderer";
export * from "./ChartRenderer";
export * from "./IconRenderer";
export * from "./FileInput";
export * from "./WrapperRenderer";
