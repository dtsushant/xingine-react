import React from 'react';
import { Typography } from 'antd';
import {PanelControlBureau, usePanelControlContext} from '../../../context/XingineContextBureau';
import {LayoutComponentDetail, WrapperMeta} from "xingine";

const { Text } = Typography;

/*export interface FooterComponentProps {
  renderer?: LayoutComponentDetail;
  panelControl: PanelControlBureau;
}*/

// Hook to detect very small screens (below 508px)
const useVerySmallScreen = () => {
  const [isVerySmall, setIsVerySmall] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsVerySmall(window.innerWidth < 508);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return isVerySmall;
};

export const FooterComponent: React.FC<WrapperMeta> = ({
  children
}) => {
  const { darkMode } = usePanelControlContext();
  const isVerySmallScreen = useVerySmallScreen();
  
  // Hide footer on very small screens
  if (isVerySmallScreen) {
    return null;
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '16px',
      backgroundColor: darkMode ? '#001529' : '#fff',
      borderTop: '1px solid #f0f0f0',
      color: darkMode ? '#fff' : '#000'
    }}>
      <Text type="secondary">
        {'Xingine React Layout ©2024 Created with LayoutRenderer'}
      </Text>
    </div>
  );
};

export default FooterComponent;