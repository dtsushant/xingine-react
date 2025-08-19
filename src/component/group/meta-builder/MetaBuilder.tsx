import React, { useState, useCallback } from 'react';
import { Row, Col, Card, Button, Space, message, Modal } from 'antd';
import { SaveOutlined, DownloadOutlined, ClearOutlined, CopyOutlined } from '@ant-design/icons';
import { LayoutComponentDetail } from 'xingine';
import { MetaBuilderForm } from './MetaBuilderForm';
import { LivePreviewWindow } from './LivePreviewWindow';

interface MetaBuilderProps {
  onSave?: (layoutComponent: LayoutComponentDetail) => void;
  onLoad?: () => LayoutComponentDetail | null;
  initialData?: LayoutComponentDetail;
}

export const MetaBuilder: React.FC<MetaBuilderProps> = ({
  onSave,
  onLoad,
  initialData
}) => {
  const [currentLayoutComponent, setCurrentLayoutComponent] = useState<LayoutComponentDetail | null>(
    initialData || null
  );
  const [jsonModalVisible, setJsonModalVisible] = useState(false);

  // Handle changes from the form
  const handleJsonChange = useCallback((layoutComponent: LayoutComponentDetail | null) => {
    setCurrentLayoutComponent(layoutComponent);
  }, []);

  // Save current configuration
  const handleSave = useCallback(() => {
    if (!currentLayoutComponent || !currentLayoutComponent.meta) {
      message.error('No valid component to save');
      return;
    }

    if (onSave) {
      onSave(currentLayoutComponent);
      message.success('Component configuration saved!');
    } else {
      // Default behavior - copy to clipboard
      navigator.clipboard.writeText(JSON.stringify(currentLayoutComponent, null, 2))
        .then(() => {
          message.success('JSON copied to clipboard!');
        })
        .catch(() => {
          message.error('Failed to copy to clipboard');
        });
    }
  }, [currentLayoutComponent, onSave]);

  // Load configuration
  const handleLoad = useCallback(() => {
    if (onLoad) {
      const loadedData = onLoad();
      if (loadedData) {
        setCurrentLayoutComponent(loadedData);
        message.success('Configuration loaded!');
      }
    } else {
      // Show modal to paste JSON
      setJsonModalVisible(true);
    }
  }, [onLoad]);

  // Clear current configuration
  const handleClear = useCallback(() => {
    Modal.confirm({
      title: 'Clear Configuration',
      content: 'Are you sure you want to clear the current configuration?',
      onOk: () => {
        setCurrentLayoutComponent(null);
        message.info('Configuration cleared');
      }
    });
  }, []);

  // Copy JSON to clipboard
  const handleCopyJson = useCallback(() => {
    if (!currentLayoutComponent) {
      message.error('No component to copy');
      return;
    }

    navigator.clipboard.writeText(JSON.stringify(currentLayoutComponent, null, 2))
      .then(() => {
        message.success('JSON copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy to clipboard');
      });
  }, [currentLayoutComponent]);

  // Handle JSON import from modal
  const handleJsonImport = useCallback((jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText) as LayoutComponentDetail;
      setCurrentLayoutComponent(parsed);
      setJsonModalVisible(false);
      message.success('JSON imported successfully!');
    } catch (error) {
      message.error('Invalid JSON format');
    }
  }, []);

  return (
    <div style={{ height: '100vh', padding: '16px', backgroundColor: '#f5f5f5' }}>
      {/* Header with actions */}
      <Card size="small" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>LayoutComponentDetail Meta Builder</h2>
            <p style={{ margin: 0, color: '#666' }}>
              Build and preview LayoutComponentDetail JSON configurations with live validation
            </p>
          </div>

          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleLoad}
            >
              Load JSON
            </Button>

            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyJson}
              disabled={!currentLayoutComponent}
            >
              Copy JSON
            </Button>

            <Button
              icon={<SaveOutlined />}
              onClick={handleSave}
              type="primary"
              disabled={!currentLayoutComponent || !currentLayoutComponent.meta}
            >
              Save
            </Button>

            <Button
              icon={<ClearOutlined />}
              onClick={handleClear}
              danger
            >
              Clear
            </Button>
          </Space>
        </div>
      </Card>

      {/* Main content area with form and preview */}
      <Row gutter={16} style={{ height: 'calc(100vh - 140px)' }}>
        {/* Left panel - Form builder */}
        <Col span={12}>
          <MetaBuilderForm
            onJsonChange={handleJsonChange}
            initialData={currentLayoutComponent || undefined}
          />
        </Col>

        {/* Right panel - Live preview */}
        <Col span={12}>
          <LivePreviewWindow
            layoutComponent={currentLayoutComponent}
            title="Live Component Preview"
          />
        </Col>
      </Row>

      {/* JSON Import Modal */}
      <JsonImportModal
        visible={jsonModalVisible}
        onCancel={() => setJsonModalVisible(false)}
        onImport={handleJsonImport}
      />
    </div>
  );
};

// JSON Import Modal Component
interface JsonImportModalProps {
  visible: boolean;
  onCancel: () => void;
  onImport: (json: string) => void;
}

const JsonImportModal: React.FC<JsonImportModalProps> = ({
  visible,
  onCancel,
  onImport
}) => {
  const [jsonText, setJsonText] = useState('');

  const handleImport = () => {
    onImport(jsonText);
    setJsonText('');
  };

  return (
    <Modal
      title="Import LayoutComponentDetail JSON"
      open={visible}
      onCancel={onCancel}
      onOk={handleImport}
      okText="Import"
      cancelText="Cancel"
      width={600}
    >
      <div style={{ marginBottom: '12px' }}>
        <p>Paste your LayoutComponentDetail JSON configuration below:</p>
      </div>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder={`{
  "meta": {
    "component": "TextRenderer",
    "properties": {
      "content": "Hello World"
    }
  }
}`}
        style={{
          width: '100%',
          height: '300px',
          fontFamily: 'monospace',
          fontSize: '12px',
          padding: '12px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px'
        }}
      />
    </Modal>
  );
};
