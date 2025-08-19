import React, { useState, useEffect } from 'react';
import { Card, Alert, Spin } from 'antd';
import { EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { LayoutComponentDetail } from 'xingine';
import { RenderComponent } from '../../layout/utils/Layout.utils';

interface LivePreviewWindowProps {
  layoutComponent: LayoutComponentDetail | null;
  title?: string;
}

export const LivePreviewWindow: React.FC<LivePreviewWindowProps> = ({
  layoutComponent,
  title = "Live Preview"
}) => {
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate the layout component structure
  useEffect(() => {
    if (!layoutComponent) {
      setIsValid(false);
      setValidationError(null);
      return;
    }

    setIsLoading(true);

    try {
      // Basic validation for LayoutComponentDetail structure
      if (!layoutComponent.meta) {
        setValidationError('Missing meta property in LayoutComponentDetail');
        setIsValid(false);
        return;
      }

      if (!layoutComponent.meta.component) {
        setValidationError('Missing component property in meta');
        setIsValid(false);
        return;
      }

      if (!layoutComponent.meta.properties) {
        setValidationError('Missing properties in meta');
        setIsValid(false);
        return;
      }

      // Additional validation could be added here for specific component types
      // For now, we'll consider it valid if it has the basic structure
      setIsValid(true);
      setValidationError(null);

    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Unknown validation error');
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  }, [layoutComponent]);

  const renderPreviewContent = () => {
    if (!layoutComponent) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#999',
          border: '2px dashed #d9d9d9',
          borderRadius: '6px'
        }}>
          <EyeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <div>Select a component type and configure properties to see the preview</div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Validating component...</div>
        </div>
      );
    }

    if (!isValid && validationError) {
      return (
        <Alert
          message="Validation Error"
          description={validationError}
          type="error"
          icon={<ExclamationCircleOutlined />}
          style={{ margin: '16px' }}
        />
      );
    }

    if (!isValid) {
      return (
        <Alert
          message="Invalid Component"
          description="The current component configuration is not valid for rendering."
          type="warning"
          style={{ margin: '16px' }}
        />
      );
    }

    // Render the component using RenderComponent
    try {
      return (
        <div style={{
          padding: '16px',
          minHeight: '200px',
          border: '1px solid #f0f0f0',
          borderRadius: '6px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{
            marginBottom: '8px',
            fontSize: '12px',
            color: '#666',
            fontFamily: 'monospace'
          }}>
            Rendering: {layoutComponent.meta?.component}
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '4px',
            border: '1px solid #e0e0e0'
          }}>
            <RenderComponent
              {...layoutComponent}
              scope={{
                parent: "meta_builder",
                current: "preview_component"
              }}
            />
          </div>
        </div>
      );
    } catch (renderError) {
      return (
        <Alert
          message="Render Error"
          description={`Failed to render component: ${renderError instanceof Error ? renderError.message : 'Unknown error'}`}
          type="error"
          style={{ margin: '16px' }}
        />
      );
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOutlined />
          {title}
          {isValid && (
            <span style={{
              fontSize: '12px',
              color: '#52c41a',
              backgroundColor: '#f6ffed',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #b7eb8f'
            }}>
              ✓ Valid
            </span>
          )}
        </div>
      }
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, overflow: 'auto' }}
    >
      {renderPreviewContent()}

      {isValid && layoutComponent && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace'
        }}>
          <strong>Component Info:</strong>
          <br />
          Type: {layoutComponent.meta?.component}
          <br />
          Properties: {Object.keys(layoutComponent.meta?.properties || {}).length} configured
        </div>
      )}
    </Card>
  );
};
