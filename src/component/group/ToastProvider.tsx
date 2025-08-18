import React, { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-hide after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  console.warn("Rendering ToastProvider with toasts:", toasts);
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onHide: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onHide }) => {
  if (toasts.length === 0) return null;

  console.warn('Rendering ToastContainer with toasts:', toasts);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  return (
    <div style={containerStyle}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onHide: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleHide = () => {
    setIsVisible(false);
    setTimeout(() => onHide(toast.id), 300); // Wait for animation
  };

  const getToastStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'relative',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderLeft: '4px solid',
      minWidth: '300px',
      maxWidth: '400px',
    };

    switch (toast.type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#f0fdf4',
          borderLeftColor: '#10b981',
          color: '#065f46'
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#fef2f2',
          borderLeftColor: '#ef4444',
          color: '#991b1b'
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#fffbeb',
          borderLeftColor: '#f59e0b',
          color: '#92400e'
        };
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: '#eff6ff',
          borderLeftColor: '#3b82f6',
          color: '#1e40af'
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: '#f9fafb',
          borderLeftColor: '#6b7280',
          color: '#374151'
        };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const containerStyle: React.CSSProperties = {
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.3s ease-in-out',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    color: '#6b7280',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    paddingRight: '24px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '18px',
    flexShrink: 0,
    marginTop: '2px',
  };

  const textContainerStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '4px',
    margin: '0 0 4px 0',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.4',
    margin: '0',
  };

  return (
    <div style={containerStyle}>
      <div style={getToastStyles()}>
        <button
          onClick={handleHide}
          style={closeButtonStyle}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.color = '#374151';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.color = '#6b7280';
          }}
          aria-label="Close"
        >
          ×
        </button>
        
        <div style={contentStyle}>
          <span style={iconStyle}>{getIcon()}</span>
          <div style={textContainerStyle}>
            {toast.title && (
              <h4 style={titleStyle}>{toast.title}</h4>
            )}
            <p style={messageStyle}>{toast.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastProvider;
