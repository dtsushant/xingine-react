import React from 'react';
import { Layout } from 'antd';
import { LayoutComponentDetail, ExtendedUIComponent } from '../../../types/renderer.types';

const { Content } = Layout;

interface ContentComponentProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  collapsed: boolean;
  darkMode: boolean;
  isMobile: boolean;
  renderComponent: (component: ExtendedUIComponent, key?: string) => React.ReactNode;
  keyPrefix?: string;
}

export const ContentComponent: React.FC<ContentComponentProps> = ({ 
  detail, 
  styles, 
  collapsed,
  darkMode,
  isMobile,
  renderComponent,
  keyPrefix = 'content' 
}) => {
  // Calculate margin based on screen size and sidebar state
  const getContentMargin = () => {
    if (isMobile) {
      return 0; // No margin on mobile as sidebar collapses to 0
    }
    
    // For desktop/tablet, adjust based on collapsed state
    return collapsed ? 80 : 200;
  };

  return (
    <Content
      style={{
        marginLeft: getContentMargin(),
        marginTop: 64,
        padding: 24,
        minHeight: 'calc(100vh - 64px)',
        background: darkMode ? '#001529' : '#f0f2f5',
        transition: 'margin-left 0.2s ease-in-out',
        // Ensure content doesn't overflow and can scroll if needed
        overflow: 'auto',
        width: `calc(100% - ${getContentMargin()}px)`,
        ...styles,
      }}
    >
      {detail.children?.map((child, index) => renderComponent(child, `${keyPrefix}-${index}`))}
    </Content>
  );
};

export default ContentComponent;