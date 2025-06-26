import React from 'react';
import { Card } from 'antd';

interface InventoryDashboardProps {
  layoutComponent?: any;
  [key: string]: any;
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = (props) => {
  return (
    <div style={{ padding: '24px' }}>
      <Card title="Inventory Dashboard">
        <p>Inventory dashboard with quick access to inventory management features.</p>
      </Card>
    </div>
  );
};

export default InventoryDashboard;