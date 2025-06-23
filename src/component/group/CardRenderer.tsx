import React from 'react';
import { Card } from 'antd';
import { LayoutComponentDetail, ExtendedUIComponent } from '../../types/renderer.types';

interface CardRendererProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  renderComponent: (component: ExtendedUIComponent, key?: string) => React.ReactNode;
  keyPrefix?: string;
}

export const CardRenderer: React.FC<CardRendererProps> = ({ 
  detail, 
  styles, 
  renderComponent, 
  keyPrefix = 'card' 
}) => (
  <Card style={styles} {...detail.props}>
    {detail.children?.map((child, index) => renderComponent(child, `${keyPrefix}-${index}`))}
  </Card>
);

export default CardRenderer;