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

// Layout-specific component extension for LayoutRenderer
// This extends UIComponent to support layout-specific rendering while maintaining xingine compatibility
export interface LayoutComponentDetail {
  type: string;
  props?: Record<string, any>;
  children?: LayoutComponentDetail[];
  content?: string;
  meta?: any; // For xingine component meta
}

// Extended UIComponent that supports both xingine types and layout components
export type ExtendedUIComponent = UIComponent | LayoutComponentDetail;

// Extended Renderer for LayoutRenderer that uses LayoutComponentDetail as componentDetail
export interface LayoutRenderer extends Omit<Renderer, 'componentDetail'> {
  componentDetail: LayoutComponentDetail;
}