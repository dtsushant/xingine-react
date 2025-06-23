/**
 * Interface for describing the rendering behavior of UI elements.
 * This interface is fully serializable for use in both UI and DTO contexts.
 */
export interface Renderer {
  /**
   * Detailed description of the UI component to render or the nested Renderer
   * This should include the component type
   */
  componentDetail: UIComponent;

  /**
   * The rendering mode or style to apply.
   * Examples: 'default', 'compact', 'minimal', 'detailed', 'card', 'list', 'grid'
   */
  mode?: string;

  /**
   * Layout configuration for the rendered element.
   */
  layout?: {
    /**
     * Display type: 'block', 'inline', 'flex', 'grid', etc.
     */
    display?: string;

    /**
     * Number of columns for grid layouts.
     */
    columns?: number;

    /**
     * Spacing between elements.
     */
    spacing?: string | number;

    /**
     * Alignment of content: 'left', 'center', 'right', 'justify'
     */
    alignment?: string;
  };

  /**
   * Interaction behavior configuration.
   */
  interaction?: {
    /**
     * Whether the element is clickable.
     */
    clickable?: boolean;

    /**
     * Whether the element supports hover effects.
     */
    hoverable?: boolean;

    /**
     * Whether the element supports drag and drop.
     */
    draggable?: boolean;

    /**
     * Whether the element supports keyboard navigation.
     */
    keyboardNavigable?: boolean;
  };

  /**
   * Display properties for visual customization.
   */
  display?: {
    /**
     * Whether to show borders.
     */
    showBorder?: boolean;

    /**
     * Whether to show shadows.
     */
    showShadow?: boolean;

    /**
     * Background color or theme.
     */
    backgroundColor?: string;

    /**
     * Text color or theme.
     */
    textColor?: string;

    /**
     * Border radius for rounded corners.
     */
    borderRadius?: string | number;

    /**
     * Opacity level (0-1).
     */
    opacity?: number;
  };

  /**
   * Responsive behavior configuration.
   */
  responsive?: {
    /**
     * Breakpoints for different screen sizes.
     */
    breakpoints?: {
      mobile?: Partial<Renderer>;
      tablet?: Partial<Renderer>;
      desktop?: Partial<Renderer>;
    };

    /**
     * Whether the element should be hidden on certain screen sizes.
     */
    hiddenOn?: ('mobile' | 'tablet' | 'desktop')[];
  };

  /**
   * Animation and transition settings.
   */
  animation?: {
    /**
     * Type of animation: 'fade', 'slide', 'scale', 'none'
     */
    type?: string;

    /**
     * Animation duration in milliseconds.
     */
    duration?: number;

    /**
     * Animation easing function.
     */
    easing?: string;

    /**
     * Whether to animate on initial render.
     */
    animateOnMount?: boolean;
  };

  /**
   * Custom CSS classes to apply.
   */
  cssClasses?: string[];

  /**
   * Custom inline styles.
   */
  customStyles?: Record<string, string | number>;

  /**
   * Accessibility configuration.
   */
  accessibility?: {
    /**
     * ARIA role for the element.
     */
    role?: string;

    /**
     * ARIA label for screen readers.
     */
    ariaLabel?: string;

    /**
     * ARIA description.
     */
    ariaDescription?: string;

    /**
     * Tab index for keyboard navigation.
     */
    tabIndex?: number;
  };
}

export interface Comrade {
  id: string;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface Permission {
  name: string;
  description: string;
}

export interface GroupedPermission {
  [key: string]: Permission[];
}

export type UIComponent = Renderer | UIComponentDetail;

export interface UIComponentDetail {
  type: string;
  props?: Record<string, any>;
  children?: UIComponent[];
  content?: string;
}

export interface ModulePropertyOptions {
  uiComponent?: UIComponent[];
  permissions: Permission[];
  description?: string;
}