import React from 'react';
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
import {PopupRenderer} from "./PopupRenderer";
import {DangerousRenderer} from "./DangerousContentRenderer";
import InputRenderer from "./InputRenderer";
import {SvgRenderer} from "./SvgRenderer";
import {ConditionalRenderer} from "./ConditionalRenderer";

export function getDefaultInternalComponents(): Record<string, React.ComponentType<any>> {
  return {
      // Form and data components
      DetailRenderer,
      TableRenderer,
      TabRenderer,
      ChartRenderer,
      IconRenderer,
      SvgRenderer,
      FormRenderer,
      WrapperRenderer,
      ConditionalRenderer,
      // UI components
      ButtonRenderer,
      InputRenderer,
      SwitchRenderer,
      BadgeRenderer,
      DropdownRenderer,
      AvatarRenderer,
      MenuRenderer,
      TitleRenderer,
      CardRenderer,
      TextRenderer,
      LinkRenderer,
      PopupRenderer,
      FileInput,
      DangerousRenderer,
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
export * from "./ConditionalRenderer"
export * from "./TitleRenderer";
export * from "./CardRenderer";
export * from "./TextRenderer";
export * from "./LinkRenderer";
export * from "./PopupRenderer";
export * from "./MissingComponents";
export * from "./DangerousContentRenderer";
export * from "./InputRenderer"
export * from "./SvgRenderer"
