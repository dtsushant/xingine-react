import React from 'react';
import { Button } from 'antd';
import { LayoutComponentDetail, ExtendedUIComponent } from '../../types/renderer.types';

interface ButtonRendererProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  renderComponent: (component: ExtendedUIComponent, key?: string) => React.ReactNode;
  keyPrefix?: string;
}

// Helper function to get icon components
const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    home: require('@ant-design/icons').HomeOutlined,
    bell: require('@ant-design/icons').BellOutlined,
    user: require('@ant-design/icons').UserOutlined,
    setting: require('@ant-design/icons').SettingOutlined,
    logout: require('@ant-design/icons').LogoutOutlined,
    dashboard: require('@ant-design/icons').DashboardOutlined,
    team: require('@ant-design/icons').TeamOutlined,
    'bar-chart': require('@ant-design/icons').DashboardOutlined, // Using dashboard as placeholder
  };
  return iconMap[iconName] || require('@ant-design/icons').UserOutlined;
};

export const ButtonRenderer: React.FC<ButtonRendererProps> = ({ 
  detail, 
  styles, 
  renderComponent, 
  keyPrefix = 'button' 
}) => (
  <Button 
    style={styles} 
    icon={detail.props?.icon ? React.createElement(getIcon(detail.props.icon)) : undefined}
    {...detail.props}
  >
    {detail.content}
    {detail.children?.map((child, index) => renderComponent(child, `${keyPrefix}-${index}`))}
  </Button>
);

export default ButtonRenderer;