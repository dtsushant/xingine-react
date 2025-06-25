// Import and re-export base types from xingine
export type {
  Renderer,
  UIComponent as XingineUIComponent,
  UIComponentDetail,
  Comrade,
  Permission,
  GroupedPermission,
  IconMeta,
  ExpositionRule
} from 'xingine';

// Import component meta types from xingine's component meta map
export type {
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
  DetailDispatchProperties
} from 'xingine/dist/core/component/component-meta-map';

// Import the original ComponentMetaMap and extend it
import type { 
  ComponentMetaMap as XingineComponentMetaMap,
  FormMeta,
  TableMeta,
  TabMeta,
  DetailMeta,
  ChartMeta,
  ComponentMeta
} from 'xingine/dist/core/component/component-meta-map';

// New architecture interfaces as per requirements

export interface LayoutComponentDetail {
  path?: string;
  isMenuItem: boolean; // if true along with having a path will be a menu in sider
  component: string;
  children?: LayoutComponentDetail[];
  content?: string;
  meta?: any; // For xingine component meta - more flexible typing
}

export interface LayoutRenderer {
  type: string;
  header?: {
    meta?: LayoutComponentDetail;
  };
  content: {
    meta: LayoutComponentDetail;
  };
  sider?: {
    meta?: LayoutComponentDetail;
  };
  footer?: {
    meta?: LayoutComponentDetail;
  };
}

// Extended ComponentMetaMap to include all renderers
export interface ComponentMetaMap extends XingineComponentMetaMap {
  FormRenderer: FormMeta;
  TableRenderer: TableMeta;
  TabRenderer: TabMeta;
  DetailRenderer: DetailMeta;
  ChartRenderer: ChartMeta;
  // Layout components
  LayoutRenderer: Record<string, any>;
  HeaderRenderer: Record<string, any>;
  SidebarRenderer: Record<string, any>;
  ContentRenderer: Record<string, any>;
  FooterRenderer: Record<string, any>;
  // UI components
  ButtonRenderer: Record<string, any>;
  SearchRenderer: Record<string, any>;
  SwitchRenderer: Record<string, any>;
  BadgeRenderer: Record<string, any>;
  DropdownRenderer: Record<string, any>;
  AvatarRenderer: Record<string, any>;
  MenuRenderer: Record<string, any>;
  TitleRenderer: Record<string, any>;
  CardRenderer: Record<string, any>;
  TextRenderer: Record<string, any>;
  LinkRenderer: Record<string, any>;
  WrapperRenderer: Record<string, any>;
  PopupRenderer: Record<string, any>;
}

// Modified UIComponent type to support LayoutRenderer and LayoutComponentDetail
export type UIComponent = LayoutRenderer | LayoutComponentDetail;

// Modified ModulePropertyOptions
export interface ModulePropertyOptions {
  uiComponent: UIComponent[];
}