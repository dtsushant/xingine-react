import React, { createContext, useContext, useRef, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
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

    // Create stable functions to prevent unnecessary re-renders
    const stableSetState = useCallback((key: string, value: unknown) => {
        setGlobalState(prev => ({ ...prev, [key]: value }));
    }, []);
    
    const stableGetState = useCallback((key: string) => globalState[key], [globalState]);
    
    const stableMakeApiCall = useCallback(async ({ url, method = 'GET', body }: any) => {
        const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];
        const shouldIncludeBody = body && methodsWithBody.includes(method.toUpperCase());

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            ...(shouldIncludeBody ? { body: JSON.stringify(body) } : {}),
        }).catch(err=> {console.warn("Fetch error: ", err); throw err; });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
    }, []);
    
    const stableSetLocalStorage = useCallback((key: string, value: unknown) => {
        localStorage.setItem(key, String(value));
    }, []);
    
    const stableGetLocalStorage = useCallback((key: string) => localStorage.getItem(key), []);
    const stableRemoveLocalStorage = useCallback((key: string) => localStorage.removeItem(key), []);
    const stableClearLocalStorage = useCallback(() => localStorage.clear(), []);
    
    const stableShowToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        console.warn(`Toast [${type.toUpperCase()}]: ${message}`);
        showToastFromProvider({ message, type });
    }, [showToastFromProvider]);
    
    const stableError = useCallback((message: string, details?: unknown) => {
        console.error('Action error:', message, details);
    }, []);

    const globalContext = useMemo(() => ({
        state: globalState,
        setState: stableSetState,
        getState: stableGetState,
        navigate,
        // Other global methods
        makeApiCall: stableMakeApiCall,
        setLocalStorage: stableSetLocalStorage,
        getLocalStorage: stableGetLocalStorage,
        removeLocalStorage: stableRemoveLocalStorage,
        clearLocalStorage: stableClearLocalStorage,
        showToast: stableShowToast,
        error: stableError,
        dynamic: async (name: string, args: any, event?: any) => {
            console.log(`[Dynamic] ${name}`, args, event);
            
            // Initialize performance metrics if not already done
            if (!stableGetState('performanceMetrics')) {
                stableSetState('performanceMetrics', {
                    actionCount: 0,
                    renderCount: 0,
                    stateUpdates: 0,
                    componentsCreated: 0,
                    componentsCleaned: 0,
                    startTime: Date.now()
                });
            }
            
            // Helper function to update heap size if available
            const updateHeapSize = () => {
                if ('memory' in (performance as any)) {
                    const memory = (performance as any).memory;
                    const heapSizeMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                    const memoryUsageEl = document.getElementById('memory-usage');
                    if (memoryUsageEl) memoryUsageEl.textContent = `${heapSizeMB}MB`;
                }
            };
            
            // Update heap size for any action
            updateHeapSize();
            
            // Handle specific actions
            if (name === 'makeApiCall') {
                return await stableMakeApiCall(args);
            } else if (name === 'setState') {
                stableSetState(args.key, args.value);
                return { success: true };
            } else if (name === 'setLocalStorage' || name === 'setStorage') {
                stableSetLocalStorage(args.key, args.value);
                return { success: true };
            } else if (name === 'navigate') {
                navigate(args.path || args);
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
            } else if (name === 'startHighFrequencyTest') {
                console.log('🚀 Starting high frequency test...');
                stableSetState('highFrequencyCounter', 0);
                stableSetState('isHighFrequencyRunning', true);
                
                // Update performance metrics
                const actionCount = ((stableGetState('performanceMetrics') as any)?.actionCount || 0) + 1;
                stableSetState('performanceMetrics', { 
                    ...((stableGetState('performanceMetrics') as any) || {}),
                    actionCount,
                    lastActionTime: Date.now()
                });
                
                // Update DOM elements if they exist
                const actionCountEl = document.getElementById('action-count');
                if (actionCountEl) actionCountEl.textContent = actionCount.toString();
                
                // Simulate rapid updates for performance testing
                let counter = 0;
                const startTime = Date.now();
                const interval = setInterval(() => {
                    counter++;
                    stableSetState('highFrequencyCounter', counter);
                    
                    // Update render metrics
                    const renderCount = ((stableGetState('performanceMetrics') as any)?.renderCount || 0) + 1;
                    stableSetState('performanceMetrics', { 
                        ...((stableGetState('performanceMetrics') as any) || {}),
                        renderCount
                    });
                    
                    const renderCountEl = document.getElementById('render-count');
                    if (renderCountEl) renderCountEl.textContent = renderCount.toString();
                    
                    if (counter >= 100) {
                        clearInterval(interval);
                        stableSetState('isHighFrequencyRunning', false);
                        
                        // Calculate average render time
                        const totalTime = Date.now() - startTime;
                        const avgRenderTime = totalTime / counter;
                        const avgRenderEl = document.getElementById('avg-render-time');
                        if (avgRenderEl) avgRenderEl.textContent = `${avgRenderTime.toFixed(2)}ms`;
                        
                        console.log('✅ High frequency test completed');
                    }
                }, 50); // 20 updates per second
                
                return { success: true, message: 'High frequency test started' };
            } else if (name === 'stopHighFrequencyTest') {
                console.log('🛑 Stopping high frequency test...');
                stableSetState('isHighFrequencyRunning', false);
                return { success: true, message: 'High frequency test stopped' };
            } else if (name === 'incrementSelectorCounter') {
                const { counter } = args;
                console.log(`📊 Incrementing selector counter: ${counter}`);
                
                // Update performance metrics
                const actionCount = ((stableGetState('performanceMetrics') as any)?.actionCount || 0) + 1;
                const stateUpdates = ((stableGetState('performanceMetrics') as any)?.stateUpdates || 0) + 1;
                stableSetState('performanceMetrics', { 
                    ...((stableGetState('performanceMetrics') as any) || {}),
                    actionCount,
                    stateUpdates,
                    lastActionTime: Date.now()
                });
                
                // Update DOM elements
                const actionCountEl = document.getElementById('action-count');
                const stateUpdatesEl = document.getElementById('state-updates');
                if (actionCountEl) actionCountEl.textContent = actionCount.toString();
                if (stateUpdatesEl) stateUpdatesEl.textContent = stateUpdates.toString();
                
                if (counter === 'A') {
                    const currentValue = (stableGetState('selectorCounterA') as number) || 0;
                    stableSetState('selectorCounterA', currentValue + 1);
                } else if (counter === 'B') {
                    const currentValue = (stableGetState('selectorCounterB') as number) || 0;
                    stableSetState('selectorCounterB', currentValue + 1);
                }
                
                return { success: true, message: `Counter ${counter} incremented` };
            } else if (name === 'createMassComponents') {
                const { count = 100 } = args;
                console.log(`🏗️ Creating ${count} mass components...`);
                
                // Update performance metrics
                const actionCount = ((stableGetState('performanceMetrics') as any)?.actionCount || 0) + 1;
                const componentsCreated = ((stableGetState('performanceMetrics') as any)?.componentsCreated || 0) + count;
                stableSetState('performanceMetrics', { 
                    ...((stableGetState('performanceMetrics') as any) || {}),
                    actionCount,
                    componentsCreated,
                    lastActionTime: Date.now()
                });
                
                // Update DOM elements
                const actionCountEl = document.getElementById('action-count');
                const componentsCreatedEl = document.getElementById('components-created');
                const componentCountEl = document.getElementById('component-count');
                if (actionCountEl) actionCountEl.textContent = actionCount.toString();
                if (componentsCreatedEl) componentsCreatedEl.textContent = componentsCreated.toString();
                if (componentCountEl) componentCountEl.textContent = count.toString();
                
                // Simulate component creation
                const components = [];
                for (let i = 0; i < count; i++) {
                    components.push({
                        id: `mass_component_${i}`,
                        type: 'test',
                        created: Date.now(),
                        data: `Component ${i + 1}`
                    });
                }
                
                stableSetState('massComponents', components);
                stableSetState('totalComponents', count);
                
                console.log(`✅ Created ${count} components successfully`);
                return { success: true, message: `Created ${count} components`, count };
            } else if (name === 'cleanupMassComponents') {
                console.log('🧹 Cleaning up mass components...');
                
                const currentComponents = (stableGetState('massComponents') as any[]) || [];
                const componentCount = currentComponents.length;
                
                // Update performance metrics
                const actionCount = ((stableGetState('performanceMetrics') as any)?.actionCount || 0) + 1;
                const componentsCleaned = ((stableGetState('performanceMetrics') as any)?.componentsCleaned || 0) + componentCount;
                stableSetState('performanceMetrics', { 
                    ...((stableGetState('performanceMetrics') as any) || {}),
                    actionCount,
                    componentsCleaned,
                    lastActionTime: Date.now()
                });
                
                // Update DOM elements
                const actionCountEl = document.getElementById('action-count');
                const componentsCleanedEl = document.getElementById('components-cleaned');
                const componentCountEl = document.getElementById('component-count');
                if (actionCountEl) actionCountEl.textContent = actionCount.toString();
                if (componentsCleanedEl) componentsCleanedEl.textContent = componentsCleaned.toString();
                if (componentCountEl) componentCountEl.textContent = '0';
                
                stableSetState('massComponents', []);
                stableSetState('totalComponents', 0);
                
                console.log('✅ Mass components cleaned up successfully');
                return { success: true, message: 'Mass components cleaned up' };
            } else if (name === 'massUpdateComponents') {
                console.log('⚡ Mass updating all components...');
                
                const components = (stableGetState('massComponents') as any[]) || [];
                const updatedComponents = components.map((comp: any) => ({
                    ...comp,
                    lastUpdated: Date.now(),
                    updateCount: (comp.updateCount || 0) + 1
                }));
                
                stableSetState('massComponents', updatedComponents);
                
                console.log(`✅ Updated ${updatedComponents.length} components`);
                return { success: true, message: `Updated ${updatedComponents.length} components` };
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
    }), [globalState, navigate, stableSetState, stableGetState, stableMakeApiCall, stableSetLocalStorage, stableGetLocalStorage, stableRemoveLocalStorage, stableClearLocalStorage, stableShowToast, stableError]);

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

    const contentContext = useMemo(() => {
        // Create stable setState function
        const stableSetState = (key: string, value: unknown) => {
            setContentState(prev => ({ ...prev, [key]: value }));
        };
        
        // Create stable getState function  
        const stableGetState = (key: string) => contentState[key];
        
        return {
            state: contentState,
            setState: stableSetState,
            getState: stableGetState,
            componentStores: componentStoresRef.current
        };
    }, [contentState]); // Only recreate when contentState actually changes

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

    // Add cleanup on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            // Cleanup component store from content context when component unmounts
            if (contentContext?.componentStores.has(componentId)) {
                contentContext.componentStores.delete(componentId);
                console.log(`🧹 Cleaned up component store for: ${componentId}`);
            }
        };
    }, [componentId, contentContext]);

    const componentContext = useMemo(() => {
        // Create stable setState function
        const stableSetState = (key: string, value: unknown) => {
            setComponentState(prev => ({ ...prev, [key]: value }));
        };
        
        // Create stable getState function
        const stableGetState = (key: string) => componentState[key];
        
        // Create stable getAllState function
        const stableGetAllState = () => componentState;
        
        const context = {
            componentId,
            state: componentState,
            setState: stableSetState,
            getState: stableGetState,
            getAllState: stableGetAllState
        };

        // Register component store with content context
        if (contentContext) {
            const componentStore: ComponentStateStore = {
                componentId,
                setState: stableSetState,
                getState: stableGetState,
                getAllState: stableGetAllState
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
    
    // Create stable functions to prevent context recreation
    const stableGetComponentStateStore = useCallback((componentId: string) => {
        const store = contentContext.componentStores.get(componentId);
        if (!store) {
            throw new Error(`Component store not found for componentId: ${componentId}`);
        }
        return store;
    }, [contentContext.componentStores]);
    
    const stableGetAllGlobalState = useCallback(() => globalContext.state, [globalContext.state]);
    const stableGetAllContentState = useCallback(() => contentContext.state, [contentContext.state]);
    
    return useMemo(() => ({
        global: {
            setState: globalContext.setState,
            getState: globalContext.getState,
            getAllState: stableGetAllGlobalState,
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
            getComponentStateStore: stableGetComponentStateStore,
            getContentState: contentContext.getState,
            setContentState: contentContext.setState,
            getAllContentState: stableGetAllContentState
        }
    }), [globalContext, contentContext, stableGetComponentStateStore, stableGetAllGlobalState, stableGetAllContentState]);
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

// Performance optimization: State selector hook to prevent over-subscribing
export function useStateSelector<T>(selector: (state: Record<string, unknown>) => T): T {
    const globalContext = useGlobalState();
    const [selectedValue, setSelectedValue] = useState<T>(() => selector(globalContext.state));
    
    useEffect(() => {
        // Create stable selector reference
        const currentValue = selector(globalContext.state);
        if (currentValue !== selectedValue) {
            setSelectedValue(currentValue);
        }
    }, [globalContext.state, selector, selectedValue]);
    
    return selectedValue;
}

// Performance optimization: Content state selector
export function useContentStateSelector<T>(selector: (state: Record<string, unknown>) => T): T {
    const contentContext = useContentState();
    const [selectedValue, setSelectedValue] = useState<T>(() => selector(contentContext.state));
    
    useEffect(() => {
        const currentValue = selector(contentContext.state);
        if (currentValue !== selectedValue) {
            setSelectedValue(currentValue);
        }
    }, [contentContext.state, selector, selectedValue]);
    
    return selectedValue;
}
