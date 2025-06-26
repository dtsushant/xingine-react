import React from 'react';
import { DefaultLayout } from './layout/default/DefaultLayout';
import { PublicLayout } from './layout/public/PublicLayout';
import { CustomLayout } from './layout/custom/CustomLayout';
import {LayoutRenderer} from "xingine";


interface NewLayoutRendererProps {
  renderer: LayoutRenderer;
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
export const createDefaultLayoutRenderer = (): LayoutRenderer => ({
  type: "default",
  header: {
    meta: {
      component: "HeaderRenderer",
      content: "Default Header"
    }
  },
  sider: {
    meta: {
      component: "SidebarRenderer", 
      content: "Default Sidebar"
    }
  },
  content: {
    meta: {
      component: "ContentRenderer",
      content: "Default Content"
    }
  },
  footer: {
    meta: {
      component: "FooterRenderer",
      content: "Default Footer"
    }
  }
});

// For backward compatibility
export { NewLayoutRenderer as LayoutRenderer };