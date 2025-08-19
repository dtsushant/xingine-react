import React, { useState, useCallback, useMemo } from 'react';
import { Form, Select, Input, Button, Space, Card, Divider, Switch, InputNumber, Collapse, Tree } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, BranchesOutlined, EditOutlined } from '@ant-design/icons';
import { LayoutComponentDetail, ComponentMeta, ComponentMetaMap } from 'xingine';
import { useActionExecutionContext } from '../../../context/HierarchicalActionContext';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

interface EnhancedMetaBuilderFormProps {
  onJsonChange: (json: LayoutComponentDetail | null) => void;
  initialData?: LayoutComponentDetail;
}

// Available component types with support for nested structures
const COMPONENT_TYPES: (keyof ComponentMetaMap)[] = [
  'FormRenderer',
  'TableRenderer',
  'TabRenderer',
  'DetailRenderer',
  'ChartRenderer',
  'WrapperRenderer', // Supports children
  'APIRenderer',
  'ConditionalRenderer', // Supports trueComponent/falseComponent
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

// Components that support children/nested structures
const RECURSIVE_COMPONENTS = new Set([
  'WrapperRenderer',
  'ConditionalRenderer',
  'TabRenderer',
  'CardRenderer',
  'FormRenderer'
]);

// Properties that are themselves LayoutComponentDetail objects
const RECURSIVE_PROPERTIES = new Set([
  'children',
  'trueComponent',
  'falseComponent',
  'content',
  'header',
  'footer',
  'sider'
]);

interface ComponentNode {
  id: string;
  component: keyof ComponentMetaMap;
  properties: Record<string, any>;
  children: ComponentNode[];
  parent?: string;
}

export const EnhancedMetaBuilderForm: React.FC<EnhancedMetaBuilderFormProps> = ({
  onJsonChange,
  initialData
}) => {
  const [form] = Form.useForm();
  const [componentTree, setComponentTree] = useState<ComponentNode>(() => {
    if (initialData?.meta) {
      return convertToNode(initialData.meta, 'root');
    }
    return {
      id: 'root',
      component: 'TextRenderer',
      properties: {},
      children: []
    };
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string>('root');
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonText, setJsonText] = useState('');

  // Convert ComponentMeta to internal node structure
  function convertToNode(meta: ComponentMeta, id: string, parentId?: string): ComponentNode {
    const node: ComponentNode = {
      id,
      component: meta.component,
      properties: { ...meta.properties },
      children: [],
      parent: parentId
    };

    // Handle recursive properties that contain LayoutComponentDetail
    Object.keys(meta.properties || {}).forEach(key => {
      const value = meta.properties[key];
      if (RECURSIVE_PROPERTIES.has(key) && value?.meta) {
        // Convert nested component to child node
        const childId = `${id}_${key}`;
        const childNode = convertToNode(value.meta, childId, id);
        node.children.push(childNode);
        // Remove from properties since it's now a child
        delete node.properties[key];
      } else if (key === 'children' && Array.isArray(value)) {
        // Handle array of LayoutComponentDetail
        value.forEach((child, index) => {
          if (child?.meta) {
            const childId = `${id}_child_${index}`;
            const childNode = convertToNode(child.meta, childId, id);
            node.children.push(childNode);
          }
        });
        // Remove children array from properties
        delete node.properties.children;
      }
    });

    return node;
  }

  // Convert node structure back to LayoutComponentDetail
  function convertToLayoutComponent(node: ComponentNode): LayoutComponentDetail {
    const properties = { ...node.properties };

    // Add children back to properties if component supports them
    if (node.children.length > 0) {
      if (RECURSIVE_COMPONENTS.has(node.component)) {
        if (node.component === 'WrapperRenderer' || node.component === 'CardRenderer') {
          // These components expect children array
          properties.children = node.children.map(child => convertToLayoutComponent(child));
        } else if (node.component === 'ConditionalRenderer') {
          // Handle conditional components
          node.children.forEach((child, index) => {
            if (index === 0) properties.trueComponent = convertToLayoutComponent(child);
            if (index === 1) properties.falseComponent = convertToLayoutComponent(child);
          });
        }
      }
    }

    return {
      meta: {
        component: node.component,
        properties
      } as ComponentMeta
    };
  }

  // Generate the current LayoutComponentDetail object
  const currentLayoutComponent = useMemo((): LayoutComponentDetail => {
    return convertToLayoutComponent(componentTree);
  }, [componentTree]);

  // Update JSON when component tree changes
  React.useEffect(() => {
    onJsonChange(currentLayoutComponent);
    setJsonText(JSON.stringify(currentLayoutComponent, null, 2));
  }, [currentLayoutComponent, onJsonChange]);

  // Find node by ID
  const findNode = useCallback((nodeId: string, node: ComponentNode = componentTree): ComponentNode | null => {
    if (node.id === nodeId) return node;
    for (const child of node.children) {
      const found = findNode(nodeId, child);
      if (found) return found;
    }
    return null;
  }, [componentTree]);

  // Update node in tree
  const updateNode = useCallback((nodeId: string, updates: Partial<ComponentNode>) => {
    const updateNodeRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      return {
        ...node,
        children: node.children.map(updateNodeRecursive)
      };
    };
    setComponentTree(updateNodeRecursive(componentTree));
  }, [componentTree]);

  // Add child node
  const addChildNode = useCallback((parentId: string) => {
    const newChildId = `${parentId}_child_${Date.now()}`;
    const newChild: ComponentNode = {
      id: newChildId,
      component: 'TextRenderer',
      properties: {},
      children: [],
      parent: parentId
    };

    const addChildRecursive = (node: ComponentNode): ComponentNode => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newChild] };
      }
      return {
        ...node,
        children: node.children.map(addChildRecursive)
      };
    };

    setComponentTree(addChildRecursive(componentTree));
    setSelectedNodeId(newChildId);
  }, [componentTree]);

  // Remove node
  const removeNode = useCallback((nodeId: string) => {
    const removeNodeRecursive = (node: ComponentNode): ComponentNode => {
      return {
        ...node,
        children: node.children.filter(child => child.id !== nodeId).map(removeNodeRecursive)
      };
    };
    setComponentTree(removeNodeRecursive(componentTree));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId('root');
    }
  }, [componentTree, selectedNodeId]);

  // Handle component type change for selected node
  const handleComponentTypeChange = useCallback((componentType: keyof ComponentMetaMap) => {
    updateNode(selectedNodeId, {
      component: componentType,
      properties: {} // Reset properties when component type changes
    });
  }, [selectedNodeId, updateNode]);

  // Handle property change for selected node
  const handlePropertyChange = useCallback((key: string, value: any) => {
    const selectedNode = findNode(selectedNodeId);
    if (selectedNode) {
      const newProperties = { ...selectedNode.properties, [key]: value };
      updateNode(selectedNodeId, { properties: newProperties });
    }
  }, [selectedNodeId, findNode, updateNode]);

  // Handle JSON editor changes
  const handleJsonChange = useCallback((value: string) => {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value) as LayoutComponentDetail;
      if (parsed.meta) {
        const newTree = convertToNode(parsed.meta, 'root');
        setComponentTree(newTree);
      }
    } catch (error) {
      // Invalid JSON, don't update the tree
      console.warn('Invalid JSON:', error);
    }
  }, []);

  // Generate tree data for Ant Design Tree component
  const generateTreeData = useCallback((node: ComponentNode): any => {
    return {
      title: `${node.component} (${node.id})`,
      key: node.id,
      children: node.children.map(generateTreeData),
      icon: <BranchesOutlined />
    };
  }, []);

  // Get selected node
  const selectedNode = findNode(selectedNodeId);

  // Render property input for selected node
  const renderPropertyInput = useCallback((propKey: string) => {
    if (!selectedNode) return null;

    const value = selectedNode.properties[propKey];

    // Special handling for specific properties
    if (propKey === 'disabled' || propKey === 'loading') {
      return (
        <Switch
          checked={value}
          onChange={(checked) => handlePropertyChange(propKey, checked)}
        />
      );
    }

    if (propKey === 'size' && selectedNode.component === 'ButtonRenderer') {
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

    if (propKey === 'type' && selectedNode.component === 'ButtonRenderer') {
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
  }, [selectedNode, handlePropertyChange]);

  return (
    <Card title="Enhanced LayoutComponentDetail Builder" style={{ height: '100%', overflow: 'auto' }}>
      <Collapse defaultActiveKey={['tree', 'properties']} ghost>
        {/* Component Tree Panel */}
        <Panel header="Component Tree" key="tree">
          <div style={{ marginBottom: '16px' }}>
            <Space>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => addChildNode(selectedNodeId)}
                disabled={!selectedNode || !RECURSIVE_COMPONENTS.has(selectedNode.component)}
              >
                Add Child
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeNode(selectedNodeId)}
                disabled={selectedNodeId === 'root'}
              >
                Remove Node
              </Button>
            </Space>
          </div>

          <Tree
            showIcon
            selectedKeys={[selectedNodeId]}
            onSelect={(keys) => keys.length > 0 && setSelectedNodeId(keys[0] as string)}
            treeData={[generateTreeData(componentTree)]}
            style={{ background: '#fafafa', padding: '8px', borderRadius: '4px' }}
          />
        </Panel>

        {/* Properties Panel */}
        <Panel header={`Properties for ${selectedNode?.component || 'Unknown'}`} key="properties">
          {selectedNode && (
            <Form form={form} layout="vertical">
              <Form.Item label="Component Type" required>
                <Select
                  value={selectedNode.component}
                  onChange={handleComponentTypeChange}
                  placeholder="Select a component type"
                  showSearch
                >
                  {COMPONENT_TYPES.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Divider>Properties</Divider>

              {/* Render existing properties */}
              {Object.keys(selectedNode.properties).map(propKey => (
                <div key={propKey} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong>{propKey}:</strong>
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        const newProperties = { ...selectedNode.properties };
                        delete newProperties[propKey];
                        updateNode(selectedNodeId, { properties: newProperties });
                      }}
                      danger
                    />
                  </div>
                  {renderPropertyInput(propKey)}
                </div>
              ))}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => {
                  const propertyName = prompt('Enter property name:');
                  if (propertyName && !selectedNode.properties.hasOwnProperty(propertyName)) {
                    handlePropertyChange(propertyName, '');
                  }
                }}
              >
                Add Property
              </Button>
            </Form>
          )}
        </Panel>

        {/* JSON Editor Panel */}
        <Panel header="JSON Editor (Live)" key="json">
          <div style={{ marginBottom: '16px' }}>
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => setShowJsonEditor(!showJsonEditor)}
              >
                {showJsonEditor ? 'Hide' : 'Show'} Editor
              </Button>
            </Space>
          </div>

          {showJsonEditor && (
            <TextArea
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              rows={15}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
              placeholder="Edit JSON directly here..."
            />
          )}

          {!showJsonEditor && (
            <pre style={{
              background: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              fontSize: '12px',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {jsonText}
            </pre>
          )}
        </Panel>
      </Collapse>
    </Card>
  );
};
