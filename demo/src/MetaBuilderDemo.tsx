import React from 'react';
import { Card, Typography, Space, Divider } from 'antd';
import { MetaBuilderRenderer } from '../../src/component/group/MetaBuilderRenderer';

const { Title, Paragraph, Text, Link } = Typography;

export const MetaBuilderDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={2}>LayoutComponentDetail Meta Builder</Title>
        <Paragraph>
          This tool allows you to build and preview <Text code>LayoutComponentDetail</Text> JSON
          configurations using a dynamic form interface with live validation and preview.
        </Paragraph>

        <Title level={4}>Features:</Title>
        <ul>
          <li><strong>Dynamic Form Builder:</strong> Build component configurations using an intuitive form interface</li>
          <li><strong>Live Preview:</strong> See how your component will render in real-time</li>
          <li><strong>JSON Validation:</strong> Automatic validation of LayoutComponentDetail structure</li>
          <li><strong>Import/Export:</strong> Save and load configurations as JSON</li>
          <li><strong>Component Library:</strong> Support for all available component types</li>
        </ul>

        <Divider />

        <Title level={4}>How to Use:</Title>
        <ol>
          <li>Select a component type from the dropdown (e.g., TextRenderer, ButtonRenderer, etc.)</li>
          <li>Configure the component properties in the form on the left</li>
          <li>Watch the live preview update on the right as you make changes</li>
          <li>Add custom properties using the "Add Custom Property" button</li>
          <li>Use the toolbar buttons to save, load, or copy the JSON configuration</li>
        </ol>
      </Card>

      {/* Meta Builder Component */}
      <MetaBuilderRenderer />
    </div>
  );
};
