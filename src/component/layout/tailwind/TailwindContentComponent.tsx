import React from 'react';
import { LayoutComponentDetail } from '../../../types/renderer.types';
import { getLayoutComponentRegistryService } from '../../../xingine-layout-registry';

interface TailwindContentComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: any;
}

export const TailwindContentComponent: React.FC<TailwindContentComponentProps> = ({ 
  renderer, 
  panelControl 
}) => {
  const registry = getLayoutComponentRegistryService();
  const { darkMode } = panelControl;

  const renderComponent = (component: LayoutComponentDetail) => {
    if (!component) return null;

    // Use the registry to render the component if it exists
    if (registry) {
      const rendered = registry.renderLayoutComponent(component);
      if (rendered) return rendered;
    }

    // If no component found, render children or content
    if (component.children && component.children.length > 0) {
      return (
        <div className="space-y-4">
          {component.children.map((child, index) => (
            <div key={index}>
              {renderComponent(child)}
            </div>
          ))}
        </div>
      );
    }

    if (component.content) {
      return (
        <div className={`p-4 rounded-lg ${
          darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
          <div dangerouslySetInnerHTML={{ __html: component.content }} />
        </div>
      );
    }

    // Default fallback
    return (
      <div className={`p-4 rounded-lg border-2 border-dashed ${
        darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
      }`}>
        <p>Component: {component.component}</p>
        {component.meta && (
          <pre className="mt-2 text-xs">
            {JSON.stringify(component.meta, null, 2)}
          </pre>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {renderer ? (
        renderComponent(renderer)
      ) : (
        <div className={`p-8 text-center ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium">No content</h3>
            <p className="mt-1 text-sm">
              No content renderer has been configured for this layout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};