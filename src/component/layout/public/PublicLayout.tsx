import React from 'react';
import { Layout } from 'antd';
import { HeaderComponent } from '../exposition/HeaderComponent';
import { ContentComponent } from '../exposition/ContentComponent';
import { FooterComponent } from '../exposition/FooterComponent';
import { useXingineContext } from '../../../context/XingineContextBureau';
import {LayoutRenderer} from "xingine";

const { Header, Content, Footer } = Layout;

interface PublicLayoutProps {
  layout: LayoutRenderer;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ layout }) => {
  const { panelControl, menuItems } = useXingineContext();
  const { darkMode } = panelControl;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {layout.header && (
        <Header style={{ 
          position: 'fixed', 
          zIndex: 1001, 
          width: '100%', 
          height: '64px',
          padding: 0,
          backgroundColor: darkMode ? '#001529' : '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <HeaderComponent 
            renderer={layout.header.meta} 
            panelControl={panelControl}
            menuItems={menuItems}
          />
        </Header>
      )}

      <Layout style={{ marginTop: layout.header ? 64 : 0 }}>
        <Content style={{
          margin: '16px',
          padding: '24px',
          backgroundColor: darkMode ? '#141414' : '#fff',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 144px)'
        }}>
          <ContentComponent 
            renderer={layout.content.meta} 
            panelControl={panelControl}
          />
        </Content>

        {layout.footer && (
          <Footer style={{ 
            textAlign: 'center',
            backgroundColor: darkMode ? '#001529' : '#f0f0f0',
            borderTop: '1px solid #f0f0f0'
          }}>
            <FooterComponent 
              renderer={layout.footer.meta} 
              panelControl={panelControl}
            />
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};