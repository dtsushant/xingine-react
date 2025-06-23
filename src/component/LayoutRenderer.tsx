import React, { useState } from 'react';
import {
  Grid,
} from 'antd';
import { Renderer, UIComponent, UIComponentDetail, ChartMeta, FormMeta, TableMeta, DetailMeta, ExtendedUIComponent, LayoutComponentDetail, LayoutRenderer as LayoutRendererType } from '../types/renderer.types';
import { ChartRenderer } from './group/ChartRenderer';
import { FormRenderer } from './group/FormRenderer';
import { TableRenderer } from './group/TableRenderer';
import { DetailRenderer } from './group/DetailRenderer';
import { WrapperRenderer } from './group/WrapperRenderer';
import { 
  ButtonRenderer,
  SearchRenderer,
  SwitchRenderer,
  BadgeRenderer,
  DropdownRenderer,
  AvatarRenderer,
  MenuRenderer,
  TitleRenderer,
  CardRenderer,
  TextRenderer,
  LinkRenderer
} from './group';
import {
  LayoutComponent,
  HeaderComponent,
  SidebarComponent,
  ContentComponent,
  FooterComponent
} from './layout/exposition';

const { useBreakpoint } = Grid;

// Mock data should be provided from LayoutRendererExample - removed from here

interface LayoutRendererProps {
  renderer: LayoutRendererType;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ renderer }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Serializable action handler
  const handleAction = (action: { type: string; target?: string; value?: any }) => {
    switch (action.type) {
      case 'toggle':
        if (action.target === 'sidebar') {
          setCollapsed(!collapsed);
        } else if (action.target === 'darkMode') {
          setDarkMode(action.value);
        }
        break;
      case 'navigate':
        console.log('Navigate to:', action.target);
        // Add navigation logic here
        break;
      case 'search':
        console.log('Search:', action.value);
        // Add search logic here
        break;
      case 'menu-action':
        console.log('Menu action:', action.target);
        // Add menu action logic here
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Helper function to apply renderer styles
  const applyRendererStyles = (renderer: Renderer): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (renderer.layout) {
      if (renderer.layout.display) {
        styles.display = renderer.layout.display;
      }
      if (renderer.layout.spacing) {
        styles.margin = renderer.layout.spacing;
        styles.padding = renderer.layout.spacing;
      }
      if (renderer.layout.alignment) {
        styles.textAlign = renderer.layout.alignment as any;
      }
    }

    if (renderer.display) {
      if (renderer.display.showBorder) {
        styles.border = '1px solid #d9d9d9';
      }
      if (renderer.display.showShadow) {
        styles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
      if (renderer.display.backgroundColor) {
        styles.backgroundColor = renderer.display.backgroundColor;
      }
      if (renderer.display.textColor) {
        styles.color = renderer.display.textColor;
      }
      if (renderer.display.borderRadius) {
        styles.borderRadius = renderer.display.borderRadius;
      }
      if (renderer.display.opacity !== undefined) {
        styles.opacity = renderer.display.opacity;
      }
    }

    if (renderer.customStyles) {
      Object.assign(styles, renderer.customStyles);
    }

    return styles;
  };

  // Recursive renderer function
  const renderComponent = (component: ExtendedUIComponent, key?: string): React.ReactNode => {
    if ('componentDetail' in component) {
      // It's a Renderer object
      const detail = component.componentDetail;
      if (detail) {
        return renderComponent(detail as ExtendedUIComponent, key);
      } else {
        return <WrapperRenderer key={key}>No component detail provided</WrapperRenderer>;
      }
    }

    // Handle case where component might be a plain object or UIComponentDetail
    if (!component || typeof component !== 'object') {
      return <WrapperRenderer key={key}>Invalid component</WrapperRenderer>;
    }

    // Check if it's a standard UIComponent with component property
    if ('component' in component && component.component) {
      // This is an xingine UIComponent, convert to LayoutComponentDetail for rendering
      const detail: LayoutComponentDetail = {
        type: component.component,
        props: component.meta || {},
        content: component.component
      };
      return renderComponent(detail, key);
    }

    // It's a LayoutComponentDetail
    const detail = component as LayoutComponentDetail;
    const styles = 'componentDetail' in component ? applyRendererStyles(component as Renderer) : {};

    switch (detail.type) {
      case 'layout':
        return <LayoutComponent key={key} detail={detail} styles={styles} renderComponent={renderComponent} keyPrefix={key} />;
      case 'header':
        return <HeaderComponent 
          key={key} 
          detail={detail} 
          styles={styles} 
          collapsed={collapsed}
          darkMode={darkMode}
          onToggleCollapsed={() => setCollapsed(!collapsed)}
          onToggleDarkMode={setDarkMode}
          onAction={handleAction}
          menuItems={detail.props?.menuItems}
          keyPrefix={key} 
        />;
      case 'sidebar':
      case 'sider':
        return <SidebarComponent 
          key={key} 
          detail={detail} 
          styles={styles} 
          collapsed={collapsed}
          darkMode={darkMode}
          isMobile={isMobile}
          onCollapse={setCollapsed}
          keyPrefix={key} 
        />;
      case 'content':
        return <ContentComponent 
          key={key} 
          detail={detail} 
          styles={styles} 
          collapsed={collapsed}
          darkMode={darkMode}
          isMobile={isMobile}
          renderComponent={renderComponent}
          keyPrefix={key} 
        />;
      case 'footer':
        return <FooterComponent 
          key={key} 
          detail={detail} 
          styles={styles} 
          darkMode={darkMode}
          keyPrefix={key} 
        />;
      case 'charts':
        return renderCharts(detail, styles, key);
      case 'form':
        return renderForm(detail, styles, key);
      case 'table':
        return renderTable(detail, styles, key);
      case 'detail':
        return renderDetail(detail, styles, key);
      
      // Ant Design Components
      case 'div':
        return renderDiv(detail, styles, key);
      case 'button':
        return <ButtonRenderer key={key} detail={detail} styles={styles} renderComponent={renderComponent} keyPrefix={key} />;
      case 'search':
        return <SearchRenderer key={key} detail={detail} styles={styles} keyPrefix={key} />;
      case 'switch':
        return <SwitchRenderer key={key} detail={detail} styles={styles} keyPrefix={key} />;
      case 'badge':
        return <BadgeRenderer key={key} detail={detail} styles={styles} renderComponent={renderComponent} keyPrefix={key} />;
      case 'dropdown':
        return <DropdownRenderer key={key} detail={detail} styles={styles} renderComponent={renderComponent} keyPrefix={key} />;
      case 'avatar':
        return <AvatarRenderer key={key} detail={detail} styles={styles} keyPrefix={key} />;
      case 'menu':
        return <MenuRenderer key={key} detail={detail} styles={styles} keyPrefix={key} />;
      case 'title':
        return <TitleRenderer key={key} detail={detail} styles={styles} keyPrefix={key} />;
      case 'card':
        return <CardRenderer key={key} detail={detail} styles={styles} renderComponent={renderComponent} keyPrefix={key} />;
      case 'text':
        return <TextRenderer key={key} detail={detail} styles={styles} keyPrefix={key} />;
      case 'link':
        return <LinkRenderer key={key} detail={detail} styles={styles} keyPrefix={key} />;
      
      // Xingine Components
      case 'ChartRenderer':
        return renderChartRenderer(detail, styles, key);
      case 'FormRenderer':
        return renderFormRenderer(detail, styles, key);
      case 'TableRenderer':
        return renderTableRenderer(detail, styles, key);
      case 'DetailRenderer':
        return renderDetailRenderer(detail, styles, key);
      
      default:
        return <WrapperRenderer key={key} style={styles}>{detail.content || 'Unknown component'}</WrapperRenderer>;
    }
  };

  const renderCharts = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => {
    const chartMeta = detail.props as ChartMeta;
    if (!chartMeta?.charts) {
      return <WrapperRenderer key={key} style={styles}>No chart data provided</WrapperRenderer>;
    }
    return <ChartRenderer key={key} {...chartMeta} />;
  };

  const renderForm = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => {
    const formMeta = detail.props as FormMeta;
    if (!formMeta?.fields) {
      return <WrapperRenderer key={key} style={styles}>No form configuration provided</WrapperRenderer>;
    }
    return <FormRenderer key={key} {...formMeta} />;
  };

  const renderTable = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => {
    const tableMeta = detail.props as TableMeta;
    if (!tableMeta?.columns) {
      return <WrapperRenderer key={key} style={styles}>No table configuration provided</WrapperRenderer>;
    }
    return <TableRenderer key={key} {...tableMeta} />;
  };

  const renderDetail = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => {
    const detailMeta = detail.props as DetailMeta;
    if (!detailMeta) {
      return <WrapperRenderer key={key} style={styles}>No detail configuration provided</WrapperRenderer>;
    }
    return <DetailRenderer key={key} {...detailMeta} />;
  };

  // Xingine Component Renderers
  const renderDiv = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => (
    <WrapperRenderer key={key} style={{ ...detail.props?.style, ...styles }} {...detail.props}>
      {detail.content}
      {detail.children?.map((child, index) => renderComponent(child, `${key}-div-${index}`))}
    </WrapperRenderer>
  );
  const renderChartRenderer = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as ChartMeta;
    if (!meta) return <WrapperRenderer key={key}>No chart meta provided</WrapperRenderer>;
    
    return <ChartRenderer key={key} {...meta} />;
  };

  const renderFormRenderer = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as FormMeta;
    if (!meta) return <WrapperRenderer key={key}>No form meta provided</WrapperRenderer>;
    
    return <FormRenderer key={key} {...meta} />;
  };

  const renderTableRenderer = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as TableMeta;
    if (!meta) return <WrapperRenderer key={key}>No table meta provided</WrapperRenderer>;
    
    return <TableRenderer key={key} {...meta} />;
  };

  const renderDetailRenderer = (detail: LayoutComponentDetail, styles: React.CSSProperties, key?: string) => {
    const meta = detail.props?.meta as DetailMeta;
    if (!meta) return <WrapperRenderer key={key}>No detail meta provided</WrapperRenderer>;
    
    return <DetailRenderer key={key} {...meta} />;
  };

  return renderComponent(renderer.componentDetail || {
    type: 'layout',
    children: []
  });
};

// Helper function to create a default layout configuration
export const createDefaultLayoutRenderer = (): LayoutRendererType => ({
  componentDetail: {
    type: 'layout',
    children: [
      {
        type: 'header',
      },
      {
        type: 'sidebar',
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
  mode: 'default',
  layout: {
    display: 'flex',
    spacing: 0,
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
    showShadow: false,
    backgroundColor: '#f0f2f5',
  },
  accessibility: {
    role: 'main',
    ariaLabel: 'Main application layout',
  },
});

export default LayoutRenderer;