import React from 'react';
import { Dropdown } from 'antd';
import { WrapperRenderer } from './WrapperRenderer';
import {LayoutComponentDetail} from "xingine";

export interface DropdownRendererProps {
  detail: LayoutComponentDetail;
  styles?: Record<string,unknown>;
  keyPrefix?: string;
}

export const DropdownRenderer: React.FC<DropdownRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'dropdown' 
}) => (
  <Dropdown menu={{ items: [] }}>
    {/*<WrapperRenderer style={styles}>
      {detail.children?.map((child, index) => (
        <div key={`${keyPrefix}-${index}`}>
          {child.content || child.component}
        </div>
      ))}
    </WrapperRenderer>*/}
      <div>TODO:- complete dropdown render implementaiotn</div>
  </Dropdown>
);

export default DropdownRenderer;