import React from 'react';
import { NotFoundPage } from './ErrorPages';

// Keep the original NotFound for backward compatibility
export const NotFound: React.FC = () => {
  return <NotFoundPage />;
};

// Also export as ErrorPage404 for consistency
export { NotFoundPage as ErrorPage404 } from './ErrorPages';
