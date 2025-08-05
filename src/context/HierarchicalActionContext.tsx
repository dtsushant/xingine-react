import React, { createContext, useContext, useRef, useState, useMemo, ReactNode } from 'react';
import { ActionExecutionContext, ComponentStateStore } from 'xingine';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../component/group/ToastProvider';

// Custom hook to safely use navigate
function useSafeNavigate() {
    try {
        return useNavigate();
    } catch (error) {
        // If we're not in a router context, return a no-op function
        console.warn('useNavigate called outside router context, returning no-op function');
        return () => {};
    }
}

// Global State Context - for app-wide state (rare changes)
interface GlobalStateContextType {
    state: Record<string, unknown>;
    setState: (key: string, value: unknown) => void;
    getState: (key: string) => unknown;
    navigate: (path: string) => void;
    makeApiCall: (params: { url: string; method?: string; body?: any }) => Promise<any>;
    setLocalStorage: (key: string, value: unknown) => void;
    getLocalStorage: (key: string) => string | null;
    removeLocalStorage: (key: string) => void;
    clearLocalStorage: () => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
    error: (message: string, details?: unknown) => void;
    dynamic: (name: string, args: any, event?: any) => Promise<any>;
    logout: () => Promise<void>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// Content State Context - for content area state  
interface ContentStateContextType {
    state: Record<string, unknown>;
    setState: (key: string, value: unknown) => void;
    getState: (key: string) => unknown;
    componentStores: Map<string, ComponentStateStore>;
}

const ContentStateContext = createContext<ContentStateContextType | undefined>(undefined);

// Component State Context - for individual component state
interface ComponentStateContextType {
    componentId: string;
    state: Record<string, unknown>;
    setState: (key: string, value: unknown) => void;
    getState: (key: string) => unknown;
}

const ComponentStateContext = createContext<ComponentStateContextType | undefined>(undefined);

// Global State Provider - wraps entire app
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [globalState, setGlobalState] = useState<Record<string, unknown>>({});
    const navigate = useSafeNavigate();
    const { showToast: showToastFromProvider } = useToast();

    const globalContext = useMemo(() => ({
        state: globalState,
        setState: (key: string, value: unknown) => {
            setGlobalState(prev => ({ ...prev, [key]: value }));
        },
        getState: (key: string) => globalState[key],
        navigate,
        // Other global methods
        makeApiCall: async ({ url, method = 'GET', body }: any) => {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                ...(body ? { body: JSON.stringify(body) } : {}),
            });
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            return res.json();
        },
        setLocalStorage: (key: string, value: unknown) => {
            localStorage.setItem(key, String(value));
        },
        getLocalStorage: (key: string) => localStorage.getItem(key),
        removeLocalStorage: (key: string) => localStorage.removeItem(key),
        clearLocalStorage: () => localStorage.clear(),
        showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
            console.log(`Toast [${type.toUpperCase()}]: ${message}`);
            showToastFromProvider({ message, type });
        },
        error: (message: string, details?: unknown) => {
            console.error('Action error:', message, details);
        },
        dynamic: async (name: string, args: any, event?: any) => {
            console.log(`[Dynamic] ${name}`, args, event);
            
            // Handle specific actions
            if (name === 'makeApiCall') {
                return await globalContext.makeApiCall(args);
            } else if (name === 'setState') {
                globalContext.setState(args.key, args.value);
                return { success: true };
            } else if (name === 'setLocalStorage' || name === 'setStorage') {
                globalContext.setLocalStorage(args.key, args.value);
                return { success: true };
            } else if (name === 'navigate') {
                globalContext.navigate(args.path || args);
                return { success: true };
            } else if (name === 'makeApiCall') {
                // Handle API calls with proper structure
                const { url, method = 'GET', body } = args;
                
                console.log('🔥 Making API call:', { url, method, body });
                
                try {
                    // Mock API response for testing
                    const mockResponse = {
                        success: true,
                        token: 'mock-jwt-token-' + Date.now(),
                        user: {
                            id: 1,
                            username: body?.username || 'testuser',
                            email: `${body?.username || 'testuser'}@example.com`
                        },
                        message: 'Login successful'
                    };
                    
                    console.log('✅ API call successful:', mockResponse);
                    return mockResponse;
                } catch (error) {
                    console.error('❌ API call failed:', error);
                    return { success: false, error: error instanceof Error ? error.message : 'API call failed' };
                }
            }
            
            // For unknown actions, return undefined
            console.warn(`Unknown dynamic action: ${name}`);
            return undefined;
        },
        logout: async () => {
            localStorage.removeItem('authToken');
            setGlobalState(prev => ({ ...prev, user: null, isAuthenticated: false }));
            navigate('/login');
        }
    }), [globalState, navigate, showToastFromProvider]);

    return (
        <GlobalStateContext.Provider value={globalContext}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// Content State Provider - wraps content area
export const ContentStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [contentState, setContentState] = useState<Record<string, unknown>>({});
    const componentStoresRef = useRef<Map<string, ComponentStateStore>>(new Map());

    const contentContext = useMemo(() => ({
        state: contentState,
        setState: (key: string, value: unknown) => {
            setContentState(prev => ({ ...prev, [key]: value }));
        },
        getState: (key: string) => contentState[key],
        componentStores: componentStoresRef.current
    }), [contentState]);

    return (
        <ContentStateContext.Provider value={contentContext}>
            {children}
        </ContentStateContext.Provider>
    );
};

// Component State Provider - wraps individual components
export const ComponentStateProvider: React.FC<{ componentId: string; children: ReactNode }> = ({ 
    componentId, 
    children 
}) => {
    const [componentState, setComponentState] = useState<Record<string, unknown>>({});
    const contentContext = useContext(ContentStateContext);

    const componentContext = useMemo(() => {
        const context = {
            componentId,
            state: componentState,
            setState: (key: string, value: unknown) => {
                setComponentState(prev => ({ ...prev, [key]: value }));
            },
            getState: (key: string) => componentState[key],
            getAllState: () => componentState
        };

        // Register component store with content context
        if (contentContext) {
            const componentStore: ComponentStateStore = {
                componentId,
                setState: context.setState,
                getState: context.getState,
                getAllState: context.getAllState
            };
            contentContext.componentStores.set(componentId, componentStore);
        }

        return context;
    }, [componentId, componentState, contentContext]);

    return (
        <ComponentStateContext.Provider value={componentContext}>
            {children}
        </ComponentStateContext.Provider>
    );
};

// Hooks to access contexts
export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) throw new Error('useGlobalState must be used within GlobalStateProvider');
    return context;
};

export const useContentState = () => {
    const context = useContext(ContentStateContext);
    if (!context) throw new Error('useContentState must be used within ContentStateProvider');
    return context;
};

export const useComponentState = () => {
    const context = useContext(ComponentStateContext);
    if (!context) throw new Error('useComponentState must be used within ComponentStateProvider');
    return context;
};

// Main hook to create ActionExecutionContext for actions
export const useActionExecutionContext = (): ActionExecutionContext => {
    const globalContext = useGlobalState();
    const contentContext = useContentState();
    
    return useMemo(() => ({
        global: {
            setState: globalContext.setState,
            getState: globalContext.getState,
            getAllState: () => globalContext.state,
            makeApiCall: globalContext.makeApiCall,
            navigate: globalContext.navigate,
            setLocalStorage: globalContext.setLocalStorage,
            getLocalStorage: globalContext.getLocalStorage,
            removeLocalStorage: globalContext.removeLocalStorage,
            clearLocalStorage: globalContext.clearLocalStorage,
            showToast: globalContext.showToast,
            error: globalContext.error,
            dynamic: globalContext.dynamic,
            logout: globalContext.logout
        },
        content: {
            chainContext: {}, // TODO: Add chain context if needed
            getComponentStateStore: (componentId: string) => {
                const store = contentContext.componentStores.get(componentId);
                if (!store) {
                    throw new Error(`Component store not found for componentId: ${componentId}`);
                }
                return store;
            },
            getContentState: contentContext.getState,
            setContentState: contentContext.setState,
            getAllContentState: () => contentContext.state
        }
    }), [globalContext, contentContext]);
};

// Legacy compatibility: Create a bridge function to convert ActionExecutionContext to ActionContext
// This allows existing code to continue working while we migrate
export const useLegacyActionContext = () => {
    const executionContext = useActionExecutionContext();
    
    return useMemo(() => ({
        ...executionContext.global,
        // Legacy methods can delegate to the new structure
        setState: executionContext.global.setState,
        getState: executionContext.global.getState,
        getAllState: executionContext.global.getAllState,
        makeApiCall: executionContext.global.makeApiCall,
        navigate: executionContext.global.navigate,
        setLocalStorage: executionContext.global.setLocalStorage,
        getLocalStorage: executionContext.global.getLocalStorage,
        removeLocalStorage: executionContext.global.removeLocalStorage,
        clearLocalStorage: executionContext.global.clearLocalStorage,
        showToast: executionContext.global.showToast,
        error: executionContext.global.error,
        dynamic: executionContext.global.dynamic,
        logout: executionContext.global.logout
    }), [executionContext]);
};
