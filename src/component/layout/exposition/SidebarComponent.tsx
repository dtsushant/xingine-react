import React from 'react';
import { Menu } from 'antd';
import { LayoutComponentDetail } from '../../../types/renderer.types';
import { PanelControlBureau } from '../../../context/XingineContextBureau';

interface SidebarComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: PanelControlBureau;
  menuItems?: LayoutComponentDetail[];
}

export const SidebarComponent: React.FC<SidebarComponentProps> = ({ 
  renderer, 
  panelControl,
  menuItems = []
}) => {
  const { collapsed, darkMode } = panelControl;
  
  // Convert LayoutComponentDetail menuItems to Ant Design menu items
  const processedMenuItems = React.useMemo(() => {
    return menuItems
      .filter(item => item.isMenuItem)
      .map((item) => ({
        key: item.path || item.component,
        label: collapsed ? undefined : item.content || item.component,
        title: item.content || item.component, // Use title for tooltip on hover when collapsed
        onClick: () => {
          if (item.path) {
            // Navigate to the path
            console.log('Navigate to:', item.path);
          }
        }
      }));
  }, [menuItems, collapsed]);

  return (
    <div style={{ 
      height: '100%', 
      backgroundColor: darkMode ? '#001529' : '#fff',
      padding: '16px 0'
    }}>
      <Menu
        theme={darkMode ? 'dark' : 'light'}
        mode="inline"
        inlineCollapsed={collapsed}
        items={processedMenuItems}
        style={{
          border: 'none',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

export default SidebarComponent;