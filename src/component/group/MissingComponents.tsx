import React from 'react';
import { Card, Form, Input, Button, Select } from 'antd';

// Generic placeholder components for missing form/action components
export const AddRole: React.FC = () => (
  <Card title="Add Role">
    <Form layout="vertical">
      <Form.Item label="Role Name">
        <Input placeholder="Enter role name" />
      </Form.Item>
      <Form.Item label="Permissions">
        <Select mode="multiple" placeholder="Select permissions">
          <Select.Option value="read">Read</Select.Option>
          <Select.Option value="write">Write</Select.Option>
          <Select.Option value="delete">Delete</Select.Option>
        </Select>
      </Form.Item>
      <Button type="primary">Add Role</Button>
    </Form>
  </Card>
);

export const UserCreate: React.FC = () => (
  <Card title="Create User">
    <p>User creation form component</p>
  </Card>
);

export const UserList: React.FC = () => (
  <Card title="User List">
    <p>User list table component</p>
  </Card>
);

export const UserDetail: React.FC = () => (
  <Card title="User Detail">
    <p>User detail view component</p>
  </Card>
);

export const NewCategory: React.FC = () => (
  <Card title="New Category">
    <Form layout="vertical">
      <Form.Item label="Category Name">
        <Input placeholder="Enter category name" />
      </Form.Item>
      <Form.Item label="Description">
        <Input.TextArea placeholder="Enter category description" />
      </Form.Item>
      <Button type="primary">Create Category</Button>
    </Form>
  </Card>
);

export const CreateInventory: React.FC = () => (
  <Card title="Create Inventory Item">
    <p>Inventory creation form component</p>
  </Card>
);

export const UpdateInventory: React.FC = () => (
  <Card title="Update Inventory Item">
    <p>Inventory update form component</p>
  </Card>
);

export const StockAdjustment: React.FC = () => (
  <Card title="Stock Adjustment">
    <Form layout="vertical">
      <Form.Item label="Item">
        <Select placeholder="Select item">
          <Select.Option value="item1">Item 1</Select.Option>
          <Select.Option value="item2">Item 2</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Adjustment Quantity">
        <Input type="number" placeholder="Enter adjustment quantity" />
      </Form.Item>
      <Button type="primary">Adjust Stock</Button>
    </Form>
  </Card>
);

export const CreatePurchaseOrder: React.FC = () => (
  <Card title="Create Purchase Order">
    <p>Purchase order creation form component</p>
  </Card>
);

export const UpdatePurchaseOrder: React.FC = () => (
  <Card title="Update Purchase Order">
    <p>Purchase order update form component</p>
  </Card>
);