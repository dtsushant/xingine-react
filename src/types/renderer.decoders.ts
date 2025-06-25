import { exact, string, boolean, optional, array, mixed, either } from 'decoders';
import type { Decoder } from 'decoders';
import { 
  componentMetaDecoder,
  rendererDecoder as xingineRendererDecoder 
} from 'xingine';
import type { 
  LayoutComponentDetail, 
  LayoutRenderer, 
  ComponentMetaMap,
  UIComponent 
} from './renderer.types';

/**
 * Decoder for LayoutComponentDetail interface
 */
export const layoutComponentDetailDecoder: Decoder<any> = exact({
  path: optional(string),
  isMenuItem: boolean,
  component: string,
  children: optional(array(mixed)), // Will be recursively decoded
  content: optional(string),
  meta: optional(mixed)
});

// Create a recursive decoder for LayoutComponentDetail with children
const createRecursiveLayoutComponentDetailDecoder = (): Decoder<any> => {
  const recursiveDecoder: Decoder<any> = exact({
    path: optional(string),
    isMenuItem: boolean,
    component: string,
    children: optional(array(mixed)), // Will be processed recursively
    content: optional(string),
    meta: optional(mixed)
  });

  return recursiveDecoder;
};

export const recursiveLayoutComponentDetailDecoder = createRecursiveLayoutComponentDetailDecoder();

/**
 * Decoder for LayoutRenderer interface
 */
export const layoutRendererDecoder: Decoder<any> = exact({
  type: string,
  header: optional(exact({
    meta: optional(recursiveLayoutComponentDetailDecoder)
  })),
  content: exact({
    meta: recursiveLayoutComponentDetailDecoder
  }),
  sider: optional(exact({
    meta: optional(recursiveLayoutComponentDetailDecoder)
  })),
  footer: optional(exact({
    meta: optional(recursiveLayoutComponentDetailDecoder)
  }))
});

/**
 * Decoder for ComponentMetaMap (extended from xingine)
 * Note: This is a complex type mapping, so we use mixed for flexibility
 */
export const componentMetaMapDecoder: Decoder<any> = mixed;

/**
 * Decoder for UIComponent which can be either LayoutRenderer or LayoutComponentDetail
 */
export const uiComponentDecoder: Decoder<any> = either(
  layoutRendererDecoder,
  recursiveLayoutComponentDetailDecoder
);

/**
 * List decoder for UIComponent arrays
 */
export const uiComponentListDecoder: Decoder<any[]> = array(uiComponentDecoder);

/**
 * Helper function to validate and decode LayoutComponentDetail with recursive children
 */
export function decodeLayoutComponentDetailWithChildren(data: any): LayoutComponentDetail {
  const decoded = recursiveLayoutComponentDetailDecoder.verify(data);
  
  // Process children recursively if they exist
  if (decoded.children) {
    decoded.children = decoded.children.map((child: any) => 
      decodeLayoutComponentDetailWithChildren(child)
    );
  }
  
  return decoded;
}

/**
 * Helper function to validate and decode LayoutRenderer with all nested components
 */
export function decodeLayoutRenderer(data: any): LayoutRenderer {
  const decoded = layoutRendererDecoder.verify(data);
  
  // Process nested components recursively
  if (decoded.header?.meta) {
    decoded.header.meta = decodeLayoutComponentDetailWithChildren(decoded.header.meta);
  }
  
  decoded.content.meta = decodeLayoutComponentDetailWithChildren(decoded.content.meta);
  
  if (decoded.sider?.meta) {
    decoded.sider.meta = decodeLayoutComponentDetailWithChildren(decoded.sider.meta);
  }
  
  if (decoded.footer?.meta) {
    decoded.footer.meta = decodeLayoutComponentDetailWithChildren(decoded.footer.meta);
  }
  
  return decoded;
}

// Export all decoders for external use
export const rendererDecoders = {
  layoutComponentDetailDecoder,
  recursiveLayoutComponentDetailDecoder,
  layoutRendererDecoder,
  componentMetaMapDecoder,
  uiComponentDecoder,
  uiComponentListDecoder,
  decodeLayoutComponentDetailWithChildren,
  decodeLayoutRenderer
};