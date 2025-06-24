import React from 'react';
import { Input } from 'antd';
import { LayoutComponentDetail } from '../../types/renderer.types';

const { Search } = Input;

interface SearchRendererProps {
  detail: LayoutComponentDetail;
  styles?: React.CSSProperties;
  keyPrefix?: string;
}

export const SearchRenderer: React.FC<SearchRendererProps> = ({ 
  detail, 
  styles = {}, 
  keyPrefix = 'search' 
}) => (
  <Search style={styles} placeholder={detail.content || 'Search...'} />
);

export default SearchRenderer;