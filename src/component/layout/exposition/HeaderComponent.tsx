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

interface HeaderComponentProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  collapsed: boolean;
  darkMode: boolean;
  onToggleCollapsed: () => void;
  onToggleDarkMode: (darkMode: boolean) => void;
  keyPrefix?: string;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({ 
  detail, 
  styles, 
  collapsed,
  darkMode,
  onToggleCollapsed,
  onToggleDarkMode,
  keyPrefix = 'header' 
}) => {
  const userMenuItems = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    { type: 'divider' as const },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined /> },
  ];

  return (
    <Header
      style={{
        padding: '0 16px',
        background: darkMode ? '#001529' : '#fff',
        borderBottom: '1px solid #f0f0f0',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        ...styles,
      }}
    >
      <Row justify="space-between" align="middle" style={{ height: '100%' }}>
        <Col>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={onToggleCollapsed}
            />
            <Button type="text" icon={<HomeOutlined />} />
          </Space>
        </Col>
        <Col flex="auto" style={{ maxWidth: 400, margin: '0 16px' }}>
          <Search
            placeholder="Search..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={(value) => console.log('Search:', value)}
          />
        </Col>
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