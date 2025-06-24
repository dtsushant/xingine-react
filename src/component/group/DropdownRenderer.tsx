import React from 'react';
import { Dropdown } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';
import { WrapperRenderer } from './WrapperRenderer';

interface DropdownRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const DropdownRenderer: React.FC<DropdownRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'dropdown' 
}) => (
  <Dropdown menu={{ items: [] }}>
    <WrapperRenderer style={styles}>
      {detail.children?.map((child, index) => (
        <div key={`${keyPrefix}-${index}`}>
          {child.content || child.component}
        </div>
      ))}
    </WrapperRenderer>
  </Dropdown>
);

export default DropdownRenderer;