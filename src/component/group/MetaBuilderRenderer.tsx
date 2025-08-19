import React from 'react';
import { EnhancedMetaBuilder } from './meta-builder/EnhancedMetaBuilder';
import { LayoutComponentDetail } from 'xingine';
import { useGlobalState } from '../../context/HierarchicalActionContext';

interface MetaBuilderRendererProps {
  storageKey?: string;
  onSave?: (layoutComponent: LayoutComponentDetail) => void;
  onLoad?: () => LayoutComponentDetail | null;
  initialData?: LayoutComponentDetail;
  mode?: 'simple' | 'advanced';
  [key: string]: unknown;
}

export const MetaBuilderRenderer: React.FC<MetaBuilderRendererProps> = ({
  storageKey = 'metaBuilder_lastConfig',
  onSave,
  onLoad,
  initialData,
  mode = 'advanced',
  ...otherProps
}) => {
  const { setLocalStorage, getLocalStorage, showToast } = useGlobalState();

  // Default save handler - stores in localStorage and shows toast
  const handleSave = (layoutComponent: LayoutComponentDetail) => {
    if (onSave) {
      onSave(layoutComponent);
    } else {
      // Default behavior: save to localStorage
      setLocalStorage(storageKey, JSON.stringify(layoutComponent));
      showToast('Component configuration saved to local storage!', 'success');
    }
  };

  // Default load handler - loads from localStorage
  const handleLoad = (): LayoutComponentDetail | null => {
    if (onLoad) {
      return onLoad();
    } else {
      // Default behavior: load from localStorage
      const stored = getLocalStorage(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as LayoutComponentDetail;
          showToast('Configuration loaded from local storage!', 'info');
          return parsed;
        } catch (error) {
          showToast('Failed to parse stored configuration', 'error');
          return null;
        }
      }
      return null;
    }
  };

  return (
    <EnhancedMetaBuilder
      onSave={handleSave}
      onLoad={handleLoad}
      initialData={initialData}
      mode={mode}
      {...otherProps}
    />
  );
};
