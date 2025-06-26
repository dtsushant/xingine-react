import React from 'react';
import { Card } from 'antd';

interface UserDashboardProps {
  layoutComponent?: any;
  [key: string]: any;
}

export const UserDashboard: React.FC<UserDashboardProps> = (props) => {
  return (
    <div style={{ padding: '24px' }}>
      <Card title="User Dashboard">
        <p>User dashboard with navigation boxes and quick actions.</p>
      </Card>
    </div>
  );
};

export default UserDashboard;