import React from 'react';
import { 

  FormMeta, 
  TableMeta, 
  DetailMeta, 
  ChartMeta 
} from '../types/renderer.types';
import {LayoutComponentDetail, LayoutRenderer} from "xingine";

// Complete registry data that can be passed to the LayoutComponentRegistryService

// User Module Components - Default Layout
const userCreateFormMeta: FormMeta = {
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
      properties: { placeholder: 'Enter your email', email: true }
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
    },
    { 
      name: 'department',
      label: 'Department', 
      inputType: 'select', 
      required: true,
      properties: { 
        options: [
          { label: 'Engineering', value: 'engineering' },
          { label: 'HR', value: 'hr' },
          { label: 'Sales', value: 'sales' },
          { label: 'Marketing', value: 'marketing' }
        ]
      }
    }
  ],
  action: '/api/users'
};

const userTableMeta: TableMeta = {
  columns: [
    { dataIndex: 'id', title: 'ID', sortable: true, filterable: { apply: false } },
    { dataIndex: 'name', title: 'Name', sortable: true, filterable: { apply: true } },
    { dataIndex: 'email', title: 'Email', sortable: true, filterable: { apply: true } },
    { dataIndex: 'role', title: 'Role', sortable: true, filterable: { apply: true } },
    { dataIndex: 'department', title: 'Department', sortable: true, filterable: { apply: true } },
    { dataIndex: 'status', title: 'Status', sortable: true, filterable: { apply: true } }
  ],
  dataSourceUrl: '/api/users',
  rowKey: 'id'
};

const userDetailMeta: DetailMeta = {
  fields: [
    { name: 'name', label: 'Full Name', inputType: 'text' },
    { name: 'email', label: 'Email', inputType: 'text' },
    { name: 'age', label: 'Age', inputType: 'number' },
    { name: 'phone', label: 'Phone', inputType: 'text' },
    { name: 'role', label: 'Role', inputType: 'text' },
    { name: 'department', label: 'Department', inputType: 'text' },
    { name: 'startDate', label: 'Start Date', inputType: 'date' },
    { name: 'street', label: 'Street Address', inputType: 'text' },
    { name: 'city', label: 'City', inputType: 'text' },
    { name: 'state', label: 'State', inputType: 'text' },
    { name: 'zipCode', label: 'ZIP Code', inputType: 'text' }
  ],
  action: '/api/users'
};

// Inventory Module Components - Custom Layout
const inventoryFormMeta: FormMeta = {
  fields: [
    { 
      name: 'name',
      label: 'Product Name', 
      inputType: 'input', 
      required: true,
      properties: { placeholder: 'Enter product name' }
    },
    { 
      name: 'sku',
      label: 'SKU', 
      inputType: 'input', 
      required: true,
      properties: { placeholder: 'Product SKU' }
    },
    { 
      name: 'category',
      label: 'Category', 
      inputType: 'select', 
      required: true,
      properties: { 
        options: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Books', value: 'books' },
          { label: 'Home & Garden', value: 'home' }
        ]
      }
    },
    { 
      name: 'price',
      label: 'Price', 
      inputType: 'number', 
      required: true,
      properties: { min: 0, step: 0.01 }
    },
    { 
      name: 'quantity',
      label: 'Quantity', 
      inputType: 'number', 
      required: true,
      properties: { min: 0 }
    },
    { 
      name: 'description',
      label: 'Description', 
      inputType: 'textarea', 
      required: false,
      properties: { rows: 4, placeholder: 'Product description' }
    }
  ],
  action: '/api/inventory'
};

const inventoryTableMeta: TableMeta = {
  columns: [
    { dataIndex: 'id', title: 'ID', sortable: true, filterable: { apply: false } },
    { dataIndex: 'name', title: 'Product Name', sortable: true, filterable: { apply: true } },
    { dataIndex: 'sku', title: 'SKU', sortable: true, filterable: { apply: true } },
    { dataIndex: 'category', title: 'Category', sortable: true, filterable: { apply: true } },
    { dataIndex: 'price', title: 'Price', sortable: true, filterable: { apply: false } },
    { dataIndex: 'quantity', title: 'Quantity', sortable: true, filterable: { apply: false } },
    { dataIndex: 'status', title: 'Status', sortable: true, filterable: { apply: true } }
  ],
  dataSourceUrl: '/api/inventory',
  rowKey: 'id'
};

const inventoryDetailMeta: DetailMeta = {
  fields: [
    { name: 'name', label: 'Product Name', inputType: 'text' },
    { name: 'sku', label: 'SKU', inputType: 'text' },
    { name: 'category', label: 'Category', inputType: 'text' },
    { name: 'brand', label: 'Brand', inputType: 'text' },
    { name: 'price', label: 'Unit Price', inputType: 'number' },
    { name: 'quantity', label: 'Stock Quantity', inputType: 'number' },
    { name: 'reorderLevel', label: 'Reorder Level', inputType: 'number' },
    { name: 'supplier', label: 'Supplier', inputType: 'text' },
    { name: 'description', label: 'Description', inputType: 'text' },
    { name: 'weight', label: 'Weight (kg)', inputType: 'number' },
    { name: 'dimensions', label: 'Dimensions', inputType: 'text' },
    { name: 'color', label: 'Color', inputType: 'text' }
  ],
  action: '/api/inventory'
};

// Login Form for Public Layout
const loginFormMeta: FormMeta = {
  fields: [
    { 
      name: 'username',
      label: 'Username', 
      inputType: 'input', 
      required: true,
      properties: { placeholder: 'Enter your username' }
    },
    { 
      name: 'password',
      label: 'Password', 
      inputType: 'password', 
      required: true,
      properties: { placeholder: 'Enter your password' }
    },
    { 
      name: 'rememberMe',
      label: 'Remember Me', 
      inputType: 'checkbox', 
      required: false,
      properties: {}
    }
  ],
  action: '/api/auth/login'
};

// Chart configurations
const userChartMeta: ChartMeta = {
  charts: [
    {
      type: 'bar',
      title: 'Users by Department',
      labels: ['Engineering', 'HR', 'Sales', 'Marketing'],
      datasets: [
        {
          label: 'User Count',
          data: [45, 12, 28, 35],
          backgroundColor: '#8884d8'
        }
      ]
    }
  ]
};

const inventoryChartMeta: ChartMeta = {
  charts: [
    {
      type: 'pie',
      title: 'Inventory by Category',
      labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
      datasets: [
        {
          label: 'Inventory Count',
          data: [35, 25, 20, 20]
        }
      ]
    }
  ]
};

// Complete Layout Component Registry Data
export const getRegistryData = (): LayoutComponentDetail[] => {
  return [/*
    // User Module - Default Layout
    {
      path: '/user',
      isMenuItem: true,
      component: 'UserModule',
      content: 'User Management System',
      children: [
        {
          path: '/user/dashboard',
          isMenuItem: true,
          component: 'UserDashboard',
          content: 'User Dashboard with Navigation Boxes',
          children: [
            {
              path: '/user/create',
              isMenuItem: false,
              component: 'FormRenderer',
              content: 'Create New User',
              meta: {
                component: 'FormRenderer',
                properties: userCreateFormMeta
              }
            },
            {
              path: '/user/list',
              isMenuItem: false,
              component: 'TableRenderer',
              content: 'User List',
              meta: {
                component: 'TableRenderer',
                properties: userTableMeta
              }
            },
            {
              path: '/user/detail/:id',
              isMenuItem: false,
              component: 'DetailRenderer',
              content: 'User Details',
              meta: {
                component: 'DetailRenderer',
                properties: userDetailMeta
              }
            },
            {
              path: '/user/chart',
              isMenuItem: false,
              component: 'ChartRenderer',
              content: 'User Analytics',
              meta: {
                component: 'ChartRenderer',
                properties: userChartMeta
              }
            }
          ]
        },
        {
          path: '/user/create',
          isMenuItem: true,
          component: 'FormRenderer',
          content: 'Create User',
          meta: {
            component: 'FormRenderer',
            properties: userCreateFormMeta
          }
        },
        {
          path: '/user/list',
          isMenuItem: true,
          component: 'TableRenderer',
          content: 'User List',
          meta: {
            component: 'TableRenderer',
            properties: userTableMeta
          }
        },
        {
          path: '/user/detail',
          isMenuItem: true,
          component: 'DetailRenderer',
          content: 'User Details',
          meta: {
            component: 'DetailRenderer',
            properties: userDetailMeta
          }
        }
      ]
    },

    // Inventory Module - Custom Layout
    {
      path: '/inventory',
      isMenuItem: true,
      component: 'InventoryModule',
      content: 'Inventory Management System',
      children: [
        {
          path: '/inventory/dashboard',
          isMenuItem: true,
          component: 'InventoryDashboard',
          content: 'Inventory Dashboard',
          children: [
            {
              path: '/inventory/add',
              isMenuItem: false,
              component: 'FormRenderer',
              content: 'Add Inventory Item',
              meta: {
                component: 'FormRenderer',
                properties: inventoryFormMeta
              }
            },
            {
              path: '/inventory/list',
              isMenuItem: false,
              component: 'TableRenderer',
              content: 'Inventory List',
              meta: {
                component: 'TableRenderer',
                properties: inventoryTableMeta
              }
            },
            {
              path: '/inventory/detail/:id',
              isMenuItem: false,
              component: 'DetailRenderer',
              content: 'Inventory Item Details',
              meta: {
                component: 'DetailRenderer',
                properties: inventoryDetailMeta
              }
            },
            {
              path: '/inventory/chart',
              isMenuItem: false,
              component: 'ChartRenderer',
              content: 'Inventory Analytics',
              meta: {
                component: 'ChartRenderer',
                properties: inventoryChartMeta
              }
            }
          ]
        },
        {
          path: '/inventory/add',
          isMenuItem: true,
          component: 'FormRenderer',
          content: 'Add Item',
          meta: {
            component: 'FormRenderer',
            properties: inventoryFormMeta
          }
        },
        {
          path: '/inventory/list',
          isMenuItem: true,
          component: 'TableRenderer',
          content: 'Inventory List',
          meta: {
            component: 'TableRenderer',
            properties: inventoryTableMeta
          }
        },
        {
          path: '/inventory/detail',
          isMenuItem: true,
          component: 'DetailRenderer',
          content: 'Item Details',
          meta: {
            component: 'DetailRenderer',
            properties: inventoryDetailMeta
          }
        }
      ]
    },

    // Dashboard - Tailwind Layout
    {
      path: '/dashboard',
      isMenuItem: true,
      component: 'WrapperRenderer',
      content: 'Analytics Dashboard',
      meta: {
        component: 'WrapperRenderer' as any,
        properties: {
          className: 'tailwind-dashboard-container'
        }
      },
      children: [
        // Charts Row
        {
          path: '',
          isMenuItem: false,
          component: 'WrapperRenderer',
          content: 'Charts Section',
          meta: {
            component: 'WrapperRenderer',
            properties: {
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
            }
          },
          children: [
            {
              path: '',
              isMenuItem: false,
              component: 'ChartRenderer',
              content: 'Monthly Sales Chart',
              meta: {
                component: 'ChartRenderer',
                properties: {
                  title: 'Monthly Sales',
                  type: 'bar' as const,
                  data: [
                    { name: 'Jan', value: 400 },
                    { name: 'Feb', value: 300 },
                    { name: 'Mar', value: 600 },
                    { name: 'Apr', value: 800 },
                    { name: 'May', value: 700 }
                  ],
                  xKey: 'name',
                  yKey: 'value',
                  color: '#8884d8'
                }
              }
            },
            {
              path: '',
              isMenuItem: false,
              component: 'ChartRenderer',
              content: 'Weekly Growth Chart',
              meta: {
                component: 'ChartRenderer',
                properties: {
                  title: 'Weekly Growth',
                  type: 'line' as const,
                  data: [
                    { name: 'Week 1', value: 100 },
                    { name: 'Week 2', value: 200 },
                    { name: 'Week 3', value: 150 },
                    { name: 'Week 4', value: 300 }
                  ],
                  xKey: 'name',
                  yKey: 'value',
                  color: '#82ca9d'
                }
              }
            },
            {
              path: '',
              isMenuItem: false,
              component: 'ChartRenderer',
              content: 'Device Usage Chart',
              meta: {
                component: 'ChartRenderer',
                properties: {
                  title: 'Device Usage',
                  type: 'pie' as const,
                  data: [
                    { name: 'Desktop', value: 400 },
                    { name: 'Mobile', value: 300 },
                    { name: 'Tablet', value: 100 }
                  ],
                  nameKey: 'name',
                  dataKey: 'value'
                }
              }
            },
            {
              path: '',
              isMenuItem: false,
              component: 'ChartRenderer',
              content: 'Quarterly Revenue Chart',
              meta: {
                component: 'ChartRenderer',
                properties: {
                  title: 'Quarterly Revenue',
                  type: 'area' as const,
                  data: [
                    { name: 'Q1', value: 1000 },
                    { name: 'Q2', value: 1200 },
                    { name: 'Q3', value: 900 },
                    { name: 'Q4', value: 1500 }
                  ],
                  xKey: 'name',
                  yKey: 'value',
                  color: '#ffc658'
                }
              }
            }
          ]
        },
        // Form and Table Row
        {
          path: '',
          isMenuItem: false,
          component: 'WrapperRenderer',
          content: 'Forms and Tables Section',
          meta: {
            component: 'WrapperRenderer',
            properties: {
              className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'
            }
          },
          children: [
            {
              path: '',
              isMenuItem: false,
              component: 'FormRenderer',
              content: 'Quick User Form',
              meta: {
                component: 'FormRenderer',
                properties: userCreateFormMeta
              }
            },
            {
              path: '',
              isMenuItem: false,
              component: 'TableRenderer',
              content: 'Users Table',
              meta: {
                component: 'TableRenderer',
                properties: userTableMeta
              }
            }
          ]
        },
        // Detail and Popup Row
        {
          path: '',
          isMenuItem: false,
          component: 'WrapperRenderer',
          content: 'Details Section',
          meta: {
            component: 'WrapperRenderer',
            properties: {
              className: 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow'
            }
          },
          children: [
            {
              path: '',
              isMenuItem: false,
              component: 'DetailRenderer',
              content: 'User Detail View',
              meta: {
                component: 'DetailRenderer',
                properties: userDetailMeta
              }
            },
            {
              path: '',
              isMenuItem: false,
              component: 'PopupRenderer',
              content: 'Profile Popup',
              meta: {
                component: 'PopupRenderer',
                properties: {
                  title: 'User Profile Details',
                  triggerText: 'View Full Profile',
                  width: 800,
                  height: 600,
                  content: `
                    <div class="space-y-6">
                      <div class="flex items-center space-x-4">
                        <img src="https://via.placeholder.com/100" alt="Profile" class="w-20 h-20 rounded-full">
                        <div>
                          <h2 class="text-2xl font-bold">John Doe</h2>
                          <p class="text-gray-600">IT Department</p>
                        </div>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <h3 class="font-semibold mb-2">Contact Information</h3>
                          <p><strong>Email:</strong> john@example.com</p>
                          <p><strong>Phone:</strong> +1234567890</p>
                        </div>
                        <div>
                          <h3 class="font-semibold mb-2">Role & Permissions</h3>
                          <p><strong>Role:</strong> Admin</p>
                          <p><strong>Permissions:</strong> Read, Write, Delete</p>
                        </div>
                      </div>
                      <div>
                        <h3 class="font-semibold mb-2">Biography</h3>
                        <p>Experienced administrator with 5+ years in system management.</p>
                      </div>
                    </div>
                  `
                }
              }
            }
          ]
        }
      ]
    },

    // Login - Public Layout
    {
      path: '/login',
      isMenuItem: true,
      component: 'FormRenderer',
      content: 'User Login',
      meta: {
        component: 'FormRenderer',
        properties: loginFormMeta
      }
    },

    // Navigation and Layout Components
    {
      path: '',
      isMenuItem: false,
      component: 'HeaderRenderer',
      content: 'Main Header',
      children: [
        {
          path: '',
          isMenuItem: false,
          component: 'ButtonRenderer',
          content: 'Dark Mode Toggle'
        },
        {
          path: '',
          isMenuItem: false,
          component: 'SearchRenderer',
          content: 'Global Search'
        },
        {
          path: '',
          isMenuItem: false,
          component: 'DropdownRenderer',
          content: 'User Menu'
        }
      ]
    },
    {
      path: '',
      isMenuItem: false,
      component: 'SidebarRenderer',
      content: 'Navigation Sidebar',
      children: [
        {
          path: '',
          isMenuItem: false,
          component: 'MenuRenderer',
          content: 'Main Navigation Menu'
        }
      ]
    },
    {
      path: '',
      isMenuItem: false,
      component: 'FooterRenderer',
      content: 'Application Footer'
    }*/
  ];
};

// Layout Configurations
export const getLayoutConfigurations = (): Record<string, LayoutRenderer> => {
  return {
    default: {
      type: 'default',
      header: {
        meta: {
          component: 'HeaderRenderer',
          content: 'Default Header with full navigation'
        }
      },
      sider: {
        meta: {
          component: 'SidebarRenderer',
          content: 'Collapsible sidebar with menu'
        }
      },
      content: {
        meta: {
          component: 'ContentRenderer',
          content: 'Main content area with charts, forms, and tables'
        }
      },
      footer: {
        meta: {
          component: 'FooterRenderer',
          content: 'Standard footer'
        }
      }
    },
    public: {
      type: 'public',
      header: {
        meta: {
          component: 'HeaderRenderer',
          content: 'Public header with minimal navigation'
        }
      },
      content: {
        meta: {
          component: 'ContentRenderer',
          content: 'Public content area'
        }
      },
      footer: {
        meta: {
          component: 'FooterRenderer',
          content: 'Public footer'
        }
      }
    },
    custom: {
      type: 'custom',
      content: {
        meta: {
          component: 'ContentRenderer',
          content: 'Custom layout with full-width content'
        }
      }
    },
    tailwind: {
      type: 'tailwind',
      header: {
        meta: {
          component: 'TailwindHeaderComponent',
          content: 'Tailwind header with CSS classes'
        }
      },
      content: {
        meta: {
          component: 'TailwindContentComponent',
          content: 'Tailwind-styled content area'
        }
      },
      sider: {
        meta: {
          component: 'TailwindSidebarComponent',
          content: 'Tailwind sidebar navigation'
        }
      },
      footer: {
        meta: {
          component: 'TailwindFooterComponent',
          content: 'Tailwind footer'
        }
      }
    }
  };
};

// Mock data for testing
export const getMockUserData = () => [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', department: 'engineering', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', department: 'hr', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'manager', department: 'sales', status: 'inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', department: 'marketing', status: 'active' }
];

export const getMockInventoryData = () => [
  { id: 1, name: 'Laptop Pro', sku: 'LTP-001', category: 'electronics', price: 1299.99, quantity: 25, status: 'in-stock' },
  { id: 2, name: 'Office Chair', sku: 'OCH-002', category: 'home', price: 299.99, quantity: 15, status: 'low-stock' },
  { id: 3, name: 'JavaScript Guide', sku: 'JSG-003', category: 'books', price: 49.99, quantity: 100, status: 'in-stock' },
  { id: 4, name: 'T-Shirt', sku: 'TSH-004', category: 'clothing', price: 24.99, quantity: 0, status: 'out-of-stock' }
];

// Demo component that shows how to use the registry
export const XingineLayoutExample: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Xingine Layout Registry Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Registry Data Structure</h2>
        <p>This example shows the comprehensive data structure that can be registered with the LayoutComponentRegistryService:</p>
        
        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
          <h3>User Module (Default Layout)</h3>
          <ul>
            <li><strong>User Dashboard:</strong> /user/dashboard (Navigation boxes)</li>
            <li><strong>Create User Form:</strong> /user/create (FormRenderer with validation)</li>
            <li><strong>User List Table:</strong> /user/list (TableRenderer with sorting/filtering)</li>
            <li><strong>User Details:</strong> /user/detail/:id (DetailRenderer with sections)</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
          <h3>Dashboard (Tailwind Layout)</h3>
          <ul>
            <li><strong>Analytics Dashboard:</strong> /dashboard</li>
            <li><strong>4 Charts:</strong> Bar, Line, Pie, Area charts with sample data</li>
            <li><strong>User Form:</strong> Create user form with validation</li>
            <li><strong>Users Table:</strong> Table with pagination and sorting</li>
            <li><strong>User Details:</strong> Detailed user information display</li>
            <li><strong>Popup Modal:</strong> Profile popup with detailed information</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
          <h3>Inventory Module (Custom Layout)</h3>
          <ul>
            <li><strong>Inventory Dashboard:</strong> /inventory/dashboard</li>
            <li><strong>Add Inventory:</strong> /inventory/add (FormRenderer)</li>
            <li><strong>Inventory List:</strong> /inventory/list (TableRenderer)</li>
            <li><strong>Inventory Details:</strong> /inventory/detail/:id (DetailRenderer)</li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#fff5f5', padding: '15px', borderRadius: '5px', margin: '10px 0' }}>
          <h3>Login (Public Layout)</h3>
          <ul>
            <li><strong>User Login:</strong> /login (FormRenderer with authentication)</li>
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Layout Types</h2>
        <ul>
          <li><strong>Default Layout:</strong> Header + Sidebar + Content + Footer (Ant Design components)</li>
          <li><strong>Public Layout:</strong> Header + Content + Footer (no sidebar)</li>
          <li><strong>Custom Layout:</strong> Content only (full-width)</li>
          <li><strong>Tailwind Layout:</strong> Header + Sidebar + Content + Footer (Tailwind CSS classes)</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Registry Features</h2>
        <ul>
          <li>✅ Recursive component registration</li>
          <li>✅ Path-based routing</li>
          <li>✅ Menu item detection</li>
          <li>✅ Component metadata management</li>
          <li>✅ Helper functions for rendering</li>
          <li>✅ Type-safe component props</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
        <h3>Usage with Registry Service</h3>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
{`// Initialize the registry
const registryData = getRegistryData();
registryData.forEach(component => {
  layoutRegistry.register(component);
});

// Use helper functions
const userComponent = layoutRegistry.getComponentByPath('/user/create');
const menuItems = layoutRegistry.getMenuItems();
const renderedComponent = layoutRegistry.renderLayoutComponent(userComponent);`}
        </pre>
      </div>
    </div>
  );
};

export default XingineLayoutExample;