import React, { useState } from 'react';

interface PopupRendererProps {
  title?: string;
  content?: React.ReactNode;
  trigger?: React.ReactNode;
  width?: number;
  height?: number;
  onClose?: () => void;
  darkMode?: boolean;
}

interface PopupMeta {
  title: string;
  content: any;
  triggerText?: string;
  width?: number;
  height?: number;
}

export const PopupRenderer: React.FC<{ meta?: any }> = ({ meta }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const properties = meta?.properties as PopupMeta || {};
  const {
    title = 'Popup',
    content = 'Popup content',
    triggerText = 'Open Popup',
    width = 600,
    height = 400
  } = properties;

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openPopup}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {triggerText}
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closePopup}
          />
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full"
              style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button
                  onClick={closePopup}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: `${height - 120}px` }}>
                {typeof content === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <div>{content}</div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closePopup}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Default props are provided inline
// PopupRenderer.defaultProps = {
//   title: 'Popup',
//   content: 'Default popup content',
//   width: 600,
//   height: 400
// };