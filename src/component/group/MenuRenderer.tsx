import React from 'react';
import { Menu } from 'antd';
import {LayoutComponentDetail} from "xingine";

export interface MenuRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const MenuRenderer: React.FC<MenuRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'menu' 
}) => (
  <Menu style={styles} items={[]} />
);

export default MenuRenderer;