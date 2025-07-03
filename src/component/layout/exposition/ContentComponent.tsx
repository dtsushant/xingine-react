import React from 'react';
import {PanelControlBureau, usePanelControlContext} from '../../../context/XingineContextBureau';
import {LayoutComponentDetail, WrapperMeta} from "xingine";



export const ContentComponent: React.FC<WrapperMeta> = ({
  children
}) => {
  const { darkMode } = usePanelControlContext();

  // If renderer has children, render them based on meta
  const renderChildren = () => {
    return <div>TODO:- compelete implementation rendered from ContenteComponent in exposition</div>
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: darkMode ? '#141414' : '#fff',
      color: darkMode ? '#fff' : '#000'
    }}>
      {/*{renderer?.content && <div>{renderer.content}</div>}*/}
      {renderChildren()}
    </div>
  );
};

export default ContentComponent;