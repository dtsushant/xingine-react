// Import basic types that are actually exported from xingine
export type {
  Comrade,
  Permission,
  GroupedPermission,
  ModulePropertyOptions
} from 'xingine';

// Define IconMeta interface as it should be in xingine
export interface IconMeta {
  name?: string;
  color?: string;
  size?: number | string;
  spin?: boolean;
  rotate?: number;
  twoToneColor?: string;
  className?: string;
}

// Define ExpositionRule interface as it should be in xingine
export interface ExpositionRule {
  visible?: boolean | any;
  disabled?: boolean | any;
  className?: string;
  style?: Record<string, string>;
  icon?: IconMeta;
  tooltip?: string;
  order?: number;
  tag?: string;
  wrapper?: string;
  section?: string;
}

// Define UIComponent interface as it should be in xingine
export interface UIComponent {
  component: string;
  path: string;
  expositionRule?: ExpositionRule;
  layout?: string;
  roles?: string[];
  permissions?: string[];
  meta?: any;
}

// Define types that should be in xingine but may not be exported
export interface ComponentMetaMap {
  FormRenderer: FormMeta;
  TableRenderer: TableMeta;
  TabRenderer: TabMeta;
  DetailRenderer: DetailMeta;
  ChartRenderer: ChartMeta;
}

export interface FormMeta {
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

export interface DetailMeta {
  fields: any[];
  action: string;
  dispatch?: any;
}

export interface ChartMeta {
  charts: ChartConfig[];
  renderer?: Renderer;
}

export interface ChartConfig {
  type: ChartType;
  title?: string;
  labels?: string[];
  datasets?: ChartDataset[];
  options?: Record<string, unknown>;
  dataSourceUrl?: string;
  renderer?: Renderer;
}

export interface ColumnMeta {
  title?: string;
  dataIndex?: string;
  key?: string;
  render?: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: any;
}

export interface ComponentMeta<T extends keyof ComponentMetaMap = keyof ComponentMetaMap> {
  component: T;
  properties: ComponentMetaMap[T];
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

// Define the Renderer interface as it should be
export interface Renderer {
  mode?: string;
  layout?: {
    display?: string;
    columns?: number;
    spacing?: string | number;
    alignment?: string;
  };
  interaction?: {
    clickable?: boolean;
    hoverable?: boolean;
    draggable?: boolean;
    keyboardNavigable?: boolean;
  };
  display?: {
    showBorder?: boolean;
    showShadow?: boolean;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string | number;
    opacity?: number;
  };
  responsive?: {
    breakpoints?: {
      mobile?: Partial<Renderer>;
      tablet?: Partial<Renderer>;
      desktop?: Partial<Renderer>;
    };
    hiddenOn?: ('mobile' | 'tablet' | 'desktop')[];
  };
  animation?: {
    type?: string;
    duration?: number;
    easing?: string;
    animateOnMount?: boolean;
  };
  cssClasses?: string[];
  customStyles?: Record<string, string | number>;
  accessibility?: {
    role?: string;
    ariaLabel?: string;
    ariaDescription?: string;
    tabIndex?: number;
  };
}

// Extended UIComponent type that includes both xingine UIComponent and custom component details
export interface UIComponentDetail {
  type: string;
  props?: Record<string, any>;
  children?: ExtendedUIComponent[];
  content?: string;
}

// Extended type that allows for both xingine UIComponent and custom components  
export type ExtendedUIComponent = UIComponent | UIComponentDetail;

// Extended Renderer interface that includes componentDetail for recursive rendering
export interface ExtendedRenderer extends Renderer {
  /**
   * Detailed description of the UI component to render or the nested Renderer
   * This should include the component type from ComponentMetaMap
   */
  componentDetail?: ExtendedUIComponent;
  
  /**
   * Children components for recursive rendering
   */
  children?: ExtendedRenderer[];
}