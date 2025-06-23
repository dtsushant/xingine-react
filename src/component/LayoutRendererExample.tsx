import React from 'react';
import { LayoutRenderer } from './LayoutRenderer';
import { Renderer, ChartMeta, FormMeta, TableMeta, DetailMeta, ChartConfig } from '../types/renderer.types';

/**
 * Example component demonstrating LayoutRenderer usage with xingine components
 * Based on the specific requirements:
 * - Fixed header with dark/light toggle, user icon with dropdown, home icon, search bar
 * - Collapsible menu items
 * - Body with 4 charts using ChartMeta from xingine
 * - Form builder for create user using FormMeta from xingine
 * - Table for user details using TableMeta from xingine 
 * - Detail for a user using DetailMeta from xingine
 * - Footer with responsive Ant Design components
 */
export const LayoutRendererExample: React.FC = () => {
  // Create chart configurations using ChartMeta
  const chartMeta: ChartMeta = {
    charts: [
      {
        type: 'bar',
        title: 'Sales Performance',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales',
          data: [4000, 3000, 2000, 2780, 1890, 2390],
          backgroundColor: '#1890ff'
        }],
        renderer: {
          layout: { display: 'flex', alignment: 'center' },
          display: { showBorder: true, showShadow: true }
        }
      },
      {
        type: 'line',
        title: 'User Growth',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Users',
          data: [240, 221, 229, 200, 218, 250],
          borderColor: '#52c41a'
        }],
        renderer: {
          layout: { display: 'flex', alignment: 'center' },
          display: { showBorder: true, showShadow: true }
        }
      },
      {
        type: 'pie',
        title: 'Device Distribution',
        datasets: [{
          label: 'Devices',
          data: [400, 300, 300, 200],
          backgroundColor: '#1890ff' // Single color for pie chart
        }],
        labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
        renderer: {
          layout: { display: 'flex', alignment: 'center' },
          display: { showBorder: true, showShadow: true }
        }
      },
      {
        type: 'scatter',
        title: 'Revenue Analysis',
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Revenue',
          data: [
            { x: 1, y: 2400 },
            { x: 2, y: 1398 },
            { x: 3, y: 9800 },
            { x: 4, y: 3908 }
          ],
          backgroundColor: '#722ed1'
        }],
        renderer: {
          layout: { display: 'flex', alignment: 'center' },
          display: { showBorder: true, showShadow: true }
        }
      }
    ],
    renderer: {
      layout: { display: 'grid', columns: 2, spacing: 16 },
      responsive: {
        breakpoints: {
          mobile: { layout: { columns: 1 } },
          tablet: { layout: { columns: 2 } },
          desktop: { layout: { columns: 2 } }
        }
      }
    }
  };

  // Create form configuration using FormMeta
  const formMeta: FormMeta = {
    action: '/api/users',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'Enter first name'
      },
      {
        name: 'lastName', 
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Enter last name'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email', 
        required: true,
        placeholder: 'Enter email address'
      },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        required: true,
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
          { label: 'Editor', value: 'editor' }
        ]
      },
      {
        name: 'department',
        label: 'Department',
        type: 'select',
        options: [
          { label: 'Engineering', value: 'eng' },
          { label: 'Marketing', value: 'marketing' },
          { label: 'Sales', value: 'sales' }
        ]
      }
    ]
  };

  // Create table configuration using TableMeta
  const tableMeta: TableMeta = {
    dataSourceUrl: '/api/users',
    rowKey: 'id',
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sortable: true,
        filterable: {
          apply: true,
          inputType: 'text',
          searchFieldKey: 'name'
        }
      },
      {
        title: 'Email', 
        dataIndex: 'email',
        key: 'email',
        sortable: true,
        filterable: {
          apply: true,
          inputType: 'text',
          searchFieldKey: 'email'
        }
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        filterable: {
          apply: true,
          inputType: 'select',
          searchFieldKey: 'role'
        }
      },
      {
        title: 'Department',
        dataIndex: 'department', 
        key: 'department'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: 'badge'
      },
      {
        title: 'Actions',
        key: 'actions',
        render: 'actions',
        width: 150
      }
    ],
    dispatch: {
      onRowClickNavigateTo: {
        component: 'UserDetail'
      }
    }
  };

  // Create detail configuration using DetailMeta
  const detailMeta: DetailMeta = {
    action: '/api/users/{id}',
    fields: [
      {
        name: 'id',
        label: 'User ID',
        type: 'text',
        readonly: true
      },
      {
        name: 'firstName',
        label: 'First Name', 
        type: 'text'
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email'
      },
      {
        name: 'role',
        label: 'Role',
        type: 'badge'
      },
      {
        name: 'department',
        label: 'Department',
        type: 'text'
      },
      {
        name: 'status',
        label: 'Status',
        type: 'switch'
      },
      {
        name: 'createdAt',
        label: 'Created Date',
        type: 'date',
        readonly: true
      },
      {
        name: 'lastLogin',
        label: 'Last Login',
        type: 'date',
        readonly: true
      }
    ]
  };

  // Create the complete layout configuration
  const layoutConfig: Renderer = {
    componentDetail: {
      type: 'layout',
      children: [
        // Fixed Header
        {
          type: 'header',
          props: {
            style: { 
              position: 'fixed',
              zIndex: 1000,
              width: '100%',
              background: '#fff',
              borderBottom: '1px solid #f0f0f0'
            }
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0 24px',
                  height: '64px'
                }
              },
              children: [
                // Left side - Home button
                {
                  type: 'button',
                  props: {
                    icon: 'home',
                    type: 'text',
                    size: 'large'
                  },
                  content: 'Home'
                },
                // Center - Search bar
                {
                  type: 'search',
                  props: {
                    placeholder: 'Search...',
                    style: { width: 300 },
                    allowClear: true
                  }
                },
                // Right side - Controls
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '16px' }
                  },
                  children: [
                    // Theme toggle
                    {
                      type: 'switch',
                      props: {
                        checkedChildren: '🌙',
                        unCheckedChildren: '☀️',
                        defaultChecked: false
                      }
                    },
                    // Notifications
                    {
                      type: 'badge',
                      props: { count: 5 },
                      children: [
                        {
                          type: 'button',
                          props: {
                            icon: 'bell',
                            type: 'text',
                            shape: 'circle'
                          }
                        }
                      ]
                    },
                    // User dropdown
                    {
                      type: 'dropdown',
                      props: {
                        menu: {
                          items: [
                            { key: 'profile', label: 'Profile', icon: 'user' },
                            { key: 'settings', label: 'Settings', icon: 'setting' },
                            { type: 'divider' },
                            { key: 'logout', label: 'Logout', icon: 'logout' }
                          ]
                        },
                        placement: 'bottomRight'
                      },
                      children: [
                        {
                          type: 'avatar',
                          props: {
                            icon: 'user',
                            style: { cursor: 'pointer' }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Main Layout with Sidebar
        {
          type: 'layout',
          props: {
            style: { marginTop: '64px', minHeight: 'calc(100vh - 64px)' }
          },
          children: [
            // Collapsible Sidebar
            {
              type: 'sidebar',
              props: {
                collapsible: true,
                breakpoint: 'lg',
                collapsedWidth: 0,
                style: {
                  background: '#fff',
                  borderRight: '1px solid #f0f0f0'
                },
                menuItems: [
                  {
                    key: 'dashboard',
                    icon: 'dashboard',
                    label: 'Dashboard'
                  },
                  {
                    key: 'users',
                    icon: 'team',
                    label: 'Users',
                    children: [
                      { key: 'user-list', label: 'User List' },
                      { key: 'user-create', label: 'Create User' }
                    ]
                  },
                  {
                    key: 'analytics',
                    icon: 'bar-chart',
                    label: 'Analytics'
                  },
                  {
                    key: 'settings',
                    icon: 'setting',
                    label: 'Settings'
                  }
                ]
              }
            },
            // Content Area
            {
              type: 'content',
              props: {
                style: {
                  padding: '24px',
                  background: '#f0f2f5',
                  minHeight: '100%'
                }
              },
              children: [
                // First row - 4 charts
                {
                  type: 'div',
                  props: {
                    style: { marginBottom: '24px' }
                  },
                  children: [
                    {
                      type: 'title',
                      props: { level: 2 },
                      content: 'Analytics Dashboard'
                    },
                    {
                      type: 'ChartRenderer',
                      props: {
                        meta: chartMeta
                      }
                    }
                  ]
                },
                // Second row - Form builder
                {
                  type: 'div',
                  props: {
                    style: { marginBottom: '24px' }
                  },
                  children: [
                    {
                      type: 'title',
                      props: { level: 3 },
                      content: 'Create New User'
                    },
                    {
                      type: 'card',
                      children: [
                        {
                          type: 'FormRenderer',
                          props: {
                            meta: formMeta
                          }
                        }
                      ]
                    }
                  ]
                },
                // Third row - Table
                {
                  type: 'div',
                  props: {
                    style: { marginBottom: '24px' }
                  },
                  children: [
                    {
                      type: 'title',
                      props: { level: 3 },
                      content: 'User Management'
                    },
                    {
                      type: 'card',
                      children: [
                        {
                          type: 'TableRenderer',
                          props: {
                            meta: tableMeta
                          }
                        }
                      ]
                    }
                  ]
                },
                // Fourth row - Detail view
                {
                  type: 'div',
                  children: [
                    {
                      type: 'title',
                      props: { level: 3 },
                      content: 'User Details'
                    },
                    {
                      type: 'card',
                      children: [
                        {
                          type: 'DetailRenderer',
                          props: {
                            meta: detailMeta
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        // Footer
        {
          type: 'footer',
          props: {
            style: {
              textAlign: 'center',
              background: '#fff',
              borderTop: '1px solid #f0f0f0',
              padding: '24px'
            }
          },
          children: [
            {
              type: 'div',
              children: [
                {
                  type: 'text',
                  content: 'Xingine React ©2024 Created with '
                },
                {
                  type: 'link',
                  props: { href: 'https://ant.design/', target: '_blank' },
                  content: 'Ant Design'
                },
                {
                  type: 'text',
                  content: ' and '
                },
                {
                  type: 'link',
                  props: { href: 'https://github.com/dtsushant/xingine', target: '_blank' },
                  content: 'Xingine'
                }
              ]
            }
          ]
        }
      ]
    },
    // Global layout configuration
    layout: {
      display: 'flex',
      alignment: 'stretch'
    },
    responsive: {
      breakpoints: {
        mobile: {
          layout: { display: 'block' }
        },
        tablet: {
          layout: { display: 'flex' }
        },
        desktop: {
          layout: { display: 'flex' }
        }
      }
    },
    display: {
      backgroundColor: '#f0f2f5'
    },
    accessibility: {
      role: 'main',
      ariaLabel: 'Main application layout with dashboard, user management and analytics'
    }
  };

  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <LayoutRenderer renderer={layoutConfig} />
    </div>
  );
};

export default LayoutRendererExample;