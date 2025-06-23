import React from 'react';
import { Layout } from 'antd';
import { LayoutComponentDetail, ExtendedUIComponent } from '../../../types/renderer.types';

interface LayoutComponentProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  renderComponent: (component: ExtendedUIComponent, key?: string) => React.ReactNode;
  keyPrefix?: string;
}

export const LayoutComponent: React.FC<LayoutComponentProps> = ({ 
  detail, 
  styles, 
  renderComponent, 
  keyPrefix = 'layout' 
}) => (
  <Layout style={{ minHeight: '100vh', ...styles }}>
    {detail.children?.map((child, index) => renderComponent(child, `${keyPrefix}-${index}`))}
  </Layout>
);

export default LayoutComponent;