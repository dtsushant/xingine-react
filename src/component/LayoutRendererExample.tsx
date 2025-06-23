import React from 'react';
import { LayoutRenderer, createDefaultLayoutRenderer, Renderer } from './LayoutRenderer';

/**
 * Example component demonstrating LayoutRenderer usage
 */
export const LayoutRendererExample: React.FC = () => {
  // Create default layout configuration
  const defaultLayout = createDefaultLayoutRenderer();

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <LayoutRenderer renderer={defaultLayout} />
    </div>
  );
};

/**
 * Example with custom configuration
 */
export const CustomLayoutExample: React.FC = () => {
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
              type: 'detail',
            },
          ],
        },
        {
          type: 'footer',
        },
      ],
    },
    mode: 'minimal',
    layout: {
      display: 'flex',
      spacing: 24,
      alignment: 'center',
    },
    display: {
      showBorder: true,
      showShadow: true,
      backgroundColor: '#fff',
      borderRadius: 8,
    },
    responsive: {
      breakpoints: {
        mobile: {
          layout: { spacing: 16 },
        },
        desktop: {
          layout: { spacing: 24 },
        },
      },
    },
    accessibility: {
      role: 'main',
      ariaLabel: 'Custom layout example',
    },
  };

  return (
    <div style={{ height: '100vh', padding: 16 }}>
      <LayoutRenderer renderer={customLayout} />
    </div>
  );
};

export default LayoutRendererExample;