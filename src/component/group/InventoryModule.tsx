import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { ShoppingOutlined, FormOutlined, TableOutlined, BarChartOutlined } from '@ant-design/icons';

interface InventoryModuleProps {
  layoutComponent?: any;
  [key: string]: any;
}

export const InventoryModule: React.FC<InventoryModuleProps> = (props) => {
  const navigationBoxes = [
    {
      title: 'Add Inventory',
      icon: <FormOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      path: '/inventory/add',
      description: 'Add new items to inventory'
    },
    {
      title: 'Inventory List',
      icon: <TableOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      path: '/inventory/list',
      description: 'View and manage inventory items'
    },
    {
      title: 'Item Details',
      icon: <ShoppingOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      path: '/inventory/detail',
      description: 'View detailed item information'
    },
    {
      title: 'Inventory Analytics',
      icon: <BarChartOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
      path: '/inventory/chart',
      description: 'View inventory statistics and charts'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Inventory Management System</h1>
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

export default InventoryModule;