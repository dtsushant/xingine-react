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
      name: 'name',
      label: 'Full Name', 
      inputType: 'input', 
      required: true,
      properties: { placeholder: 'Enter your full name', minLength: 2 }
    },
    { 
      name: 'email',
      label: 'Email', 
      inputType: 'input', 
      required: true,
      properties: { placeholder: 'Enter your email' }
    },
    { 
      name: 'age',
      label: 'Age', 
      inputType: 'number', 
      required: false,
      properties: { min: 18, max: 100 }
    },
    { 
      name: 'role',
      label: 'Role', 
      inputType: 'select', 
      required: true,
      properties: { 
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
          { label: 'Manager', value: 'manager' }
        ]
      }
    }
  ],
  action: '/api/users'
};

const mockUserTableMeta: TableMeta = {
  columns: [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: false },
    { key: 'role', title: 'Role', sortable: true },
    { key: 'createdAt', title: 'Created At', sortable: true }
  ],
  dataSourceUrl: '/api/users',
  rowKey: 'id'
};

const mockUserDetailMeta: DetailMeta = {
  fields: [
    { name: 'name', label: 'Full Name', inputType: 'text', value: 'John Doe' },
    { name: 'email', label: 'Email', inputType: 'text', value: 'john@example.com' },
    { name: 'role', label: 'Role', inputType: 'text', value: 'Admin' },
    { name: 'status', label: 'Status', inputType: 'text', value: 'Active' }
  ],
  action: '/api/user-detail'
};

const mockChartMeta: ChartMeta = {
  charts: [
    {
      type: 'bar',
      title: 'Monthly Sales',
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [
        {
          label: 'Sales',
          data: [400, 300, 600, 800],
          backgroundColor: '#1890ff'
        }
      ]
    }
  ]
};

const mockLoginFormMeta: FormMeta = {
  fields: [
    { 
      name: 'username',
      label: 'Username', 
      inputType: 'input', 
      required: true,
      properties: { placeholder: 'Enter your username', minLength: 3 }
    },
    { 
      name: 'password',
      label: 'Password', 
      inputType: 'password', 
      required: true,
      properties: { placeholder: 'Enter your password', minLength: 6 }
    }
  ],
  action: '/api/login'
};

const mockInventoryFormMeta: FormMeta = {
  fields: [
    { 
      name: 'productName',
      label: 'Product Name', 
      inputType: 'input', 
      required: true,
      properties: { placeholder: 'Enter product name', minLength: 2 }
    },
    { 
      name: 'sku',
      label: 'SKU', 
      inputType: 'input', 
      required: true,
      properties: { placeholder: 'Enter SKU' }
    },
    { 
      name: 'quantity',
      label: 'Quantity', 
      inputType: 'number', 
      required: true,
      properties: { min: 0 }
    },
    { 
      name: 'price',
      label: 'Price', 
      inputType: 'number', 
      required: true,
      properties: { min: 0 }
    }
  ],
  action: '/api/inventory'
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
                  columns: [
                    { key: 'id', title: 'ID', sortable: true },
                    { key: 'productName', title: 'Product', sortable: true },
                    { key: 'sku', title: 'SKU', sortable: false },
                    { key: 'quantity', title: 'Qty', sortable: true },
                    { key: 'price', title: 'Price', sortable: true }
                  ],
                  dataSourceUrl: '/api/inventory',
                  rowKey: 'id'
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
                  fields: [
                    { name: 'productName', label: 'Product Name', inputType: 'text', value: 'Laptop' },
                    { name: 'sku', label: 'SKU', inputType: 'text', value: 'LP001' },
                    { name: 'quantity', label: 'Quantity', inputType: 'text', value: '50' },
                    { name: 'price', label: 'Price', inputType: 'text', value: '$999.99' }
                  ],
                  action: '/api/inventory-detail'
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