import React from 'react';
import { Layout, Typography } from 'antd';
import { LayoutComponentDetail } from '../../../types/renderer.types';

const { Footer } = Layout;
const { Text } = Typography;

interface FooterComponentProps {
  detail: LayoutComponentDetail;
  styles: React.CSSProperties;
  darkMode: boolean;
  keyPrefix?: string;
}

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

export const FooterComponent: React.FC<FooterComponentProps> = ({ 
  detail, 
  styles, 
  darkMode,
  keyPrefix = 'footer' 
}) => {
  const isVerySmallScreen = useVerySmallScreen();
  
  // Hide footer on very small screens
  if (isVerySmallScreen) {
    return null;
  }

  return (
    <Footer
      style={{
        textAlign: 'center',
        background: darkMode ? '#001529' : '#fff',
        borderTop: '1px solid #f0f0f0',
        ...styles,
      }}
    >
      <Text type="secondary">
        {detail.content || 'Xingine React Layout ©2024 Created with LayoutRenderer'}
      </Text>
    </Footer>
  );
};

export default FooterComponent;