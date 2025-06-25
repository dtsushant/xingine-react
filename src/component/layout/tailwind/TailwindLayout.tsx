import React from 'react';
import { LayoutRenderer as LayoutRendererType } from '../../../types/renderer.types';
import { TailwindHeaderComponent } from './TailwindHeaderComponent';
import { TailwindSidebarComponent } from './TailwindSidebarComponent';
import { TailwindContentComponent } from './TailwindContentComponent';
import { TailwindFooterComponent } from './TailwindFooterComponent';
import { useXingineContext } from '../../../context/XingineContextBureau';

interface TailwindLayoutProps {
  layout: LayoutRendererType;
}

export const TailwindLayout: React.FC<TailwindLayoutProps> = ({ layout }) => {
  const { panelControl, menuItems } = useXingineContext();
  const { collapsed, darkMode } = panelControl;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      {layout.header && (
        <header className={`fixed top-0 left-0 right-0 h-16 z-50 ${
          darkMode 
            ? 'bg-gray-800 border-b border-gray-700' 
            : 'bg-white border-b border-gray-200'
        } shadow-sm`}>
          <TailwindHeaderComponent 
            renderer={layout.header.meta} 
            panelControl={panelControl}
            menuItems={menuItems}
          />
        </header>
      )}

      <div className={`flex ${layout.header ? 'mt-16' : ''}`}>
        {/* Sidebar */}
        {layout.sider && (
          <aside className={`fixed left-0 top-0 h-screen z-40 transition-all duration-200 ${
            layout.header ? 'mt-16' : 'mt-0'
          } ${
            collapsed ? 'w-0 overflow-hidden' : 'w-52'
          } ${
            darkMode 
              ? 'bg-gray-800 border-r border-gray-700' 
              : 'bg-white border-r border-gray-200'
          }`}>
            <TailwindSidebarComponent 
              renderer={layout.sider.meta} 
              panelControl={panelControl}
              menuItems={menuItems}
            />
          </aside>
        )}

        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-200 ${
          !collapsed && layout.sider ? 'ml-52' : 'ml-0'
        }`}>
          {/* Content */}
          <main className={`p-6 min-h-screen ${
            layout.footer ? 'pb-20' : 'pb-6'
          }`}>
            <div className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-sm p-6`}>
              <TailwindContentComponent 
                renderer={layout.content.meta} 
                panelControl={panelControl}
              />
            </div>
          </main>

          {/* Footer */}
          {layout.footer && (
            <footer className={`fixed bottom-0 left-0 right-0 h-16 z-30 transition-all duration-200 ${
              !collapsed && layout.sider ? 'ml-52' : 'ml-0'
            } ${
              darkMode 
                ? 'bg-gray-800 border-t border-gray-700' 
                : 'bg-white border-t border-gray-200'
            } shadow-sm`}>
              <TailwindFooterComponent 
                renderer={layout.footer.meta} 
                panelControl={panelControl}
              />
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};