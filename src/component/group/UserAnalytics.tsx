import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

interface UserAnalyticsProps {
  layoutComponent?: any;
  [key: string]: any;
}

export const UserAnalytics: React.FC<UserAnalyticsProps> = (props) => {
  const userStats = [
    {
      title: 'Total Users',
      value: 1234,
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      change: 5.2,
      changeType: 'increase'
    },
    {
      title: 'Active Users',
      value: 1180,
      icon: <TeamOutlined style={{ color: '#52c41a' }} />,
      change: 3.1,
      changeType: 'increase'
    },
    {
      title: 'New This Month',
      value: 89,
      icon: <RiseOutlined style={{ color: '#722ed1' }} />,
      change: 12.5,
      changeType: 'increase'
    },
    {
      title: 'Inactive Users',
      value: 54,
      icon: <FallOutlined style={{ color: '#f5222d' }} />,
      change: -2.3,
      changeType: 'decrease'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px' }}>User Analytics Dashboard</h2>
      <Row gutter={[16, 16]}>
        {userStats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                suffix={
                  <span style={{ 
                    color: stat.changeType === 'increase' ? '#52c41a' : '#f5222d',
                    fontSize: '14px' 
                  }}>
                    {stat.changeType === 'increase' ? '+' : ''}{stat.change}%
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserAnalytics;