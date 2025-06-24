import React from 'react';
import { Button } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';

interface ButtonRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
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
  styles = {}, 
  keyPrefix = 'button' 
}) => (
  <Button 
    style={styles} 
    type="default"
  >
    {detail.content || 'Button'}
    {detail.children?.map((child, index) => (
      <span key={`${keyPrefix}-${index}`}>
        {child.content || child.component}
      </span>
    ))}
  </Button>
);

export default ButtonRenderer;