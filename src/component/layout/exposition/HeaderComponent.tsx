import React from 'react';
import { Layout, Row, Col, Space, Button, Input, Badge, Switch, Dropdown, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { LayoutComponentDetail } from '../../../types/renderer.types';

const { Header } = Layout;
const { Search } = Input;

// Serializable onClick actions
interface SerializableAction {
  type: 'toggle' | 'navigate' | 'search' | 'menu-action';
  target?: string;
  value?: any;
}

interface HeaderComponentProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  collapsed: boolean;
  darkMode: boolean;
  onToggleCollapsed: () => void;
  onToggleDarkMode: (darkMode: boolean) => void;
  onAction?: (action: SerializableAction) => void; // Serializable action handler
  menuItems?: any[]; // Menu items passed as props
  keyPrefix?: string;
}

// Hook to detect very small screens (below 508px)
const useVerySmallScreen = () => {
  const [isVerySmall, setIsVerySmall] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsVerySmall(window.innerWidth < 508);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return isVerySmall;
};

export const HeaderComponent: React.FC<HeaderComponentProps> = ({ 
  detail, 
  styles, 
  collapsed,
  darkMode,
  onToggleCollapsed,
  onToggleDarkMode,
  onAction = () => {},
  menuItems = [],
  keyPrefix = 'header' 
}) => {
  const isVerySmallScreen = useVerySmallScreen();
  
  const userMenuItems = [
    { 
      key: 'profile', 
      label: 'Profile', 
      icon: <UserOutlined />,
      onClick: () => onAction({ type: 'menu-action', target: 'profile' })
    },
    { 
      key: 'settings', 
      label: 'Settings', 
      icon: <SettingOutlined />,
      onClick: () => onAction({ type: 'menu-action', target: 'settings' })
    },
    { type: 'divider' as const },
    { 
      key: 'logout', 
      label: 'Logout', 
      icon: <LogoutOutlined />,
      onClick: () => onAction({ type: 'menu-action', target: 'logout' })
    },
  ];

  const handleSearch = (value: string) => {
    onAction({ type: 'search', value });
  };

  const handleHomeClick = () => {
    onAction({ type: 'navigate', target: 'home' });
  };

  // For very small screens, position header differently
  const headerStyle: React.CSSProperties = {
    padding: '0 16px',
    background: darkMode ? '#001529' : '#fff',
    borderBottom: '1px solid #f0f0f0',
    position: isVerySmallScreen ? 'relative' : 'fixed',
    top: isVerySmallScreen ? 'auto' : 0,
    bottom: isVerySmallScreen ? 0 : 'auto', // Move to bottom on very small screens
    width: '100%',
    zIndex: 1000,
    ...styles,
  };

  return (
    <Header style={headerStyle}>
      <Row justify="space-between" align="middle" style={{ height: '100%' }}>
        <Col>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={onToggleCollapsed}
            />
            <Button 
              type="text" 
              icon={<HomeOutlined />} 
              onClick={handleHomeClick}
            />
          </Space>
        </Col>
        {/* Hide search on very small screens to save space */}
        {!isVerySmallScreen && (
          <Col flex="auto" style={{ maxWidth: 400, margin: '0 16px' }}>
            <Search
              placeholder="Search..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
          </Col>
        )}
        <Col>
          <Space>
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Switch
              checkedChildren={<BulbOutlined />}
              unCheckedChildren={<BulbOutlined />}
              checked={darkMode}
              onChange={onToggleDarkMode}
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderComponent;