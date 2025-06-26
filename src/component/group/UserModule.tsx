import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { UserOutlined, FormOutlined, TableOutlined, BarChartOutlined } from '@ant-design/icons';

interface UserModuleProps {
  layoutComponent?: any;
  [key: string]: any;
}

export const UserModule: React.FC<UserModuleProps> = (props) => {
  const navigationBoxes = [
    {
      title: 'Create User',
      icon: <FormOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/user/create',
      description: 'Add new users to the system'
    },
    {
      title: 'User List',
      icon: <TableOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      path: '/user/list',
      description: 'View and manage all users'
    },
    {
      title: 'User Details',
      icon: <UserOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: '/user/detail',
      description: 'View detailed user information'
    },
    {
      title: 'User Analytics',
      icon: <BarChartOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
      path: '/user/chart',
      description: 'View user statistics and charts'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>User Management System</h1>
      <Row gutter={[16, 16]}>
        {navigationBoxes.map((box, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '200px' }}
              bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <div style={{ marginBottom: '16px' }}>
                {box.icon}
              </div>
              <h3 style={{ marginBottom: '8px' }}>{box.title}</h3>
              <p style={{ color: '#666', marginBottom: '16px', fontSize: '12px' }}>
                {box.description}
              </p>
              <Button type="primary" size="small">
                Go to {box.title}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserModule;