import React, { useEffect, useState } from 'react';
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
import { 
  getLayoutComponentRegistryService, 
  initializeLayoutComponentRegistry 
} from '../xingine-layout-registry';
import { getDefaultInternalComponents } from './group';
import { 
  getRegistryData, 
  getLayoutConfigurations, 
  getMockUserData, 
  getMockInventoryData 
} from './XingineLayoutRegistryExample';

// Component to demonstrate the new registry system
export const XingineLayoutExample: React.FC = () => {
  const [isRegistryInitialized, setIsRegistryInitialized] = useState(false);
  const [registryStats, setRegistryStats] = useState({
    totalComponents: 0,
    menuItems: 0,
    routes: 0
  });

  useEffect(() => {
    // Initialize the layout component registry if not already done
    if (!getLayoutComponentRegistryService()) {
      const componentMap = getDefaultInternalComponents() as Record<string, React.FC<unknown>>;
      initializeLayoutComponentRegistry(componentMap);
    }

    const registry = getLayoutComponentRegistryService();
    if (registry) {
      // Register all components from our comprehensive data
      const registryData = getRegistryData();
      
      registryData.forEach(component => {
        try {
          registry.register(component);
        } catch (error) {
          console.warn(`Failed to register component ${component.component}:`, error);
        }
      });

      // Get registry statistics
      const allData = registry.getAll();
      const menuItems = registry.getMenuItems();
      const routes = registry.getRoutes();

      setRegistryStats({
        totalComponents: Object.keys(allData.component).length,
        menuItems: menuItems.length,
        routes: routes.length
      });

      setIsRegistryInitialized(true);
    }
  }, []);

  const renderRegistryContent = () => {
    const registry = getLayoutComponentRegistryService();
    if (!registry) return <div>Registry not initialized</div>;

    const menuItems = registry.getMenuItems();
    const routes = registry.getRoutes();
    const allComponents = registry.getAll();

    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Xingine Layout Registry System</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
            <h3>Registry Statistics</h3>
            <ul>
              <li>Total Components: {registryStats.totalComponents}</li>
              <li>Menu Items: {registryStats.menuItems}</li>
              <li>Routes: {registryStats.routes}</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#e8f0ff', padding: '15px', borderRadius: '8px' }}>
            <h3>Layout Types</h3>
            <ul>
              <li>Default Layout (Header + Sidebar + Content + Footer)</li>
              <li>Public Layout (Header + Content + Footer)</li>
              <li>Custom Layout (Content only)</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#fff8e8', padding: '15px', borderRadius: '8px' }}>
            <h3>Modules</h3>
            <ul>
              <li>User Management (Default Layout)</li>
              <li>Inventory Management (Custom Layout)</li>
              <li>Authentication (Public Layout)</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Registered Menu Items</h2>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
            {menuItems.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                <strong>{item.component}</strong>
                <br />
                <span style={{ color: '#666' }}>Path: {item.path || 'No path'}</span>
                <br />
                <span style={{ color: '#666' }}>Content: {item.content}</span>
                {item.children && (
                  <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                    <small>Children: {item.children.length} component(s)</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Registered Routes</h2>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
            {routes.map((route, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                <strong>{route.path}</strong>
                <br />
                <span style={{ color: '#666' }}>Component: {route.component.component}</span>
                <br />
                <span style={{ color: '#666' }}>Description: {route.component.content}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Registry Helper Functions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '8px' }}>
              <h3>Component Lookup Test</h3>
              <div>
                <strong>User Module:</strong> {registry.hasComponent('UserModule') ? '✅ Found' : '❌ Not Found'}
              </div>
              <div>
                <strong>FormRenderer:</strong> {registry.hasComponent('FormRenderer') ? '✅ Found' : '❌ Not Found'}
              </div>
              <div>
                <strong>TableRenderer:</strong> {registry.hasComponent('TableRenderer') ? '✅ Found' : '❌ Not Found'}
              </div>
            </div>

            <div style={{ backgroundColor: '#fff0f8', padding: '15px', borderRadius: '8px' }}>
              <h3>Path Lookup Test</h3>
              <div>
                <strong>/user/create:</strong> {registry.getComponentByPath('/user/create') ? '✅ Found' : '❌ Not Found'}
              </div>
              <div>
                <strong>/inventory/list:</strong> {registry.getComponentByPath('/inventory/list') ? '✅ Found' : '❌ Not Found'}
              </div>
              <div>
                <strong>/login:</strong> {registry.getComponentByPath('/login') ? '✅ Found' : '❌ Not Found'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Sample Mock Data</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
              <h3>User Data Sample</h3>
              <pre style={{ fontSize: '12px', overflow: 'auto', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
                {JSON.stringify(getMockUserData().slice(0, 2), null, 2)}
              </pre>
            </div>

            <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
              <h3>Inventory Data Sample</h3>
              <pre style={{ fontSize: '12px', overflow: 'auto', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
                {JSON.stringify(getMockInventoryData().slice(0, 2), null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <h2>Registry Usage Example</h2>
          <pre style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// Initialize registry with component map
import { initializeLayoutComponentRegistry, getLayoutComponentRegistryService } from './xingine-layout-registry';
import { getRegistryData } from './XingineLayoutRegistryExample';

// Initialize
const componentMap = getDefaultInternalComponents();
initializeLayoutComponentRegistry(componentMap);

// Get registry instance
const registry = getLayoutComponentRegistryService();

// Register components
const registryData = getRegistryData();
registryData.forEach(component => registry.register(component));

// Use helper functions
const menuItems = registry.getMenuItems();
const userRoute = registry.getComponentByPath('/user/create');
const hasComponent = registry.hasComponent('FormRenderer');
const renderedComponent = registry.renderLayoutComponent(userRoute);

// Render component trees
const headerComponents = headerLayoutComponent.children;
const renderedTree = registry.renderComponentTree(headerComponents);`}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div>
      {isRegistryInitialized ? renderRegistryContent() : (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Initializing Layout Component Registry...</h2>
          <p>Loading comprehensive registry data and registering components...</p>
        </div>
      )}
    </div>
  );
};

export default XingineLayoutExample;

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