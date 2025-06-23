import React from 'react';
import { Menu } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';

interface MenuRendererProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  keyPrefix?: string;
}

export const MenuRenderer: React.FC<MenuRendererProps> = ({ 
  detail, 
  styles, 
  keyPrefix = 'menu' 
}) => (
  <Menu style={styles} {...detail.props} />
);

export default MenuRenderer;