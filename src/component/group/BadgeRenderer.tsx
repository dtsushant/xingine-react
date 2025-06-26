import React from 'react';
import { Badge } from 'antd';
import {LayoutComponentDetail} from "xingine";

export interface BadgeRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'badge' 
}) => (
  <Badge style={styles} count={detail.content || 0}>
    {/*{detail.children?.map((child, index) => (
      <div key={`${keyPrefix}-${index}`}>
        {child.content || child.component}
      </div>
    ))}*/}
    <div>Redering badge complement implementation</div>
  </Badge>
);

export default BadgeRenderer;