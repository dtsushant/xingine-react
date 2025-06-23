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
  Select,
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
import { ExtendedRenderer, ExtendedUIComponent, UIComponentDetail, Renderer, ChartMeta, FormMeta, TableMeta, DetailMeta } from '../types/renderer.types';

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

  // Ant Design Component Renderers
  const renderDiv = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <div key={key} style={{ ...detail.props?.style, ...styles }} {...detail.props}>
      {detail.content}
      {detail.children?.map((child, index) => renderComponent(child, `${key}-div-${index}`))}
    </div>
  );

  const renderButton = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
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

  const renderSearch = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Search key={key} style={styles} {...detail.props} />
  );

  const renderSwitch = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Switch key={key} style={styles} {...detail.props} />
  );

  const renderBadge = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Badge key={key} style={styles} {...detail.props}>
      {detail.children?.map((child, index) => renderComponent(child, `${key}-badge-${index}`))}
    </Badge>
  );

  const renderDropdown = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Dropdown key={key} {...detail.props}>
      <div style={styles}>
        {detail.children?.map((child, index) => renderComponent(child, `${key}-dropdown-${index}`))}
      </div>
    </Dropdown>
  );

  const renderAvatar = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Avatar 
      key={key} 
      style={styles} 
      icon={detail.props?.icon ? React.createElement(getIcon(detail.props.icon)) : undefined}
      {...detail.props} 
    />
  );

  const renderMenu = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Menu key={key} style={styles} {...detail.props} />
  );

  const renderTitle = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Title key={key} style={styles} {...detail.props}>
      {detail.content}
    </Title>
  );

  const renderCard = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Card key={key} style={styles} {...detail.props}>
      {detail.children?.map((child, index) => renderComponent(child, `${key}-card-${index}`))}
    </Card>
  );

  const renderText = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <Text key={key} style={styles} {...detail.props}>
      {detail.content}
    </Text>
  );

  const renderLink = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => (
    <a key={key} style={styles} {...detail.props}>
      {detail.content}
    </a>
  );

  // Xingine Component Renderers
  const renderChartRenderer = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as ChartMeta;
    if (!meta) return <div key={key}>No chart meta provided</div>;
    
    return (
      <div key={key} style={styles}>
        <Row gutter={[16, 16]}>
          {meta.charts.map((chart: any, index: number) => (
            <Col xs={24} sm={12} lg={12} xl={6} key={`chart-${index}`}>
              <Card title={chart.title} style={{ height: '300px' }}>
                <div style={{ width: '100%', height: '250px' }}>
                  {chart.type === 'bar' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chart.datasets?.[0]?.data ? 
                        chart.labels?.map((label: string, i: number) => ({ 
                          name: label, 
                          value: Array.isArray(chart.datasets[0].data) ? chart.datasets[0].data[i] : 0 
                        })) : []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={chart.datasets?.[0]?.backgroundColor || '#1890ff'} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  {chart.type === 'line' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chart.datasets?.[0]?.data ? 
                        chart.labels?.map((label: string, i: number) => ({ 
                          name: label, 
                          value: Array.isArray(chart.datasets[0].data) ? chart.datasets[0].data[i] : 0 
                        })) : []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke={chart.datasets?.[0]?.borderColor || '#52c41a'} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                  {chart.type === 'pie' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chart.labels?.map((label: string, i: number) => ({
                            name: label,
                            value: Array.isArray(chart.datasets?.[0]?.data) ? chart.datasets[0].data[i] : 0
                          }))}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#1890ff"
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const renderFormRenderer = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as FormMeta;
    if (!meta) return <div key={key}>No form meta provided</div>;
    
    return (
      <div key={key} style={styles}>
        <Form layout="vertical" onFinish={(values) => console.log('Form submitted:', values)}>
          <Row gutter={16}>
            {meta.fields.map((field: any, index: number) => (
              <Col xs={24} sm={12} key={field.name}>
                <Form.Item
                  label={field.label}
                  name={field.name}
                  rules={field.required ? [{ required: true, message: `Please input ${field.label}` }] : []}
                >
                  {field.type === 'select' ? (
                    <select style={{ width: '100%', height: '32px' }}>
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input type={field.type} placeholder={field.placeholder} />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const renderTableRenderer = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as TableMeta;
    if (!meta) return <div key={key}>No table meta provided</div>;
    
    return (
      <div key={key} style={styles}>
        <Table
          columns={meta.columns.map((col: any) => ({
            title: col.title,
            dataIndex: col.dataIndex,
            key: col.key,
            width: col.width,
            sorter: col.sortable,
            render: col.render === 'badge' ? (text: string) => (
              <Badge status={text === 'Active' ? 'success' : 'default'} text={text} />
            ) : undefined
          }))}
          dataSource={mockUsers}
          rowKey={meta.rowKey}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </div>
    );
  };

  const renderDetailRenderer = (detail: UIComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as DetailMeta;
    if (!meta) return <div key={key}>No detail meta provided</div>;
    
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      department: 'Engineering',
      status: true,
      createdAt: '2024-01-15',
      lastLogin: '2024-01-23'
    };
    
    return (
      <div key={key} style={styles}>
        <Row gutter={[16, 16]}>
          {meta.fields.map((field: any, index: number) => (
            <Col xs={24} sm={12} lg={8} key={field.name}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>{field.label}:</Text>
                <br />
                {field.type === 'badge' ? (
                  <Badge status="success" text={mockUser[field.name as keyof typeof mockUser]} />
                ) : field.type === 'switch' ? (
                  <Switch checked={mockUser[field.name as keyof typeof mockUser] as boolean} disabled />
                ) : (
                  <Text>{mockUser[field.name as keyof typeof mockUser]}</Text>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
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