import {FormRenderer} from "./FormRenderer";
import {DetailRenderer} from "./DetailRenderer";
import {TableRenderer} from "./TableRenderer";
import {TabRenderer} from "./TabRenderer";
import {ChartRenderer} from "./ChartRenderer";
import {IconRenderer} from "./IconRenderer";
import {FileInput} from "./FileInput";
import {WrapperRenderer} from "./WrapperRenderer";
import {ButtonRenderer} from "./ButtonRenderer";
import {SearchRenderer} from "./SearchRenderer";
import {SwitchRenderer} from "./SwitchRenderer";
import {BadgeRenderer} from "./BadgeRenderer";
import {DropdownRenderer} from "./DropdownRenderer";
import {AvatarRenderer} from "./AvatarRenderer";
import {MenuRenderer} from "./MenuRenderer";
import {TitleRenderer} from "./TitleRenderer";
import {CardRenderer} from "./CardRenderer";
import {TextRenderer} from "./TextRenderer";
import {LinkRenderer} from "./LinkRenderer";

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
export * from "./ButtonRenderer";
export * from "./SearchRenderer";
export * from "./SwitchRenderer";
export * from "./BadgeRenderer";
export * from "./DropdownRenderer";
export * from "./AvatarRenderer";
export * from "./MenuRenderer";
export * from "./TitleRenderer";
export * from "./CardRenderer";
export * from "./TextRenderer";
export * from "./LinkRenderer";
