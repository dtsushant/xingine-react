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

// Import module components
import { UserModule } from "./UserModule";
import { InventoryModule } from "./InventoryModule";
import { UserAnalytics } from "./UserAnalytics";
import { UserDashboard } from "./UserDashboard";
import { InventoryDashboard } from "./InventoryDashboard";

// Import missing components
import {
  AddRole,
  UserCreate,
  UserList,
  UserDetail,
  NewCategory,
  CreateInventory,
  UpdateInventory,
  StockAdjustment,
  CreatePurchaseOrder,
  UpdatePurchaseOrder
} from "./MissingComponents";

// Import layout components
import { 
  LayoutComponent, 
  HeaderComponent, 
  SidebarComponent, 
  ContentComponent, 
  FooterComponent 
} from "../layout/exposition";

export function getDefaultInternalComponents() {
  return {
    // Form and data components
    DetailRenderer,
    TableRenderer,
    TabRenderer,
    ChartRenderer,
    IconRenderer,
    FormRenderer,
    WrapperRenderer,
    
    // UI components
    ButtonRenderer,
    SearchRenderer,
    SwitchRenderer,
    BadgeRenderer,
    DropdownRenderer,
    AvatarRenderer,
    MenuRenderer,
    TitleRenderer,
    CardRenderer,
    TextRenderer,
    LinkRenderer,
    FileInput,
    
    // Module components
    UserModule,
    InventoryModule,
    UserAnalytics,
    UserDashboard,
    InventoryDashboard,
    
    // Action components - ensure exact name matches for external module data
    AddRole,
    UserCreate,
    UserList,
    UserDetail,
    NewCategory,
    CreateInventory,
    UpdateInventory,
    StockAdjustment,
    CreatePurchaseOrder,
    UpdatePurchaseOrder,
    
    // Layout components - using proper names for registry
    HeaderRenderer: HeaderComponent,
    SidebarRenderer: SidebarComponent,
    ContentRenderer: ContentComponent,
    FooterRenderer: FooterComponent,
    LayoutRenderer: LayoutComponent,
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
export * from "./UserModule";
export * from "./InventoryModule";
export * from "./UserAnalytics";
export * from "./UserDashboard";
export * from "./InventoryDashboard";
export * from "./MissingComponents";
