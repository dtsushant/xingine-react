import React, { useState, useEffect, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastRendererProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

class ToastManager {
  private static instance: ToastManager;
  private listeners: Set<(toasts: Toast[]) => void> = new Set();
  private toasts: Toast[] = [];
  private nextId = 1;

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  addToast(message: string, type: Toast['type'] = 'info', duration: number = 5000): string {
    const id = `toast-${this.nextId++}`;
    const toast: Toast = { id, message, type, duration };

    this.toasts.push(toast);
    this.notifyListeners();

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }

    return id;
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  clearAll(): void {
    this.toasts = [];
    this.notifyListeners();
  }

  subscribe(listener: (toasts: Toast[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getToasts(): Toast[] {
    return [...this.toasts];
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }
}

export const ToastRenderer: React.FC<ToastRendererProps> = ({
  position = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const manager = ToastManager.getInstance();
    const unsubscribe = manager.subscribe(setToasts);
    setToasts(manager.getToasts());
    return unsubscribe;
  }, []);

  const displayedToasts = toasts.slice(-maxToasts);

  const getPositionClasses = (pos: string) => {
    const baseClasses = 'fixed z-50 flex flex-col gap-2 p-4';
    switch (pos) {
      case 'top-right':
        return `${baseClasses} top-0 right-0`;
      case 'top-left':
        return `${baseClasses} top-0 left-0`;
      case 'bottom-right':
        return `${baseClasses} bottom-0 right-0`;
      case 'bottom-left':
        return `${baseClasses} bottom-0 left-0`;
      default:
        return `${baseClasses} top-0 right-0`;
    }
  };

  const getToastTypeClasses = (type: Toast['type']) => {
    const baseClasses = 'px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-[500px]';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-500 text-white`;
      case 'error':
        return `${baseClasses} bg-red-500 text-white`;
      case 'warning':
        return `${baseClasses} bg-yellow-500 text-black`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-500 text-white`;
    }
  };

  console.warn("Rendering ToastRenderer with position:", position, "and toasts:", displayedToasts);
  return (
    <div className={getPositionClasses(position)}>
      {displayedToasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastTypeClasses(toast.type)} animate-slide-in`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => ToastManager.getInstance().removeToast(toast.id)}
            className="ml-4 text-lg font-bold opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper functions for easy toast creation
export const toast = {
  success: (message: string, duration?: number) =>
    ToastManager.getInstance().addToast(message, 'success', duration),
  error: (message: string, duration?: number) =>
    ToastManager.getInstance().addToast(message, 'error', duration),
  warning: (message: string, duration?: number) =>
    ToastManager.getInstance().addToast(message, 'warning', duration),
  info: (message: string, duration?: number) =>
    ToastManager.getInstance().addToast(message, 'info', duration),
  clear: () => ToastManager.getInstance().clearAll(),
};

export default ToastRenderer;
