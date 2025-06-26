import React from 'react';
import { Layout } from 'antd';
import { HeaderComponent } from '../exposition/HeaderComponent';
import { SidebarComponent } from '../exposition/SidebarComponent';
import { ContentComponent } from '../exposition/ContentComponent';
import { FooterComponent } from '../exposition/FooterComponent';
import { useXingineContext } from '../../../context/XingineContextBureau';
import {LayoutRenderer} from "xingine";

const { Header, Sider, Content, Footer } = Layout;

interface CustomLayoutProps {
  layout: LayoutRenderer;
}

export const CustomLayout: React.FC<CustomLayoutProps> = ({ layout }) => {
  const { panelControl, menuItems } = useXingineContext();
  const { collapsed, darkMode } = panelControl;

  // Custom layout - user can define how header, sider, content are rendered
  // This is a flexible example that can be customized based on requirements
  
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: darkMode ? '#1f1f1f' : '#f5f5f5' }}>
      {layout.header && (
        <Header style={{ 
          position: 'sticky',
          top: 0, 
          zIndex: 1001, 
          width: '100%', 
          height: '80px', // Custom height
          padding: '0 24px',
          backgroundColor: darkMode ? '#262626' : '#001529', // Custom color scheme
          borderBottom: '2px solid #1890ff', // Custom border
          display: 'flex',
          alignItems: 'center'
        }}>
          <HeaderComponent 
            renderer={layout?.header?.meta}
            panelControl={panelControl}
            menuItems={menuItems}
          />
        </Header>
      )}

      <Layout>
        {layout.sider && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={240} // Custom width
            collapsedWidth={60} // Custom collapsed width
            style={{
              backgroundColor: darkMode ? '#1f1f1f' : '#fff',
              borderRight: '1px solid #d9d9d9',
              boxShadow: '2px 0 8px rgba(0,0,0,0.15)' // Custom shadow
            }}
          >
            <SidebarComponent 
              renderer={layout.sider.meta} 
              panelControl={panelControl}
              menuItems={menuItems}
            />
          </Sider>
        )}

        <Layout style={{ 
          backgroundColor: 'transparent'
        }}>
          <Content style={{
            margin: '24px',
            padding: '32px',
            backgroundColor: darkMode ? '#262626' : '#fff',
            borderRadius: '12px', // Custom border radius
            minHeight: 'calc(100vh - 160px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' // Custom shadow
          }}>
            <ContentComponent 
              renderer={layout.content.meta} 
              panelControl={panelControl}
            />
          </Content>

          {layout.footer && (
            <Footer style={{ 
              textAlign: 'center',
              padding: '24px 50px',
              backgroundColor: darkMode ? '#1f1f1f' : '#f0f0f0',
              borderTop: '1px solid #d9d9d9',
              marginTop: 'auto'
            }}>
              <FooterComponent 
                renderer={layout.footer.meta} 
                panelControl={panelControl}
              />
            </Footer>
          )}
        </Layout>
      </Layout>
    </Layout>
  );
};