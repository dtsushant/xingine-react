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
}) => (
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
        items={detail.props?.menuItems || []}
        style={{ border: 'none' }}
      />
    </WrapperRenderer>
  </Sider>
);

export default SidebarComponent;