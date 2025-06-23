import React from 'react';
import { Layout } from 'antd';
import { LayoutComponentDetail, ExtendedUIComponent } from '../../../types/renderer.types';

const { Content } = Layout;

interface ContentComponentProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  collapsed: boolean;
  darkMode: boolean;
  isMobile: boolean;
  renderComponent: (component: ExtendedUIComponent, key?: string) => React.ReactNode;
  keyPrefix?: string;
}

export const ContentComponent: React.FC<ContentComponentProps> = ({ 
  detail, 
  styles, 
  collapsed,
  darkMode,
  isMobile,
  renderComponent,
  keyPrefix = 'content' 
}) => (
  <Content
    style={{
      marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
      marginTop: 64,
      padding: 24,
      minHeight: 'calc(100vh - 64px)',
      background: darkMode ? '#001529' : '#f0f2f5',
      transition: 'margin-left 0.2s',
      ...styles,
    }}
  >
    {detail.children?.map((child, index) => renderComponent(child, `${keyPrefix}-${index}`))}
  </Content>
);

export default ContentComponent;