import React from 'react';
import { Card } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';

interface CardRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const CardRenderer: React.FC<CardRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'card' 
}) => (
  <Card style={styles} title={detail.content}>
    {detail.children?.map((child, index) => (
      <div key={`${keyPrefix}-${index}`}>
        {child.content || child.component}
      </div>
    ))}
  </Card>
);

export default CardRenderer;