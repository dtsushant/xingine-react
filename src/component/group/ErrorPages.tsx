import React from 'react';
import { Result, Button, Card, Typography, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ExclamationCircleOutlined, 
  HomeOutlined, 
  ReloadOutlined, 
  WarningOutlined,
  StopOutlined,
  ClockCircleOutlined,
  LockOutlined,
  DisconnectOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// Base error page component
interface BaseErrorPageProps {
  status: string;
  title: string;
  subTitle: string;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showBackButton?: boolean;
  additionalActions?: React.ReactNode[];
  className?: string;
  details?: string;
}

const BaseErrorPage: React.FC<BaseErrorPageProps> = ({
  status,
  title,
  subTitle,
  icon,
  showHomeButton = true,
  showRefreshButton = false,
  showBackButton = false,
  additionalActions = [],
  className = '',
  details
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => navigate('/');
  const handleRefresh = () => window.location.reload();
  const handleGoBack = () => navigate(-1);

  const actions = [
    ...(showHomeButton ? [
      <Button type="primary" icon={<HomeOutlined />} onClick={handleGoHome} key="home">
        Back Home
      </Button>
    ] : []),
    ...(showRefreshButton ? [
      <Button icon={<ReloadOutlined />} onClick={handleRefresh} key="refresh">
        Try Again
      </Button>
    ] : []),
    ...(showBackButton ? [
      <Button onClick={handleGoBack} key="back">
        Go Back
      </Button>
    ] : []),
    ...additionalActions
  ];

  return (
    <div className={`min-h-[60vh] flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-2xl text-center shadow-lg">
        <Result
          status="error"
          icon={icon}
          title={
            <Space direction="vertical" size="small">
              <Title level={1} style={{ color: '#ff4d4f', margin: 0 }}>
                {status}
              </Title>
              <Title level={3} style={{ margin: 0 }}>
                {title}
              </Title>
            </Space>
          }
          subTitle={
            <Space direction="vertical" size="middle">
              <Paragraph style={{ fontSize: '16px', margin: 0 }}>
                {subTitle}
              </Paragraph>
              {details && (
                <Paragraph type="secondary" style={{ fontSize: '14px', margin: 0 }}>
                  {details}
                </Paragraph>
              )}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Path: {location.pathname}
              </Text>
            </Space>
          }
          extra={actions.length > 0 ? actions : undefined}
        />
      </Card>
    </div>
  );
};

// 404 - Not Found
export const NotFoundPage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => (
  <BaseErrorPage
    status="404"
    title="Page Not Found"
    subTitle={customMessage || "Sorry, the page you visited does not exist."}
    icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showBackButton={true}
    details="The requested resource could not be located on this server."
  />
);

// 403 - Forbidden
export const ForbiddenPage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => (
  <BaseErrorPage
    status="403"
    title="Access Forbidden"
    subTitle={customMessage || "You don't have permission to access this resource."}
    icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showBackButton={true}
    details="Please contact your administrator if you believe this is an error."
  />
);

// 500 - Internal Server Error
export const InternalServerErrorPage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => (
  <BaseErrorPage
    status="500"
    title="Internal Server Error"
    subTitle={customMessage || "Something went wrong on our end."}
    icon={<StopOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showRefreshButton={true}
    details="Our team has been notified and is working to fix this issue."
  />
);

// 503 - Service Unavailable
export const ServiceUnavailablePage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => (
  <BaseErrorPage
    status="503"
    title="Service Unavailable"
    subTitle={customMessage || "The service is temporarily unavailable."}
    icon={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showRefreshButton={true}
    details="Please try again in a few minutes. We're working to restore service."
  />
);

// 502 - Bad Gateway
export const BadGatewayPage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => (
  <BaseErrorPage
    status="502"
    title="Bad Gateway"
    subTitle={customMessage || "Invalid response from upstream server."}
    icon={<DisconnectOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showRefreshButton={true}
    details="There was a problem with the server gateway."
  />
);

// 400 - Bad Request
export const BadRequestPage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => (
  <BaseErrorPage
    status="400"
    title="Bad Request"
    subTitle={customMessage || "The request could not be processed."}
    icon={<WarningOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showBackButton={true}
    details="Please check your request and try again."
  />
);

// 401 - Unauthorized
export const UnauthorizedPage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => {
  const navigate = useNavigate();
  
  return (
    <BaseErrorPage
      status="401"
      title="Unauthorized"
      subTitle={customMessage || "You need to log in to access this resource."}
      icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
      showHomeButton={true}
      additionalActions={[
        <Button type="primary" onClick={() => navigate('/login')} key="login">
          Go to Login
        </Button>
      ]}
      details="Please authenticate to continue."
    />
  );
};

// 408 - Request Timeout
export const RequestTimeoutPage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => (
  <BaseErrorPage
    status="408"
    title="Request Timeout"
    subTitle={customMessage || "The request took too long to process."}
    icon={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showRefreshButton={true}
    details="Please try again or check your network connection."
  />
);

// Generic Error Page for any status code
export const GenericErrorPage: React.FC<{
  status: string;
  title?: string;
  message?: string;
  details?: string;
}> = ({ 
  status, 
  title, 
  message, 
  details 
}) => (
  <BaseErrorPage
    status={status}
    title={title || "Error"}
    subTitle={message || "An unexpected error occurred."}
    icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showRefreshButton={true}
    showBackButton={true}
    details={details}
  />
);

// Maintenance Page
export const MaintenancePage: React.FC<{ estimatedTime?: string }> = ({ 
  estimatedTime 
}) => (
  <BaseErrorPage
    status="🔧"
    title="Maintenance Mode"
    subTitle="We're performing scheduled maintenance."
    icon={<ClockCircleOutlined style={{ color: '#faad14' }} />}
    showRefreshButton={true}
    details={estimatedTime ? `Estimated completion: ${estimatedTime}` : "We'll be back shortly!"}
    className="bg-gradient-to-br from-yellow-50 to-orange-50"
  />
);

// Network Error Page
export const NetworkErrorPage: React.FC<{ customMessage?: string }> = ({ 
  customMessage 
}) => (
  <BaseErrorPage
    status="🌐"
    title="Network Error"
    subTitle={customMessage || "Unable to connect to the server."}
    icon={<DisconnectOutlined style={{ color: '#ff4d4f' }} />}
    showHomeButton={true}
    showRefreshButton={true}
    details="Please check your internet connection and try again."
    className="bg-gradient-to-br from-red-50 to-pink-50"
  />
);

// Export the original NotFound for backward compatibility
export const NotFound = NotFoundPage;

// Export all error components
export {
  BaseErrorPage,
  NotFoundPage as ErrorPage404,
  ForbiddenPage as ErrorPage403,
  UnauthorizedPage as ErrorPage401,
  BadRequestPage as ErrorPage400,
  InternalServerErrorPage as ErrorPage500,
  BadGatewayPage as ErrorPage502,
  ServiceUnavailablePage as ErrorPage503,
  RequestTimeoutPage as ErrorPage408
};

// Error page map for easy lookup
export const ERROR_PAGES = {
  400: BadRequestPage,
  401: UnauthorizedPage,
  403: ForbiddenPage,
  404: NotFoundPage,
  408: RequestTimeoutPage,
  500: InternalServerErrorPage,
  502: BadGatewayPage,
  503: ServiceUnavailablePage,
  maintenance: MaintenancePage,
  network: NetworkErrorPage,
  generic: GenericErrorPage
} as const;

// Helper function to get appropriate error page component
export const getErrorPageComponent = (statusCode: number | string) => {
  const code = typeof statusCode === 'string' ? statusCode : statusCode.toString();
  return ERROR_PAGES[code as keyof typeof ERROR_PAGES] || GenericErrorPage;
};
