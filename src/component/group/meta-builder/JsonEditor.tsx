import React, { useState, useCallback } from 'react';
import { Card, Button, Space, Alert, Spin } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, FormatPainterOutlined } from '@ant-design/icons';
import { LayoutComponentDetail } from 'xingine';

interface JsonEditorProps {
  value: LayoutComponentDetail | null;
  onChange: (value: LayoutComponentDetail | null) => void;
  readonly?: boolean;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  readonly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Initialize JSON text when editing starts
  const startEditing = useCallback(() => {
    setJsonText(JSON.stringify(value, null, 2));
    setIsEditing(true);
    setValidationError(null);
  }, [value]);

  // Validate JSON as user types
  const handleJsonChange = useCallback((text: string) => {
    setJsonText(text);
    setValidationError(null);

    if (!text.trim()) {
      onChange(null);
      return;
    }

    try {
      const parsed = JSON.parse(text) as LayoutComponentDetail;

      // Basic validation for LayoutComponentDetail structure
      if (parsed && typeof parsed === 'object') {
        if (!parsed.meta) {
          setValidationError('Missing "meta" property');
          return;
        }
        if (!parsed.meta.component) {
          setValidationError('Missing "component" property in meta');
          return;
        }
        if (!parsed.meta.properties) {
          setValidationError('Missing "properties" property in meta');
          return;
        }

        // Valid JSON and structure
        onChange(parsed);
      } else {
        setValidationError('Invalid LayoutComponentDetail structure');
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Invalid JSON syntax');
    }
  }, [onChange]);

  // Save changes and exit editing mode
  const saveChanges = useCallback(() => {
    if (!validationError) {
      setIsEditing(false);
    }
  }, [validationError]);

  // Cancel editing and revert changes
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setValidationError(null);
    setJsonText('');
  }, []);

  // Format JSON
  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
    } catch (error) {
      // Don't format if invalid JSON
    }
  }, [jsonText]);

  const displayText = isEditing ? jsonText : JSON.stringify(value, null, 2);

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>JSON Configuration</span>
          <Space>
            {!readonly && !isEditing && (
              <Button
                icon={<EditOutlined />}
                onClick={startEditing}
                size="small"
              >
                Edit
              </Button>
            )}
            {isEditing && (
              <>
                <Button
                  icon={<FormatPainterOutlined />}
                  onClick={formatJson}
                  size="small"
                  disabled={!!validationError}
                >
                  Format
                </Button>
                <Button
                  icon={<CheckOutlined />}
                  onClick={saveChanges}
                  type="primary"
                  size="small"
                  disabled={!!validationError}
                >
                  Save
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={cancelEditing}
                  size="small"
                >
                  Cancel
                </Button>
              </>
            )}
          </Space>
        </div>
      }
      style={{ height: '100%' }}
      bodyStyle={{
        height: 'calc(100% - 60px)',
        padding: '0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {validationError && (
        <Alert
          message="JSON Validation Error"
          description={validationError}
          type="error"
          showIcon
          style={{ margin: '16px', marginBottom: '8px' }}
        />
      )}

      {isValidating && (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Spin size="small" />
          <span style={{ marginLeft: '8px' }}>Validating...</span>
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        {isEditing ? (
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
              fontSize: '13px',
              padding: '16px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              backgroundColor: '#fafafa',
              lineHeight: '1.6'
            }}
            placeholder="Enter LayoutComponentDetail JSON..."
            spellCheck={false}
          />
        ) : (
          <pre
            style={{
              margin: 0,
              padding: '16px',
              height: '100%',
              overflow: 'auto',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
              fontSize: '13px',
              backgroundColor: '#f8f9fa',
              border: 'none',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {displayText || '{}'}
          </pre>
        )}
      </div>

      {/* Line and character count */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #f0f0f0',
        fontSize: '12px',
        color: '#666',
        backgroundColor: '#fafafa'
      }}>
        {isEditing ? (
          <>
            Lines: {jsonText.split('\n').length} |
            Characters: {jsonText.length} |
            Status: {validationError ? '❌ Invalid' : '✅ Valid'}
          </>
        ) : (
          <>
            Size: {JSON.stringify(value).length} bytes |
            Components: {countComponents(value)}
          </>
        )}
      </div>
    </Card>
  );
};

// Helper function to count components in the JSON
function countComponents(layoutComponent: LayoutComponentDetail | null): number {
  if (!layoutComponent?.meta) return 0;

  let count = 1; // Count the current component

  const properties = layoutComponent.meta.properties;
  if (properties) {
    // Count children array
    if (Array.isArray(properties.children)) {
      properties.children.forEach((child: any) => {
        if (child?.meta) {
          count += countComponents(child);
        }
      });
    }

    // Count conditional components
    if (properties.trueComponent?.meta) {
      count += countComponents(properties.trueComponent);
    }
    if (properties.falseComponent?.meta) {
      count += countComponents(properties.falseComponent);
    }

    // Count other nested components
    Object.values(properties).forEach((value: any) => {
      if (value?.meta && typeof value === 'object') {
        count += countComponents(value);
      }
    });
  }

  return count;
}
