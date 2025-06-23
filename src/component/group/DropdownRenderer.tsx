import React from 'react';
import { Dropdown } from 'antd';
import { LayoutComponentDetail, ExtendedUIComponent } from '../../types/renderer.types';
import { WrapperRenderer } from './WrapperRenderer';

interface DropdownRendererProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  renderComponent: (component: ExtendedUIComponent, key?: string) => React.ReactNode;
  keyPrefix?: string;
}

export const DropdownRenderer: React.FC<DropdownRendererProps> = ({ 
  detail, 
  styles, 
  renderComponent, 
  keyPrefix = 'dropdown' 
}) => (
  <Dropdown {...detail.props}>
    <WrapperRenderer style={styles}>
      {detail.children?.map((child, index) => renderComponent(child, `${keyPrefix}-${index}`))}
    </WrapperRenderer>
  </Dropdown>
);

export default DropdownRenderer;