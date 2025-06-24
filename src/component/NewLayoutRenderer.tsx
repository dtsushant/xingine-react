import React from 'react';
import { LayoutRenderer as LayoutRendererType } from '../types/renderer.types';
import { DefaultLayout } from './layout/default/DefaultLayout';
import { PublicLayout } from './layout/public/PublicLayout';
import { CustomLayout } from './layout/custom/CustomLayout';

interface NewLayoutRendererProps {
  renderer: LayoutRendererType;
}

export const NewLayoutRenderer: React.FC<NewLayoutRendererProps> = ({ renderer }) => {
  // Choose the layout component based on type
  switch (renderer.type) {
    case 'public':
      return <PublicLayout layout={renderer} />;
    case 'custom':
      return <CustomLayout layout={renderer} />;
    case 'default':
    default:
      return <DefaultLayout layout={renderer} />;
  }
};

// Factory function to create default layout configuration
export const createDefaultLayoutRenderer = (): LayoutRendererType => ({
  type: "default",
  header: {
    meta: {
      component: "HeaderRenderer",
      isMenuItem: false,
      content: "Default Header"
    }
  },
  sider: {
    meta: {
      component: "SidebarRenderer", 
      isMenuItem: false,
      content: "Default Sidebar"
    }
  },
  content: {
    meta: {
      component: "ContentRenderer",
      isMenuItem: false,
      content: "Default Content"
    }
  },
  footer: {
    meta: {
      component: "FooterRenderer",
      isMenuItem: false,
      content: "Default Footer"
    }
  }
});

// For backward compatibility
export { NewLayoutRenderer as LayoutRenderer };