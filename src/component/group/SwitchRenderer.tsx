import React from 'react';
import { Switch } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';

interface SwitchRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const SwitchRenderer: React.FC<SwitchRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'switch' 
}) => (
  <Switch style={styles} />
);

export default SwitchRenderer;