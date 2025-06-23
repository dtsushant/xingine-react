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
  Form,
  Table,
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
  FormOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ExtendedRenderer, ExtendedUIComponent, UIComponentDetail, Renderer } from '../types/renderer.types';

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// Mock data
const mockChartData = [
  { name: 'Jan', sales: 4000, revenue: 2400, users: 240 },
  { name: 'Feb', sales: 3000, revenue: 1398, users: 221 },
  { name: 'Mar', sales: 2000, revenue: 9800, users: 229 },
  { name: 'Apr', sales: 2780, revenue: 3908, users: 200 },
  { name: 'May', sales: 1890, revenue: 4800, users: 218 },
  { name: 'Jun', sales: 2390, revenue: 3800, users: 250 },
];

const mockPieData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 300 },
  { name: 'Other', value: 200 },
];

const mockUsers = [
  { key: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { key: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { key: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive' },
];

const mockMenuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: 'users', label: 'Users', icon: <TeamOutlined /> },
  { key: 'forms', label: 'Forms', icon: <FormOutlined /> },
  { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
];

interface LayoutRendererProps {
  renderer: ExtendedRenderer;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ renderer }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [form] = Form.useForm();
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
        return <div key={key}>No component detail provided</div>;
      }
    }

    // Handle case where component might be a plain object or UIComponentDetail
    if (!component || typeof component !== 'object') {
      return <div key={key}>Invalid component</div>;
    }

    // Check if it's a standard UIComponent with component property
    if ('component' in component && component.component) {
      // This is an xingine UIComponent, convert to UIComponentDetail for rendering
      const detail: UIComponentDetail = {
        type: component.component,
        props: component.meta || {},
        content: component.component
      };
      return renderComponent(detail, key);
    }

    // It's a UIComponentDetail
    const detail = component as UIComponentDetail;
    const styles = 'componentDetail' in component ? applyRendererStyles(component as ExtendedRenderer) : {};

    switch (detail.type) {
      case 'layout':
        return renderLayout(detail, styles, key);
      case 'header':
        return renderHeader(detail, styles, key);
      case 'sidebar':
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
      default:
        return <div key={key} style={styles}>{detail.content || 'Unknown component'}</div>;
    }
  };

  const renderLayout = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Layout key={key} style={{ minHeight: '100vh', ...styles }}>
      {detail.children?.map((child, index) => renderComponent(child, `layout-${index}`))}
    </Layout>
  );

  const renderHeader = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => {
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

  const renderSidebar = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
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
      <div style={{ padding: '16px 0' }}>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={mockMenuItems}
          style={{ border: 'none' }}
        />
      </div>
    </Sider>
  );

  const renderContent = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
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

  const renderFooter = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
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

  const renderCharts = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Row key={key} gutter={[16, 16]} style={{ marginBottom: 24, ...styles }}>
      <Col xs={24} sm={12} lg={6}>
        <Card title="Bar Chart" size="small">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card title="Pie Chart" size="small">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockPieData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#82ca9d"
                dataKey="value"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card title="Line Chart" size="small">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card title="Area Chart" size="small">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#ff7300" fill="#ff7300" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );

  const renderForm = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Card key={key} title="User Creation Form" style={{ marginBottom: 24, ...styles }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log('Form submitted:', values);
          // Mock form submission
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: 'Please enter full name' }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please select role' }]}
            >
              <Input placeholder="Enter role" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Input placeholder="Enter status" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create User
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  const renderTable = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Role', dataIndex: 'role', key: 'role' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
    ];

    return (
      <Card key={key} title="Users Table" style={{ marginBottom: 24, ...styles }}>
        <Table
          columns={columns}
          dataSource={mockUsers}
          size="small"
          scroll={{ x: true }}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    );
  };

  const renderDetail = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Card key={key} title="Detailed Renderer Demo" style={{ ...styles }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>Nested Renderer Example</Title>
        <Text>
          This demonstrates the recursive rendering capability of the LayoutRenderer.
          The entire layout is generated from the Renderer configuration without direct HTML usage.
        </Text>
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="Configuration">
              <Text code>Mode: {renderer.mode || 'default'}</Text>
              <br />
              <Text code>Layout: {renderer.layout?.display || 'flex'}</Text>
              <br />
              <Text code>Responsive: {renderer.responsive ? 'enabled' : 'disabled'}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="Features">
              <ul>
                <li>Recursive component rendering</li>
                <li>Responsive design support</li>
                <li>Antd component integration</li>
                <li>Mock data handling</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  );

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