import React from 'react';
import { Badge } from 'antd';
import { LayoutComponentDetail, ExtendedUIComponent } from '../../types/renderer.types';

interface BadgeRendererProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  renderComponent: (component: ExtendedUIComponent, key?: string) => React.ReactNode;
  keyPrefix?: string;
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({ 
  detail, 
  styles, 
  renderComponent, 
  keyPrefix = 'badge' 
}) => (
  <Badge style={styles} {...detail.props}>
    {detail.children?.map((child, index) => renderComponent(child, `${keyPrefix}-${index}`))}
  </Badge>
);

export default BadgeRenderer;