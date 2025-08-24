# LayoutRenderer Usage Example

The LayoutRenderer component implements recursive rendering using the Renderer interface specification. Here's how to use it:

## Basic Usage

```tsx
import React from 'react';
import { LayoutRenderer, createDefaultLayoutRenderer } from 'xingine-react';

// Create a default layout configuration
const layoutConfig = createDefaultLayoutRenderer();

// Use the LayoutRenderer component
function App() {
  return <LayoutRenderer renderer={layoutConfig} />;
}
```

## Custom Layout Configuration

```tsx
import { Renderer } from 'xingine-react';

const customLayout: Renderer = {
  componentDetail: {
    type: 'layout',
    children: [
      {
        type: 'header',
      },
      {
        type: 'content',
        children: [
          {
            type: 'charts',
          },
          {
            type: 'form',
          },
          {
            type: 'table',
          },
        ],
      },
      {
        type: 'footer',
      },
    ],
  },
  mode: 'responsive',
  layout: {
    display: 'flex',
    spacing: 16,
    alignment: 'left',
  },
  responsive: {
    breakpoints: {
      mobile: {
        layout: { display: 'block' },
      },
      desktop: {
        layout: { display: 'flex' },
      },
    },
  },
  display: {
    showBorder: false,
    showShadow: true,
    backgroundColor: '#f0f2f5',
  },
};

function CustomApp() {
  return <LayoutRenderer renderer={customLayout} />;
}
```

## Features

- **Recursive Rendering**: Supports deeply nested UI structures through the Renderer interface
- **Responsive Design**: Adapts to mobile and desktop screens
- **Antd Integration**: Uses Ant Design components throughout
- **Mock Data**: Includes sample data for charts, forms, and tables
- **No Direct HTML**: All rendering is driven by the Renderer configuration

## Supported Component Types

- `layout`: Main layout container
- `header`: Fixed header with navigation, search, and user menu
- `sidebar`: Collapsible sidebar with menu items
- `content`: Main content area
- `footer`: Footer section
- `charts`: Four responsive charts (Bar, Pie, Line, Area)
- `form`: User creation form
- `table`: Data table with mock users
- `detail`: Detailed renderer demonstration

## Layout Structure

The default layout includes:

### Header (Fixed)
- Collapse/expand sidebar toggle
- Home button
- Search bar (center)
- Notification bell with badge
- Theme toggle (dark/light)
- User profile dropdown (Profile, Settings, Logout)

### Sidebar (Responsive)
- Menu items for Dashboard, Users, Forms, Settings
- Auto-collapse on mobile
- Expand/compact toggle

### Content Area
- **Top Section**: 4 responsive charts using recharts
  - Bar Chart (sales data)
  - Pie Chart (device usage)
  - Line Chart (revenue trends)
  - Area Chart (user growth)
- **Middle Section**: 
  - User creation form with validation
  - Users table with mock data
- **Bottom Section**: 
  - Detailed renderer example showing recursive capabilities

### Footer
- Standard footer with branding

## Responsive Behavior

- **Desktop**: Full layout with sidebar expanded
- **Mobile**: Collapsed sidebar, stacked components
- **Tablet**: Medium layout with compact sidebar

## Customization

The Renderer interface supports extensive customization:

- Layout configuration (display, columns, spacing, alignment)
- Visual styling (colors, borders, shadows, opacity)
- Interaction behaviors (clickable, hoverable, draggable)
- Responsive breakpoints
- Animations and transitions
- Accessibility attributes
- Custom CSS classes and styles

## Example Mock Data

The component includes realistic mock data for:
- Chart data (sales, revenue, users over time)
- User records (names, emails, roles, status)
- Menu items with icons
- Form validation rules