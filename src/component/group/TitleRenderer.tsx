import React from 'react';
import { Typography } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';

const { Title } = Typography;

interface TitleRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const TitleRenderer: React.FC<TitleRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'title' 
}) => (
  <Title style={styles}>
    {detail.content || 'Title'}
  </Title>
);

export default TitleRenderer;