import React from 'react';
import { Input } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';

const { Search } = Input;

interface SearchRendererProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  keyPrefix?: string;
}

export const SearchRenderer: React.FC<SearchRendererProps> = ({ 
  detail, 
  styles, 
  keyPrefix = 'search' 
}) => (
  <Search style={styles} {...detail.props} />
);

export default SearchRenderer;