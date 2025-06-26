import React from 'react';
import { Layout } from 'antd';
import {LayoutComponentDetail} from "xingine";

export interface LayoutComponentProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const LayoutComponent: React.FC<LayoutComponentProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'layout' 
}) => (
  <Layout style={{ minHeight: '100vh', ...styles }}>
    {/*{detail.children?.map((child, index) => (
      <div key={`${keyPrefix}-${index}`}>
        {child.content || child.component}
      </div>
    ))}*/}
    <div>TODO:- COmpelete impelementation in LayoutComponent</div>
  </Layout>
);

export default LayoutComponent;