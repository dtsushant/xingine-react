// Import all types from xingine that are already defined there
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

// Since ComponentMetaMap and related types are not exported from the main index,
// I'll define them based on the xingine structure but only include additional properties if needed

// Define component meta types based on xingine structure
export interface ColumnMeta {
  title?: string;
  dataIndex?: string;
  key?: string;
  render?: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: any;
}

export interface FormMeta {
  fields: any[];
  action: string;
  dispatch?: any;
}

export interface DetailMeta {
  fields: any[];
  action: string;
  dispatch?: any;
}

export interface TableMeta {
  columns: ColumnMeta[];
  dataSourceUrl: string;
  rowKey?: string;
  dispatch?: any;
}

export interface TabMeta {
  tabs: {
    label: string;
    component: keyof ComponentMetaMap;
    meta: ComponentMetaMap[keyof ComponentMetaMap];
  }[];
  dispatch?: any;
}

export type ChartType = "bar" | "line" | "pie" | "scatter";

export interface ChartDataset {
  label: string;
  data: number[] | {
    x: number | string;
    y: number;
  }[];
  backgroundColor?: string;
  borderColor?: string;
}

export interface ChartConfig {
  type: ChartType;
  title?: string;
  labels?: string[];
  datasets?: ChartDataset[];
  options?: Record<string, unknown>;
  dataSourceUrl?: string;
  renderer?: any; // Avoid circular reference
}

export interface ChartMeta {
  charts: ChartConfig[];
  renderer?: any; // Avoid circular reference
}

export interface ComponentMetaMap {
  FormRenderer: FormMeta;
  TableRenderer: TableMeta;
  TabRenderer: TabMeta;
  DetailRenderer: DetailMeta;
  ChartRenderer: ChartMeta;
}

export interface ComponentMeta<T extends keyof ComponentMetaMap = keyof ComponentMetaMap> {
  component: T;
  properties: ComponentMetaMap[T];
}

// Import the Renderer type from xingine
import type { Renderer, UIComponent, UIComponentDetail } from 'xingine';

// Custom component detail interface for our extended components (doesn't need to extend xingine UIComponentDetail)
export interface CustomUIComponentDetail {
  type: string;
  props?: Record<string, any>;
  children?: ExtendedUIComponent[];
  content?: string;
}

// Extended UIComponent type that includes both xingine UIComponent and our custom components
export type ExtendedUIComponent = UIComponent | CustomUIComponentDetail;

// Extended Renderer interface that includes componentDetail for recursive rendering
export interface ExtendedRenderer extends Omit<Renderer, 'componentDetail'> {
  /**
   * Override componentDetail to use our extended type
   */
  componentDetail: ExtendedUIComponent;
  
  /**
   * Children components for recursive rendering
   */
  children?: ExtendedRenderer[];
}