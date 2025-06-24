import React from 'react';
import { Typography } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';

const { Text } = Typography;

interface TextRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const TextRenderer: React.FC<TextRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'text' 
}) => (
  <Text style={styles}>
    {detail.content || 'Text'}
  </Text>
);

export default TextRenderer;