import {SerializableAction} from "xingine";

// Default layout state keys
export const DEFAULT_STATE_KEYS = {
    HAS_HEADER: 'hasHeader',
    HAS_SIDER: 'hasSider',
    HAS_FOOTER: 'hasFooter',
    COLLAPSED: 'collapsed',
    DARK_MODE: 'darkMode',
    CURRENT_SCREEN_SIZE: 'currentScreenSize'
} as const;

// Default toggle actions that can be used by components
export const DEFAULT_TOGGLE_ACTIONS = {
    TOGGLE_COLLAPSE: {
        action: 'toggleState',
        args: {
            key: DEFAULT_STATE_KEYS.COLLAPSED
        }
    } as SerializableAction,
    
    TOGGLE_DARK_MODE: {
        action: 'toggleState',
        args: {
            key: DEFAULT_STATE_KEYS.DARK_MODE
        }
    } as SerializableAction
} as const;

// Function to create setState actions for layout initialization
export const createLayoutStateActions = (layout: {
    header?: any;
    sider?: any;
    footer?: any;
}): SerializableAction[] => [
    {
        action: 'setState',
        args: {
            key: DEFAULT_STATE_KEYS.HAS_HEADER,
            value: !!layout.header
        }
    },
    {
        action: 'setState',
        args: {
            key: DEFAULT_STATE_KEYS.HAS_SIDER,
            value: !!layout.sider
        }
    },
    {
        action: 'setState',
        args: {
            key: DEFAULT_STATE_KEYS.HAS_FOOTER,
            value: !!layout.footer
        }
    },
    {
        action: 'setState',
        args: {
            key: DEFAULT_STATE_KEYS.COLLAPSED,
            value: false
        }
    },
    {
        action: 'setState',
        args: {
            key: DEFAULT_STATE_KEYS.DARK_MODE,
            value: false
        }
    }
];

// All default actions combined for easy access
export const DEFAULT_ACTIONS = {
    ...DEFAULT_TOGGLE_ACTIONS,
    // Add more action categories here as needed
    // NAVIGATION_ACTIONS: {...},
    // FORM_ACTIONS: {...},
} as const;

// Helper function to get all available action keys
export const getAvailableActionKeys = () => Object.keys(DEFAULT_ACTIONS);

// Helper function to extend default actions with custom actions
export const extendDefaultActions = <T extends Record<string, SerializableAction>>(
    customActions: T
): typeof DEFAULT_ACTIONS & T => ({
    ...DEFAULT_ACTIONS,
    ...customActions
});

// Example usage of extending default actions:
// const customActions = {
//     CUSTOM_ACTION: {
//         action: 'customAction',
//         args: { key: 'value' }
//     } as SerializableAction
// };
// 
// const allActions = extendDefaultActions(customActions);
// // Now you can use allActions.TOGGLE_COLLAPSE or allActions.CUSTOM_ACTION

// Note: Components using these actions must be wrapped in XingineContext
// Example route setup:
// <XingineContextBureau config={config}>
//   <RouterProvider router={router} />
// </XingineContextBureau>

