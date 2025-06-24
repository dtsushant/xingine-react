import React from 'react';
import { LayoutComponentDetail } from '../../../types/renderer.types';
import { PanelControlBureau } from '../../../context/XingineContextBureau';

interface ContentComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: PanelControlBureau;
}

export const ContentComponent: React.FC<ContentComponentProps> = ({ 
  renderer, 
  panelControl
}) => {
  const { darkMode } = panelControl;

  // If renderer has children, render them based on meta
  const renderChildren = () => {
    if (!renderer?.children) {
      return <div>Content will be rendered here based on ComponentMeta properties</div>;
    }

    return renderer.children.map((child, index) => (
      <div key={`content-child-${index}`}>
        {child.content || `Component: ${child.component}`}
      </div>
    ));
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: darkMode ? '#141414' : '#fff',
      color: darkMode ? '#fff' : '#000'
    }}>
      {renderer?.content && <div>{renderer.content}</div>}
      {renderChildren()}
    </div>
  );
};

export default ContentComponent;