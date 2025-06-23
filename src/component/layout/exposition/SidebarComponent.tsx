import React from 'react';
import { Layout, Menu } from 'antd';
import { LayoutComponentDetail } from '../../../types/renderer.types';
import { WrapperRenderer } from '../../group/WrapperRenderer';

const { Sider } = Layout;

interface SidebarComponentProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  collapsed: boolean;
  darkMode: boolean;
  isMobile: boolean;
  onCollapse: (collapsed: boolean) => void;
  keyPrefix?: string;
}

export const SidebarComponent: React.FC<SidebarComponentProps> = ({ 
  detail, 
  styles, 
  collapsed,
  darkMode,
  isMobile,
  onCollapse,
  keyPrefix = 'sidebar' 
}) => {
  // Process menu items to handle collapsed state - remove labels when collapsed
  const processedMenuItems = React.useMemo(() => {
    const menuItems = detail.props?.menuItems || [];
    
    if (!collapsed || isMobile) {
      return menuItems;
    }
    
    // When collapsed, only show icons, remove labels
    return menuItems.map((item: any) => ({
      ...item,
      label: undefined, // Remove label when collapsed
      title: item.label // Use title for tooltip on hover
    }));
  }, [detail.props?.menuItems, collapsed, isMobile]);

  return (
    <Sider
      theme={darkMode ? 'dark' : 'light'}
      collapsed={isMobile ? false : collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      collapsedWidth={isMobile ? 0 : 80}
      style={{
        position: 'fixed',
        left: 0,
        top: 64,
        height: 'calc(100vh - 64px)',
        zIndex: 999,
        ...styles,
      }}
    >
      <WrapperRenderer style={{ padding: '16px 0' }}>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={processedMenuItems}
          style={{ border: 'none' }}
          inlineCollapsed={collapsed && !isMobile}
        />
      </WrapperRenderer>
    </Sider>
  );
};

export default SidebarComponent;