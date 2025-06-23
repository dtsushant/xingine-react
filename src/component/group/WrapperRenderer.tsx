import React from 'react';

export interface WrapperRendererProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  [key: string]: any;
}

export const WrapperRenderer: React.FC<WrapperRendererProps> = ({ 
  children, 
  style, 
  className,
  ...props 
}) => {
  return (
    <div style={style} className={className} {...props}>
      {children}
    </div>
  );
};