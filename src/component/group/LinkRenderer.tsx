import React from 'react';
import {LayoutComponentDetail} from "xingine";

export interface LinkRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const LinkRenderer: React.FC<LinkRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'link' 
}) => (
  <a style={styles} href="#" onClick={(e) => e.preventDefault()}>
    {detail.content || 'Link'}
  </a>
);

export default LinkRenderer;