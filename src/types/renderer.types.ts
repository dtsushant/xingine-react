// Import and re-export base types from xingine
export type {
  Renderer,
  UIComponent,
  UIComponentDetail,
  Comrade,
  Permission,
  GroupedPermission,
  ModulePropertyOptions,
  IconMeta,
  ExpositionRule
} from 'xingine';

// Import component meta types from xingine's component meta map
// These types are defined in xingine but may not be exported in the main index
// Based on the xingine source structure, importing them directly
export type {
  ColumnMeta,
  FormMeta,
  DetailMeta,
  TableMeta,
  TabMeta,
  ChartMeta,
  ComponentMetaMap,
  ComponentMeta,
  ChartType,
  ChartDataset,
  ChartConfig,
  FormDispatchProperties,
  TableDispatchProperties,
  TabDispatchProperties,
  DetailDispatchProperties
} from 'xingine/dist/core/component/component-meta-map';

// Import the base UIComponent type from xingine for proper reference
import type { UIComponent, Renderer, UIComponentDetail } from 'xingine';

// Minimal custom component extension for layout rendering flexibility
// This is only used for simple layout components, while proper components should use UIComponentDetail
export interface CustomComponentDetail {
  type: string;
  props?: Record<string, any>;
  children?: UIComponent[];
  content?: string;
}

// Extended UIComponent that supports both xingine types and simple custom components
export type ExtendedUIComponent = UIComponent | CustomComponentDetail;