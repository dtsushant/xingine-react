export * from "./xingine-react.registry"
export * from "./xingine-react.service"
export { ContextBureau, useXingineContext as useContextBureau } from "./context/ContextBureau"
export { 
  XingineContextBureau, 
  useXingineContext,
  type XingineUIMandate,
  type ColorPalette,
  type PartySeal,
  type PanelControlBureau
} from "./context/XingineContextBureau"
export * from "./component/group"
export { LayoutRenderer, createDefaultLayoutRenderer } from "./component/NewLayoutRenderer"
export * from "./component/layout/default"
export * from "./component/layout/public"
export * from "./component/layout/custom"
export * from "./component/layout/tailwind"
export { TailwindDashboardExample, createTailwindDashboardLayout } from "./component/TailwindDashboardExample"
export * from "./types/renderer.decoders"
export * from "./component/XingineLayoutExample"
export type {
  XingineUIComponent,
  UIComponentDetail,
  Comrade,
  Permission,
  GroupedPermission,
  IconMeta,
  ExpositionRule,
  ColumnMeta,
  FormMeta,
  DetailMeta,
  TableMeta,
  TabMeta,
  ChartMeta,
  ComponentMeta,
  ChartType,
  ChartDataset,
  ChartConfig,
  FormDispatchProperties,
  TableDispatchProperties,
  TabDispatchProperties,
  DetailDispatchProperties,
  LayoutComponentDetail,
  UIComponent,
  LayoutRenderer as LayoutRendererType,
  ComponentMetaMap,
  ModulePropertyOptions
} from "./types/renderer.types"