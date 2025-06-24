import React from 'react';
import { 
  LayoutComponentDetail, 
  LayoutRenderer, 
  UIComponent, 
  ComponentMeta, 
  FormMeta, 
  TableMeta, 
  DetailMeta, 
  ChartMeta 
} from '../types/renderer.types';

// Mock data for forms
const mockUserFormMeta: FormMeta = {
  fields: [
    { 
      key: 'name', 
      label: 'Full Name', 
      inputType: 'text', 
      required: true,
      validation: { required: true, minLength: 2 }
    },
    { 
      key: 'email', 
      label: 'Email', 
      inputType: 'email', 
      required: true,
      validation: { required: true, pattern: '^[^@]+@[^@]+\.[^@]+$' }
    },
    { 
      key: 'age', 
      label: 'Age', 
      inputType: 'number', 
      required: false,
      validation: { min: 18, max: 100 }
    },
    { 
      key: 'role', 
      label: 'Role', 
      inputType: 'select', 
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Manager', value: 'manager' }
      ]
    }
  ],
  submitButton: { label: 'Create User', variant: 'primary' },
  layout: 'vertical'
};

const mockUserTableMeta: TableMeta = {
  columns: [
    { key: 'id', title: 'ID', dataType: 'number', sortable: true },
    { key: 'name', title: 'Name', dataType: 'string', sortable: true },
    { key: 'email', title: 'Email', dataType: 'string', sortable: false },
    { key: 'role', title: 'Role', dataType: 'string', sortable: true },
    { key: 'createdAt', title: 'Created At', dataType: 'date', sortable: true }
  ],
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-01-16' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'manager', createdAt: '2024-01-17' }
  ],
  pagination: { pageSize: 10, showSizeChanger: true },
  filters: true,
  search: true
};

const mockUserDetailMeta: DetailMeta = {
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { key: 'name', label: 'Full Name', value: 'John Doe' },
        { key: 'email', label: 'Email', value: 'john@example.com' },
        { key: 'age', label: 'Age', value: '30' }
      ]
    },
    {
      title: 'System Information',
      fields: [
        { key: 'role', label: 'Role', value: 'Admin' },
        { key: 'status', label: 'Status', value: 'Active' },
        { key: 'lastLogin', label: 'Last Login', value: '2024-01-20 10:30 AM' }
      ]
    }
  ],
  layout: 'horizontal'
};

const mockChartMeta: ChartMeta = {
  type: 'bar',
  data: [
    { name: 'Jan', value: 400, category: 'Sales' },
    { name: 'Feb', value: 300, category: 'Sales' },
    { name: 'Mar', value: 600, category: 'Sales' },
    { name: 'Apr', value: 800, category: 'Sales' }
  ],
  config: {
    xAxis: { dataKey: 'name' },
    yAxis: { dataKey: 'value' },
    title: 'Monthly Sales',
    responsive: true
  }
};

const mockLoginFormMeta: FormMeta = {
  fields: [
    { 
      key: 'username', 
      label: 'Username', 
      inputType: 'text', 
      required: true,
      validation: { required: true, minLength: 3 }
    },
    { 
      key: 'password', 
      label: 'Password', 
      inputType: 'password', 
      required: true,
      validation: { required: true, minLength: 6 }
    }
  ],
  submitButton: { label: 'Login', variant: 'primary' },
  layout: 'vertical'
};

const mockInventoryFormMeta: FormMeta = {
  fields: [
    { 
      key: 'productName', 
      label: 'Product Name', 
      inputType: 'text', 
      required: true,
      validation: { required: true, minLength: 2 }
    },
    { 
      key: 'sku', 
      label: 'SKU', 
      inputType: 'text', 
      required: true,
      validation: { required: true }
    },
    { 
      key: 'quantity', 
      label: 'Quantity', 
      inputType: 'number', 
      required: true,
      validation: { required: true, min: 0 }
    },
    { 
      key: 'price', 
      label: 'Price', 
      inputType: 'number', 
      required: true,
      validation: { required: true, min: 0 }
    }
  ],
  submitButton: { label: 'Add Inventory', variant: 'primary' },
  layout: 'vertical'
};

// Module configurations following new architecture
export const createUserModuleUIComponents = (): UIComponent[] => {
  return [
    // User module main layout (default)
    {
      type: "default",
      header: {
        meta: {
          component: "HeaderRenderer",
          isMenuItem: false,
          content: "User Management Header"
        }
      },
      sider: {
        meta: {
          component: "SidebarRenderer",
          isMenuItem: false,
          children: [
            {
              path: "/user/create",
              isMenuItem: true,
              component: "FormRenderer",
              content: "Create User",
              meta: {
                component: "FormRenderer",
                properties: mockUserFormMeta
              } as ComponentMeta<"FormRenderer">
            },
            {
              path: "/user/list",
              isMenuItem: true,
              component: "TableRenderer", 
              content: "User List",
              meta: {
                component: "TableRenderer",
                properties: mockUserTableMeta
              } as ComponentMeta<"TableRenderer">
            },
            {
              path: "/user/detail",
              isMenuItem: true,
              component: "DetailRenderer",
              content: "User Detail",
              meta: {
                component: "DetailRenderer", 
                properties: mockUserDetailMeta
              } as ComponentMeta<"DetailRenderer">
            }
          ]
        }
      },
      content: {
        meta: {
          component: "ContentRenderer",
          isMenuItem: false,
          content: "User Dashboard",
          children: [
            {
              component: "ChartRenderer",
              isMenuItem: false,
              content: "User Statistics",
              meta: {
                component: "ChartRenderer",
                properties: mockChartMeta
              } as ComponentMeta<"ChartRenderer">
            }
          ]
        }
      },
      footer: {
        meta: {
          component: "FooterRenderer",
          isMenuItem: false,
          content: "User Module Footer"
        }
      }
    } as LayoutRenderer,

    // User Create Form
    {
      path: "/user/create",
      isMenuItem: true,
      component: "FormRenderer",
      content: "Create User",
      meta: {
        component: "FormRenderer",
        properties: mockUserFormMeta
      } as ComponentMeta<"FormRenderer">
    } as LayoutComponentDetail,

    // User List Table  
    {
      path: "/user/list",
      isMenuItem: true,
      component: "TableRenderer",
      content: "User List", 
      meta: {
        component: "TableRenderer",
        properties: mockUserTableMeta
      } as ComponentMeta<"TableRenderer">
    } as LayoutComponentDetail,

    // User Detail View
    {
      path: "/user/detail",
      isMenuItem: true,
      component: "DetailRenderer",
      content: "User Detail",
      meta: {
        component: "DetailRenderer",
        properties: mockUserDetailMeta
      } as ComponentMeta<"DetailRenderer">
    } as LayoutComponentDetail
  ];
};

export const createUserLoginUIComponents = (): UIComponent[] => {
  return [
    // User Login (public layout)
    {
      type: "public",
      header: {
        meta: {
          component: "HeaderRenderer", 
          isMenuItem: false,
          content: "Login Header"
        }
      },
      content: {
        meta: {
          component: "ContentRenderer",
          isMenuItem: false,
          content: "Login Form",
          children: [
            {
              component: "FormRenderer",
              isMenuItem: false,
              content: "User Login Form",
              meta: {
                component: "FormRenderer",
                properties: mockLoginFormMeta
              } as ComponentMeta<"FormRenderer">
            }
          ]
        }
      },
      footer: {
        meta: {
          component: "FooterRenderer",
          isMenuItem: false,
          content: "Login Footer"
        }
      }
    } as LayoutRenderer,

    // Login Form Component
    {
      path: "/login",
      isMenuItem: false,
      component: "FormRenderer",
      content: "Login",
      meta: {
        component: "FormRenderer",
        properties: mockLoginFormMeta
      } as ComponentMeta<"FormRenderer">
    } as LayoutComponentDetail
  ];
};

export const createInventoryUIComponents = (): UIComponent[] => {
  return [
    // Inventory module (custom layout)
    {
      type: "custom",
      header: {
        meta: {
          component: "HeaderRenderer",
          isMenuItem: false,
          content: "Inventory Management"
        }
      },
      sider: {
        meta: {
          component: "SidebarRenderer",
          isMenuItem: false,
          children: [
            {
              path: "/inventory/add",
              isMenuItem: true,
              component: "FormRenderer",
              content: "Add Inventory",
              meta: {
                component: "FormRenderer",
                properties: mockInventoryFormMeta
              } as ComponentMeta<"FormRenderer">
            },
            {
              path: "/inventory/list", 
              isMenuItem: true,
              component: "TableRenderer",
              content: "Inventory List",
              meta: {
                component: "TableRenderer",
                properties: {
                  ...mockUserTableMeta,
                  columns: [
                    { key: 'id', title: 'ID', dataType: 'number', sortable: true },
                    { key: 'productName', title: 'Product', dataType: 'string', sortable: true },
                    { key: 'sku', title: 'SKU', dataType: 'string', sortable: false },
                    { key: 'quantity', title: 'Qty', dataType: 'number', sortable: true },
                    { key: 'price', title: 'Price', dataType: 'number', sortable: true }
                  ],
                  data: [
                    { id: 1, productName: 'Laptop', sku: 'LP001', quantity: 50, price: 999.99 },
                    { id: 2, productName: 'Mouse', sku: 'MS001', quantity: 200, price: 29.99 }
                  ]
                }
              } as ComponentMeta<"TableRenderer">
            },
            {
              path: "/inventory/detail",
              isMenuItem: true, 
              component: "DetailRenderer",
              content: "Inventory Detail",
              meta: {
                component: "DetailRenderer",
                properties: {
                  ...mockUserDetailMeta,
                  sections: [
                    {
                      title: 'Product Information',
                      fields: [
                        { key: 'productName', label: 'Product Name', value: 'Laptop' },
                        { key: 'sku', label: 'SKU', value: 'LP001' },
                        { key: 'category', label: 'Category', value: 'Electronics' }
                      ]
                    },
                    {
                      title: 'Stock Information',
                      fields: [
                        { key: 'quantity', label: 'Quantity', value: '50' },
                        { key: 'price', label: 'Price', value: '$999.99' },
                        { key: 'supplier', label: 'Supplier', value: 'Tech Corp' }
                      ]
                    }
                  ]
                }
              } as ComponentMeta<"DetailRenderer">
            }
          ]
        }
      },
      content: {
        meta: {
          component: "ContentRenderer",
          isMenuItem: false,
          content: "Inventory Dashboard"
        }
      },
      footer: {
        meta: {
          component: "FooterRenderer",
          isMenuItem: false,
          content: "Inventory Module Footer"
        }
      }
    } as LayoutRenderer
  ];
};

// Helper function to create a combined module example
export const createXingineLayoutExample = () => {
  return {
    userModule: createUserModuleUIComponents(),
    userLoginModule: createUserLoginUIComponents(), 
    inventoryModule: createInventoryUIComponents()
  };
};