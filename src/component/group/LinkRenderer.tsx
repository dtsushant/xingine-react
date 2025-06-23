import React from 'react';
import { LayoutComponentDetail } from '../../types/renderer.types';

interface LinkRendererProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  keyPrefix?: string;
}

export const LinkRenderer: React.FC<LinkRendererProps> = ({ 
  detail, 
  styles, 
  keyPrefix = 'link' 
}) => (
  <a style={styles} {...detail.props}>
    {detail.content}
  </a>
);

export default LinkRenderer;