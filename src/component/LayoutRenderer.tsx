import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Input,
  Avatar,
  Dropdown,
  Badge,
  Switch,
  Grid,
  Card,
  Row,
  Col,
  Space,
  Typography,
} from 'antd';
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
  DashboardOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { ExtendedRenderer, ExtendedUIComponent, CustomUIComponentDetail, Renderer, ChartMeta, FormMeta, TableMeta, DetailMeta } from '../types/renderer.types';
import { ChartRenderer } from './group/ChartRenderer';
import { FormRenderer } from './group/FormRenderer';
import { TableRenderer } from './group/TableRenderer';
import { DetailRenderer } from './group/DetailRenderer';
import { WrapperRenderer } from './group/WrapperRenderer';

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Mock data should be provided from LayoutRendererExample - removed from here

interface LayoutRendererProps {
  renderer: ExtendedRenderer;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ renderer }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Helper function to apply renderer styles
  const applyRendererStyles = (renderer: ExtendedRenderer): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (renderer.layout) {
      if (renderer.layout.display) {
        styles.display = renderer.layout.display;
      }
      if (renderer.layout.spacing) {
        styles.margin = renderer.layout.spacing;
        styles.padding = renderer.layout.spacing;
      }
      if (renderer.layout.alignment) {
        styles.textAlign = renderer.layout.alignment as any;
      }
    }

    if (renderer.display) {
      if (renderer.display.showBorder) {
        styles.border = '1px solid #d9d9d9';
      }
      if (renderer.display.showShadow) {
        styles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
      if (renderer.display.backgroundColor) {
        styles.backgroundColor = renderer.display.backgroundColor;
      }
      if (renderer.display.textColor) {
        styles.color = renderer.display.textColor;
      }
      if (renderer.display.borderRadius) {
        styles.borderRadius = renderer.display.borderRadius;
      }
      if (renderer.display.opacity !== undefined) {
        styles.opacity = renderer.display.opacity;
      }
    }

    if (renderer.customStyles) {
      Object.assign(styles, renderer.customStyles);
    }

    return styles;
  };

  // Recursive renderer function
  const renderComponent = (component: ExtendedUIComponent, key?: string): React.ReactNode => {
    if ('componentDetail' in component) {
      // It's a Renderer object
      const detail = component.componentDetail;
      if (detail) {
        return renderComponent(detail as ExtendedUIComponent, key);
      } else {
        return <WrapperRenderer key={key}>No component detail provided</WrapperRenderer>;
      }
    }

    // Handle case where component might be a plain object or UIComponentDetail
    if (!component || typeof component !== 'object') {
      return <WrapperRenderer key={key}>Invalid component</WrapperRenderer>;
    }

    // Check if it's a standard UIComponent with component property
    if ('component' in component && component.component) {
      // This is an xingine UIComponent, convert to CustomUIComponentDetail for rendering
      const detail: CustomUIComponentDetail = {
        type: component.component,
        props: component.meta || {},
        content: component.component
      };
      return renderComponent(detail, key);
    }

    // It's a CustomUIComponentDetail
    const detail = component as CustomUIComponentDetail;
    const styles = 'componentDetail' in component ? applyRendererStyles(component as ExtendedRenderer) : {};

    switch (detail.type) {
      case 'layout':
        return renderLayout(detail, styles, key);
      case 'header':
        return renderHeader(detail, styles, key);
      case 'sidebar':
      case 'sider':
        return renderSidebar(detail, styles, key);
      case 'content':
        return renderContent(detail, styles, key);
      case 'footer':
        return renderFooter(detail, styles, key);
      case 'charts':
        return renderCharts(detail, styles, key);
      case 'form':
        return renderForm(detail, styles, key);
      case 'table':
        return renderTable(detail, styles, key);
      case 'detail':
        return renderDetail(detail, styles, key);
      
      // Ant Design Components
      case 'div':
        return renderDiv(detail, styles, key);
      case 'button':
        return renderButton(detail, styles, key);
      case 'search':
        return renderSearch(detail, styles, key);
      case 'switch':
        return renderSwitch(detail, styles, key);
      case 'badge':
        return renderBadge(detail, styles, key);
      case 'dropdown':
        return renderDropdown(detail, styles, key);
      case 'avatar':
        return renderAvatar(detail, styles, key);
      case 'menu':
        return renderMenu(detail, styles, key);
      case 'title':
        return renderTitle(detail, styles, key);
      case 'card':
        return renderCard(detail, styles, key);
      case 'text':
        return renderText(detail, styles, key);
      case 'link':
        return renderLink(detail, styles, key);
      
      // Xingine Components
      case 'ChartRenderer':
        return renderChartRenderer(detail, styles, key);
      case 'FormRenderer':
        return renderFormRenderer(detail, styles, key);
      case 'TableRenderer':
        return renderTableRenderer(detail, styles, key);
      case 'DetailRenderer':
        return renderDetailRenderer(detail, styles, key);
      
      default:
        return <WrapperRenderer key={key} style={styles}>{detail.content || 'Unknown component'}</WrapperRenderer>;
    }
  };

  const renderLayout = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Layout key={key} style={{ minHeight: '100vh', ...styles }}>
      {detail.children?.map((child, index) => renderComponent(child, `layout-${index}`))}
    </Layout>
  );

  const renderHeader = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const userMenuItems = [
      { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
      { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
      { type: 'divider' as const },
      { key: 'logout', label: 'Logout', icon: <LogoutOutlined /> },
    ];

    return (
      <Header
        key={key}
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
                onClick={() => setCollapsed(!collapsed)}
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
                onChange={setDarkMode}
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

  const renderSidebar = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Sider
      key={key}
      theme={darkMode ? 'dark' : 'light'}
      collapsed={isMobile ? false : collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      collapsedWidth={isMobile ? 0 : 80}
      style={{
        position: 'fixed',
        left: 0,
        top: 64,
        height: 'calc(100vh - 64px)',
        zIndex: 999,
        ...styles,
      }}
    >
      <WrapperRenderer style={{ padding: '16px 0' }}>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={detail.props?.menuItems || []}
          style={{ border: 'none' }}
        />
      </WrapperRenderer>
    </Sider>
  );

  const renderContent = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Content
      key={key}
      style={{
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
        marginTop: 64,
        padding: 24,
        minHeight: 'calc(100vh - 64px)',
        background: darkMode ? '#001529' : '#f0f2f5',
        transition: 'margin-left 0.2s',
        ...styles,
      }}
    >
      {detail.children?.map((child, index) => renderComponent(child, `content-${index}`))}
    </Content>
  );

  const renderFooter = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Footer
      key={key}
      style={{
        textAlign: 'center',
        background: darkMode ? '#001529' : '#fff',
        borderTop: '1px solid #f0f0f0',
        ...styles,
      }}
    >
      <Text type="secondary">
        {detail.content || 'Xingine React Layout ©2024 Created with LayoutRenderer'}
      </Text>
    </Footer>
  );

  const renderCharts = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const chartMeta = detail.props as ChartMeta;
    if (!chartMeta?.charts) {
      return <WrapperRenderer key={key} style={styles}>No chart data provided</WrapperRenderer>;
    }
    return <ChartRenderer key={key} {...chartMeta} />;
  };

  const renderForm = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const formMeta = detail.props as FormMeta;
    if (!formMeta?.fields) {
      return <WrapperRenderer key={key} style={styles}>No form configuration provided</WrapperRenderer>;
    }
    return <FormRenderer key={key} {...formMeta} />;
  };

  const renderTable = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const tableMeta = detail.props as TableMeta;
    if (!tableMeta?.columns) {
      return <WrapperRenderer key={key} style={styles}>No table configuration provided</WrapperRenderer>;
    }
    return <TableRenderer key={key} {...tableMeta} />;
  };

  const renderDetail = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const detailMeta = detail.props as DetailMeta;
    if (!detailMeta) {
      return <WrapperRenderer key={key} style={styles}>No detail configuration provided</WrapperRenderer>;
    }
    return <DetailRenderer key={key} {...detailMeta} />;
  };

  // Ant Design Component Renderers
  const renderDiv = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <WrapperRenderer key={key} style={{ ...detail.props?.style, ...styles }} {...detail.props}>
      {detail.content}
      {detail.children?.map((child, index) => renderComponent(child, `${key}-div-${index}`))}
    </WrapperRenderer>
  );

  const renderButton = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Button 
      key={key} 
      style={styles} 
      icon={detail.props?.icon ? React.createElement(getIcon(detail.props.icon)) : undefined}
      {...detail.props}
    >
      {detail.content}
      {detail.children?.map((child, index) => renderComponent(child, `${key}-button-${index}`))}
    </Button>
  );

  const renderSearch = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Search key={key} style={styles} {...detail.props} />
  );

  const renderSwitch = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Switch key={key} style={styles} {...detail.props} />
  );

  const renderBadge = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Badge key={key} style={styles} {...detail.props}>
      {detail.children?.map((child, index) => renderComponent(child, `${key}-badge-${index}`))}
    </Badge>
  );

  const renderDropdown = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Dropdown key={key} {...detail.props}>
      <WrapperRenderer style={styles}>
        {detail.children?.map((child, index) => renderComponent(child, `${key}-dropdown-${index}`))}
      </WrapperRenderer>
    </Dropdown>
  );

  const renderAvatar = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Avatar 
      key={key} 
      style={styles} 
      icon={detail.props?.icon ? React.createElement(getIcon(detail.props.icon)) : undefined}
      {...detail.props} 
    />
  );

  const renderMenu = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Menu key={key} style={styles} {...detail.props} />
  );

  const renderTitle = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Title key={key} style={styles} {...detail.props}>
      {detail.content}
    </Title>
  );

  const renderCard = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Card key={key} style={styles} {...detail.props}>
      {detail.children?.map((child, index) => renderComponent(child, `${key}-card-${index}`))}
    </Card>
  );

  const renderText = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Text key={key} style={styles} {...detail.props}>
      {detail.content}
    </Text>
  );

  const renderLink = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <a key={key} style={styles} {...detail.props}>
      {detail.content}
    </a>
  );

  // Xingine Component Renderers
  const renderChartRenderer = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as ChartMeta;
    if (!meta) return <WrapperRenderer key={key}>No chart meta provided</WrapperRenderer>;
    
    return <ChartRenderer key={key} {...meta} />;
  };

  const renderFormRenderer = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as FormMeta;
    if (!meta) return <WrapperRenderer key={key}>No form meta provided</WrapperRenderer>;
    
    return <FormRenderer key={key} {...meta} />;
  };

  const renderTableRenderer = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as TableMeta;
    if (!meta) return <WrapperRenderer key={key}>No table meta provided</WrapperRenderer>;
    
    return <TableRenderer key={key} {...meta} />;
  };

  const renderDetailRenderer = (detail: CustomUIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as DetailMeta;
    if (!meta) return <WrapperRenderer key={key}>No detail meta provided</WrapperRenderer>;
    
    return <DetailRenderer key={key} {...meta} />;
  };

  // Helper function to get icon components
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      home: HomeOutlined,
      bell: BellOutlined,
      user: UserOutlined,
      setting: SettingOutlined,
      logout: LogoutOutlined,
      dashboard: DashboardOutlined,
      team: TeamOutlined,
      'bar-chart': DashboardOutlined, // Using dashboard as placeholder
    };
    return iconMap[iconName] || UserOutlined;
  };

  return renderComponent(renderer.componentDetail || {
    type: 'layout',
    children: []
  });
};

// Helper function to create a default layout configuration
export const createDefaultLayoutRenderer = (): ExtendedRenderer => ({
  componentDetail: {
    type: 'layout',
    children: [
      {
        type: 'header',
      },
      {
        type: 'sidebar',
      },
      {
        type: 'content',
        children: [
          {
            type: 'charts',
          },
          {
            type: 'form',
          },
          {
            type: 'table',
          },
          {
            type: 'detail',
          },
        ],
      },
      {
        type: 'footer',
      },
    ],
  },
  mode: 'default',
  layout: {
    display: 'flex',
    spacing: 0,
    alignment: 'left',
  },
  responsive: {
    breakpoints: {
      mobile: {
        layout: { display: 'block' },
      },
      desktop: {
        layout: { display: 'flex' },
      },
    },
  },
  display: {
    showBorder: false,
    showShadow: false,
    backgroundColor: '#f0f2f5',
  },
  accessibility: {
    role: 'main',
    ariaLabel: 'Main application layout',
  },
});

export default LayoutRenderer;