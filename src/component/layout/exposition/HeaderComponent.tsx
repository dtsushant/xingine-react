import React from 'react';
import { Row, Col, Space, Button, Input, Badge, Switch, Dropdown, Avatar, Grid } from 'antd';
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
import { PanelControlBureau } from '../../../context/XingineContextBureau';
import {LayoutComponentDetail} from "xingine";

const { Search } = Input;
const { useBreakpoint } = Grid;

// Serializable onClick actions
interface SerializableAction {
  type: 'toggle' | 'navigate' | 'search' | 'menu-action';
  target?: string;
  value?: any;
}

export interface HeaderComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: PanelControlBureau;
  menuItems?: LayoutComponentDetail[];
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
  renderer, 
  panelControl,
  menuItems = []
}) => {
  const { collapsed, darkMode, setCollapsed, setDarkMode } = panelControl;
  const isVerySmallScreen = useVerySmallScreen();
  
  const userMenuItems = [
    { 
      key: 'profile', 
      label: 'Profile', 
      icon: <UserOutlined />,
      onClick: () => handleAction({ type: 'menu-action', target: 'profile' })
    },
    { 
      key: 'settings', 
      label: 'Settings', 
      icon: <SettingOutlined />,
      onClick: () => handleAction({ type: 'menu-action', target: 'settings' })
    },
    { type: 'divider' as const },
    { 
      key: 'logout', 
      label: 'Logout', 
      icon: <LogoutOutlined />,
      onClick: () => handleAction({ type: 'menu-action', target: 'logout' })
    },
  ];

  const handleAction = (action: SerializableAction) => {
    switch (action.type) {
      case 'toggle':
        if (action.target === 'sidebar') {
          setCollapsed(!collapsed);
        }
        break;
      case 'navigate':
        if (action.target === 'home') {
          // Navigate to home - could use router here
          console.log('Navigate to home');
        }
        break;
      case 'search':
        console.log('Search:', action.value);
        break;
      case 'menu-action':
        console.log('Menu action:', action.target);
        break;
    }
  };

  const handleSearch = (value: string) => {
    handleAction({ type: 'search', value });
  };

  const handleHomeClick = () => {
    handleAction({ type: 'navigate', target: 'home' });
  };

  const handleToggleCollapsed = () => {
    handleAction({ type: 'toggle', target: 'sidebar' });
  };

  return (
    <div style={{ 
      padding: '0 16px', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        <Col>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleToggleCollapsed}
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
              onChange={setDarkMode}
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default HeaderComponent;