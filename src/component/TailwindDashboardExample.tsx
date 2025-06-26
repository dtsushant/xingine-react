import React from 'react';
import { TailwindLayout } from './layout/tailwind/TailwindLayout';
import {LayoutComponentDetail, LayoutRenderer} from "xingine";

// Sample data for dashboard components
const chartData = {
  barChart: [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 700 }
  ],
  lineChart: [
    { name: 'Week 1', value: 100 },
    { name: 'Week 2', value: 200 },
    { name: 'Week 3', value: 150 },
    { name: 'Week 4', value: 300 }
  ],
  pieChart: [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 100 }
  ],
  areaChart: [
    { name: 'Q1', value: 1000 },
    { name: 'Q2', value: 1200 },
    { name: 'Q3', value: 900 },
    { name: 'Q4', value: 1500 }
  ]
};

const userFormFields = [
  {
    name: 'name',
    label: 'Full Name',
    inputType: 'text',
    required: true,
    placeholder: 'Enter full name'
  },
  {
    name: 'email',
    label: 'Email',
    inputType: 'email',
    required: true,
    placeholder: 'Enter email address'
  },
  {
    name: 'role',
    label: 'Role',
    inputType: 'select',
    required: true,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Manager', value: 'manager' }
    ]
  },
  {
    name: 'active',
    label: 'Active',
    inputType: 'switch',
    defaultValue: true
  }
];

const userTableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true, createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', active: true, createdAt: '2024-01-10' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', active: false, createdAt: '2024-01-05' }
];

const userDetailData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Admin',
  active: true,
  createdAt: '2024-01-15',
  lastLogin: '2024-12-24T10:30:00Z',
  permissions: ['read', 'write', 'delete'],
  profile: {
    avatar: 'https://via.placeholder.com/100',
    bio: 'Experienced administrator with 5+ years in system management.',
    department: 'IT',
    phone: '+1234567890'
  }
};

export const createTailwindDashboardLayout = (): LayoutRenderer => {
  const dashboardContent: LayoutComponentDetail = {
    component: 'WrapperRenderer',
    meta:{
        component: 'WrapperRenderer',
        properties: {
          children: [
            // Charts Row
            {
              component: 'WrapperRenderer',
              meta: {
                component: 'WrapperRenderer',
                properties: {
                  className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
                  children: [
                    {
                      component: 'ChartRenderer',
                      meta: {
                        component: 'ChartRenderer',
                        properties: {
                          charts:[{
                            title: 'Monthly Sales',
                            type: 'bar',
                            data: chartData.barChart,
                            xKey: 'name',
                            yKey: 'value',
                            color: '#8884d8'
                          }]
                        }
                      }
                    },
                    {
                      component: 'ChartRenderer',
                      meta: {
                        component: 'ChartRenderer',
                        properties: {
                          charts:[{
                            title: 'Weekly Growth',
                            type: 'line',
                            data: chartData.lineChart,
                            xKey: 'name',
                            yKey: 'value',
                            color: '#82ca9d'
                          }]
                        }
                      }
                    },
                    {
                      component: 'ChartRenderer',
                      meta: {
                        component: 'ChartRenderer',
                        properties: {
                          charts:[{
                            title: 'Device Usage',
                            type: 'pie',
                            data: chartData.pieChart,
                            nameKey: 'name',
                            dataKey: 'value'
                          }]
                        }
                      }
                    },
                    {
                      component: 'ChartRenderer',
                      meta: {
                        component: 'ChartRenderer',
                        properties: {
                          charts:[{
                            title: 'Quarterly Revenue',
                            type: 'area',
                            data: chartData.areaChart,
                            xKey: 'name',
                            yKey: 'value',
                            color: '#ffc658'
                          }]
                        }
                      }
                    }
                  ]
                }
              }

            },

            // Form and Table Row
            {
              component: 'WrapperRenderer',
              meta: {
                component: 'WrapperRenderer',
                properties: {
                  className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8',
                  children: [
                    // User Creation Form
                    {
                      component: 'FormRenderer',
                      meta: {
                        component: 'FormRenderer',
                        properties: {
                          title: 'Create User',
                          fields: userFormFields,
                          onSubmit: 'handleUserCreate',
                          submitText: 'Create User',
                          className: 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow'
                        }
                      }
                    },

                    // User Table
                    {
                      component: 'TableRenderer',
                      meta: {
                        component: 'TableRenderer',
                        properties: {
                          title: 'Users',
                          data: userTableData,
                          columns: [
                            { key: 'name', title: 'Name', sortable: true },
                            { key: 'email', title: 'Email', sortable: true },
                            { key: 'role', title: 'Role', sortable: true },
                            { key: 'active', title: 'Status', type: 'badge' },
                            { key: 'createdAt', title: 'Created', type: 'date' }
                          ],
                          pagination: true,
                          pageSize: 10,
                          className: 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow'
                        }
                      }
                    }
                  ]
                }
              },

            },

            // Detail and Popup Row
            {
              component: 'WrapperRenderer',
              meta: {
                component: 'WrapperRenderer',
                properties: {
                  className: 'grid grid-cols-1 gap-6',
                  children: [
                    // User Detail with Popup
                    {
                      component: 'WrapperRenderer',
                      meta: {
                        component: 'WrapperRenderer',
                        properties: {
                          className: 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow',
                          children: [
                            {
                              component: 'DetailRenderer',
                              meta: {
                                component: 'DetailRenderer',
                                properties: {
                                  title: 'User Details',
                                  data: userDetailData,
                                  fields: [
                                    { key: 'name', label: 'Name', type: 'text' },
                                    { key: 'email', label: 'Email', type: 'text' },
                                    { key: 'role', label: 'Role', type: 'badge' },
                                    { key: 'active', label: 'Status', type: 'switch' },
                                    { key: 'createdAt', label: 'Created', type: 'date' },
                                    { key: 'lastLogin', label: 'Last Login', type: 'datetime' }
                                  ]
                                }
                              }
                            },
                            {
                              component: 'PopupRenderer',
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
                          <img src="${userDetailData.profile.avatar}" alt="Profile" class="w-20 h-20 rounded-full">
                          <div>
                            <h2 class="text-2xl font-bold">${userDetailData.name}</h2>
                            <p class="text-gray-600">${userDetailData.profile.department} Department</p>
                          </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <h3 class="font-semibold mb-2">Contact Information</h3>
                            <p><strong>Email:</strong> ${userDetailData.email}</p>
                            <p><strong>Phone:</strong> ${userDetailData.profile.phone}</p>
                          </div>
                          <div>
                            <h3 class="font-semibold mb-2">Role & Permissions</h3>
                            <p><strong>Role:</strong> ${userDetailData.role}</p>
                            <p><strong>Permissions:</strong> ${userDetailData.permissions.join(', ')}</p>
                          </div>
                        </div>
                        <div>
                          <h3 class="font-semibold mb-2">Biography</h3>
                          <p>${userDetailData.profile.bio}</p>
                        </div>
                      </div>
                    `
                                }
                              }
                            }
                          ]
                        }
                      },

                    }
                  ]
                }
              },

            }
          ]
        }
    }

  };

  return {
    type: 'tailwind',
    header: {
      meta: {
        component: 'HeaderRenderer'
      }
    },
    content: {
      meta: dashboardContent
    },
    sider: {
      meta: {
        component: 'SidebarRenderer'
      }
    },
    footer: {
      meta: {
        component: 'FooterRenderer'
      }
    }
  };
};

// Example usage component
export const TailwindDashboardExample: React.FC = () => {
  const layout = createTailwindDashboardLayout();

  return <TailwindLayout layout={layout} />;
};