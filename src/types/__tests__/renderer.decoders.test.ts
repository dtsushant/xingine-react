import {
  layoutComponentDetailDecoder,
  layoutRendererDecoder,
  uiComponentDecoder,
  uiComponentListDecoder,
  decodeLayoutComponentDetailWithChildren,
  decodeLayoutRenderer
} from '../renderer.decoders';

describe('Renderer Decoders', () => {
  describe('layoutComponentDetailDecoder', () => {
    it('should decode valid LayoutComponentDetail', () => {
      const validData = {
        isMenuItem: true,
        component: 'FormRenderer',
        path: '/users/create',
        content: 'Test content',
        meta: {
          component: 'FormRenderer',
          properties: {
            title: 'Create User',
            fields: []
          }
        }
      };

      const result = layoutComponentDetailDecoder.verify(validData);
      expect(result.isMenuItem).toBe(true);
      expect(result.component).toBe('FormRenderer');
      expect(result.path).toBe('/users/create');
      expect(result.content).toBe('Test content');
    });

    it('should decode minimal LayoutComponentDetail', () => {
      const minimalData = {
        isMenuItem: false,
        component: 'TextRenderer'
      };

      const result = layoutComponentDetailDecoder.verify(minimalData);
      expect(result.isMenuItem).toBe(false);
      expect(result.component).toBe('TextRenderer');
      expect(result.path).toBeUndefined();
      expect(result.content).toBeUndefined();
      expect(result.meta).toBeUndefined();
    });

    it('should fail for invalid LayoutComponentDetail', () => {
      const invalidData = {
        isMenuItem: 'not-boolean', // Should be boolean
        component: 123 // Should be string
      };

      expect(() => layoutComponentDetailDecoder.verify(invalidData)).toThrow();
    });

    it('should handle LayoutComponentDetail with children', () => {
      const dataWithChildren = {
        isMenuItem: false,
        component: 'WrapperRenderer',
        children: [
          {
            isMenuItem: true,
            component: 'ButtonRenderer',
            path: '/button'
          }
        ]
      };

      const result = layoutComponentDetailDecoder.verify(dataWithChildren);
      expect(result.children).toBeDefined();
      expect(result.children?.length).toBe(1);
    });
  });

  describe('layoutRendererDecoder', () => {
    it('should decode valid LayoutRenderer', () => {
      const validData = {
        type: 'default',
        header: {
          meta: {
            isMenuItem: false,
            component: 'HeaderRenderer'
          }
        },
        content: {
          meta: {
            isMenuItem: false,
            component: 'ContentRenderer'
          }
        },
        sider: {
          meta: {
            isMenuItem: false,
            component: 'SidebarRenderer'
          }
        },
        footer: {
          meta: {
            isMenuItem: false,
            component: 'FooterRenderer'
          }
        }
      };

      const result = layoutRendererDecoder.verify(validData);
      expect(result.type).toBe('default');
      expect(result.header?.meta?.component).toBe('HeaderRenderer');
      expect(result.content.meta.component).toBe('ContentRenderer');
      expect(result.sider?.meta?.component).toBe('SidebarRenderer');
      expect(result.footer?.meta?.component).toBe('FooterRenderer');
    });

    it('should decode minimal LayoutRenderer (only type and content)', () => {
      const minimalData = {
        type: 'simple',
        content: {
          meta: {
            isMenuItem: false,
            component: 'ContentRenderer'
          }
        }
      };

      const result = layoutRendererDecoder.verify(minimalData);
      expect(result.type).toBe('simple');
      expect(result.content.meta.component).toBe('ContentRenderer');
      expect(result.header).toBeUndefined();
      expect(result.sider).toBeUndefined();
      expect(result.footer).toBeUndefined();
    });

    it('should fail for invalid LayoutRenderer (missing content)', () => {
      const invalidData = {
        type: 'invalid'
        // Missing required content field
      };

      expect(() => layoutRendererDecoder.verify(invalidData)).toThrow();
    });

    it('should fail for invalid LayoutRenderer (missing type)', () => {
      const invalidData = {
        content: {
          meta: {
            isMenuItem: false,
            component: 'ContentRenderer'
          }
        }
        // Missing required type field
      };

      expect(() => layoutRendererDecoder.verify(invalidData)).toThrow();
    });
  });

  describe('uiComponentDecoder', () => {
    it('should decode LayoutRenderer as UIComponent', () => {
      const layoutData = {
        type: 'default',
        content: {
          meta: {
            isMenuItem: false,
            component: 'ContentRenderer'
          }
        }
      };

      const result = uiComponentDecoder.verify(layoutData);
      expect(result).toEqual(layoutData);
    });

    it('should decode LayoutComponentDetail as UIComponent', () => {
      const componentData = {
        isMenuItem: true,
        component: 'FormRenderer',
        path: '/form'
      };

      const result = uiComponentDecoder.verify(componentData);
      expect(result).toEqual(componentData);
    });

    it('should fail for invalid UIComponent', () => {
      const invalidData = {
        invalidField: 'invalid'
      };

      expect(() => uiComponentDecoder.verify(invalidData)).toThrow();
    });
  });

  describe('uiComponentListDecoder', () => {
    it('should decode array of UIComponents', () => {
      const listData = [
        {
          type: 'default',
          content: {
            meta: {
              isMenuItem: false,
              component: 'ContentRenderer'
            }
          }
        },
        {
          isMenuItem: true,
          component: 'FormRenderer',
          path: '/form'
        }
      ];

      const result = uiComponentListDecoder.verify(listData);
      expect(result.length).toBe(2);
    });

    it('should fail for invalid array of UIComponents', () => {
      const invalidListData = [
        {
          type: 'valid',
          content: {
            meta: {
              isMenuItem: false,
              component: 'ContentRenderer'
            }
          }
        },
        {
          invalidField: 'invalid'
        }
      ];

      expect(() => uiComponentListDecoder.verify(invalidListData)).toThrow();
    });
  });

  describe('decodeLayoutComponentDetailWithChildren', () => {
    it('should recursively decode LayoutComponentDetail with nested children', () => {
      const dataWithNestedChildren = {
        isMenuItem: false,
        component: 'WrapperRenderer',
        children: [
          {
            isMenuItem: false,
            component: 'FormRenderer',
            children: [
              {
                isMenuItem: false,
                component: 'ButtonRenderer'
              }
            ]
          }
        ]
      };

      const result = decodeLayoutComponentDetailWithChildren(dataWithNestedChildren);
      expect(result.component).toBe('WrapperRenderer');
      expect(result.children).toBeDefined();
      expect(result.children?.[0].component).toBe('FormRenderer');
      expect(result.children?.[0].children).toBeDefined();
      expect(result.children?.[0].children?.[0].component).toBe('ButtonRenderer');
    });

    it('should handle LayoutComponentDetail without children', () => {
      const dataWithoutChildren = {
        isMenuItem: true,
        component: 'ButtonRenderer'
      };

      const result = decodeLayoutComponentDetailWithChildren(dataWithoutChildren);
      expect(result.component).toBe('ButtonRenderer');
      expect(result.children).toBeUndefined();
    });
  });

  describe('decodeLayoutRenderer', () => {
    it('should recursively decode LayoutRenderer with nested components', () => {
      const layoutData = {
        type: 'default',
        header: {
          meta: {
            isMenuItem: false,
            component: 'HeaderRenderer',
            children: [
              {
                isMenuItem: false,
                component: 'ButtonRenderer'
              }
            ]
          }
        },
        content: {
          meta: {
            isMenuItem: false,
            component: 'ContentRenderer',
            children: [
              {
                isMenuItem: false,
                component: 'FormRenderer',
                children: [
                  {
                    isMenuItem: false,
                    component: 'TextRenderer'
                  }
                ]
              }
            ]
          }
        }
      };

      const result = decodeLayoutRenderer(layoutData);
      expect(result.type).toBe('default');
      expect(result.header?.meta?.component).toBe('HeaderRenderer');
      expect(result.header?.meta?.children?.[0].component).toBe('ButtonRenderer');
      expect(result.content.meta.component).toBe('ContentRenderer');
      expect(result.content.meta.children?.[0].component).toBe('FormRenderer');
      expect(result.content.meta.children?.[0].children?.[0].component).toBe('TextRenderer');
    });

    it('should handle LayoutRenderer with simple components (no children)', () => {
      const simpleLayoutData = {
        type: 'simple',
        content: {
          meta: {
            isMenuItem: false,
            component: 'ContentRenderer'
          }
        }
      };

      const result = decodeLayoutRenderer(simpleLayoutData);
      expect(result.type).toBe('simple');
      expect(result.content.meta.component).toBe('ContentRenderer');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle null values gracefully', () => {
      expect(() => layoutComponentDetailDecoder.verify(null)).toThrow();
      expect(() => layoutRendererDecoder.verify(null)).toThrow();
      expect(() => uiComponentDecoder.verify(null)).toThrow();
    });

    it('should handle undefined values gracefully', () => {
      expect(() => layoutComponentDetailDecoder.verify(undefined)).toThrow();
      expect(() => layoutRendererDecoder.verify(undefined)).toThrow();
      expect(() => uiComponentDecoder.verify(undefined)).toThrow();
    });

    it('should handle empty objects', () => {
      expect(() => layoutComponentDetailDecoder.verify({})).toThrow();
      expect(() => layoutRendererDecoder.verify({})).toThrow();
      expect(() => uiComponentDecoder.verify({})).toThrow();
    });

    it('should handle arrays where objects are expected', () => {
      expect(() => layoutComponentDetailDecoder.verify([])).toThrow();
      expect(() => layoutRendererDecoder.verify([])).toThrow();
    });

    it('should handle deeply nested invalid data', () => {
      const deeplyInvalidData = {
        isMenuItem: true,
        component: 'WrapperRenderer',
        children: [
          {
            isMenuItem: false,
            component: 'FormRenderer',
            children: [
              {
                // Missing required fields
                invalidField: 'invalid'
              }
            ]
          }
        ]
      };

      expect(() => decodeLayoutComponentDetailWithChildren(deeplyInvalidData)).toThrow();
    });
  });
});