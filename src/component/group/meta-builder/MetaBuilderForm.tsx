import React, { useState, useCallback, useMemo } from 'react';
import { Form, Select, Input, Button, Space, Card, Divider, Switch, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { LayoutComponentDetail, ComponentMeta, ComponentMetaMap } from 'xingine';
import { useActionExecutionContext } from '../../../context/HierarchicalActionContext';

const { Option } = Select;
const { TextArea } = Input;

interface MetaBuilderFormProps {
  onJsonChange: (json: LayoutComponentDetail | null) => void;
  initialData?: LayoutComponentDetail;
}

// Available component types for the builder
const COMPONENT_TYPES: (keyof ComponentMetaMap)[] = [
  'FormRenderer',
  'TableRenderer',
  'TabRenderer',
  'DetailRenderer',
  'ChartRenderer',
  'WrapperRenderer',
  'APIRenderer',
  'ConditionalRenderer',
  'IconRenderer',
  'ButtonRenderer',
  'InputRenderer',
  'SwitchRenderer',
  'BadgeRenderer',
  'DropdownRenderer',
  'AvatarRenderer',
  'MenuRenderer',
  'TitleRenderer',
  'CardRenderer',
  'TextRenderer',
  'LinkRenderer',
  'PopupRenderer'
];

export const MetaBuilderForm: React.FC<MetaBuilderFormProps> = ({
  onJsonChange,
  initialData
}) => {
  const [form] = Form.useForm();
  const [selectedComponentType, setSelectedComponentType] = useState<keyof ComponentMetaMap>('TextRenderer');
  const [properties, setProperties] = useState<Record<string, any>>({});
  const [showRawJson, setShowRawJson] = useState(false);
  const executionContext = useActionExecutionContext();

  // Generate the current LayoutComponentDetail object
  const currentLayoutComponent = useMemo((): LayoutComponentDetail => {
    if (!selectedComponentType) return {};

    return {
      meta: {
        component: selectedComponentType,
        properties: properties
      } as ComponentMeta
    };
  }, [selectedComponentType, properties]);

  // Handle component type change
  const handleComponentTypeChange = useCallback((componentType: keyof ComponentMetaMap) => {
    setSelectedComponentType(componentType);
    setProperties({}); // Reset properties when component type changes
    form.setFieldsValue({ properties: {} });
  }, [form]);

  // Handle property changes
  const handlePropertyChange = useCallback((key: string, value: any) => {
    const newProperties = { ...properties, [key]: value };
    setProperties(newProperties);
    onJsonChange(currentLayoutComponent);
  }, [properties, currentLayoutComponent, onJsonChange]);

  // Add new custom property
  const addCustomProperty = useCallback(() => {
    const propertyName = prompt('Enter property name:');
    if (propertyName && !properties.hasOwnProperty(propertyName)) {
      handlePropertyChange(propertyName, '');
    }
  }, [properties, handlePropertyChange]);

  // Remove property
  const removeProperty = useCallback((key: string) => {
    const newProperties = { ...properties };
    delete newProperties[key];
    setProperties(newProperties);
    form.setFieldValue(['properties', key], undefined);
  }, [properties, form]);

  // Generate form fields based on component type
  const renderComponentProperties = useCallback(() => {
    const commonProps = ['style', 'event', 'className', 'id'];

    // Component-specific properties
    const componentSpecificProps: Record<string, string[]> = {
      TextRenderer: ['content', 'tag', 'children'],
      ButtonRenderer: ['label', 'type', 'size', 'disabled', 'loading', 'icon'],
      InputRenderer: ['placeholder', 'type', 'disabled', 'maxLength', 'value', 'defaultValue'],
      IconRenderer: ['name', 'size', 'color'],
      FormRenderer: ['fields', 'layout', 'submitText', 'resetText'],
      TableRenderer: ['columns', 'dataSource', 'pagination', 'scroll'],
      WrapperRenderer: ['children', 'content'],
      LinkRenderer: ['href', 'target', 'children', 'content'],
      CardRenderer: ['title', 'children', 'content', 'actions'],
      APIRenderer: ['url', 'method', 'headers']
    };

    const availableProps = [
      ...commonProps,
      ...(componentSpecificProps[selectedComponentType] || [])
    ];

    // Add any existing custom properties
    const customProps = Object.keys(properties).filter(
      key => !availableProps.includes(key)
    );

    const allProps = [...availableProps, ...customProps];

    return allProps.map(propKey => (
      <div key={propKey} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <strong>{propKey}:</strong>
          {!commonProps.includes(propKey) && !componentSpecificProps[selectedComponentType]?.includes(propKey) && (
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => removeProperty(propKey)}
              danger
            />
          )}
        </div>

        {renderPropertyInput(propKey)}
      </div>
    ));
  }, [selectedComponentType, properties, removeProperty]);

  // Render appropriate input for each property
  const renderPropertyInput = useCallback((propKey: string) => {
    const value = properties[propKey];

    // Special handling for specific properties
    if (propKey === 'disabled' || propKey === 'loading') {
      return (
        <Switch
          checked={value}
          onChange={(checked) => handlePropertyChange(propKey, checked)}
        />
      );
    }

    if (propKey === 'size' && selectedComponentType === 'ButtonRenderer') {
      return (
        <Select
          value={value}
          onChange={(val) => handlePropertyChange(propKey, val)}
          placeholder="Select size"
          allowClear
        >
          <Option value="small">Small</Option>
          <Option value="middle">Middle</Option>
          <Option value="large">Large</Option>
        </Select>
      );
    }

    if (propKey === 'type' && selectedComponentType === 'ButtonRenderer') {
      return (
        <Select
          value={value}
          onChange={(val) => handlePropertyChange(propKey, val)}
          placeholder="Select button type"
          allowClear
        >
          <Option value="primary">Primary</Option>
          <Option value="default">Default</Option>
          <Option value="dashed">Dashed</Option>
          <Option value="text">Text</Option>
          <Option value="link">Link</Option>
        </Select>
      );
    }

    if (propKey === 'maxLength') {
      return (
        <InputNumber
          value={value}
          onChange={(val) => handlePropertyChange(propKey, val)}
          placeholder="Enter max length"
          min={0}
        />
      );
    }

    // For complex objects/arrays, use textarea with JSON
    if (typeof value === 'object' && value !== null) {
      return (
        <TextArea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handlePropertyChange(propKey, parsed);
            } catch {
              // Invalid JSON, keep the text for editing
            }
          }}
          placeholder={`Enter JSON for ${propKey}`}
          rows={4}
        />
      );
    }

    // Default text input
    return (
      <Input
        value={value}
        onChange={(e) => handlePropertyChange(propKey, e.target.value)}
        placeholder={`Enter ${propKey}`}
      />
    );
  }, [properties, selectedComponentType, handlePropertyChange]);

  // Toggle raw JSON view
  const toggleRawJson = useCallback(() => {
    setShowRawJson(!showRawJson);
  }, [showRawJson]);

  return (
    <Card title="LayoutComponentDetail Builder" style={{ height: '100%', overflow: 'auto' }}>
      <Form form={form} layout="vertical">
        <Form.Item label="Component Type" required>
          <Select
            value={selectedComponentType}
            onChange={handleComponentTypeChange}
            placeholder="Select a component type"
            showSearch
            filterOption={(input, option) =>
              (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {COMPONENT_TYPES.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Divider>Properties</Divider>

        {renderComponentProperties()}

        <Space style={{ marginTop: '16px' }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addCustomProperty}
          >
            Add Custom Property
          </Button>

          <Button
            icon={<EyeOutlined />}
            onClick={toggleRawJson}
          >
            {showRawJson ? 'Hide' : 'Show'} Raw JSON
          </Button>
        </Space>

        {showRawJson && (
          <div style={{ marginTop: '16px' }}>
            <h4>Generated LayoutComponentDetail JSON:</h4>
            <TextArea
              value={JSON.stringify(currentLayoutComponent, null, 2)}
              rows={10}
              readOnly
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
          </div>
        )}
      </Form>
    </Card>
  );
};
