import React, {createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, useMemo} from "react";
import {ActionContext, ActionContextSubscribers} from "xingine";
import {useInRouterContext, useLocation, useNavigate} from "react-router-dom";
import {XingineContext} from "./XingineContextBureau";

export const ActionContextReact = createContext<ActionContext | undefined>(undefined);

export function useActionContext(): ActionContext {
    if (!useContext(XingineContext)) {
        throw new Error("useActionContext must be used within a XingineContext");
    }
    if (!useInRouterContext()) {
        throw new Error('useActionContext() must be used within a <Router> and <ActionProvider>');
    }
    const ctx = useContext(ActionContextReact);
    if (!ctx) throw new Error('useActionContext must be used within an <ActionProvider>');
    return ctx;
}
export const ActionProvider: React.FC<{
    children: React.ReactNode,
}> = ({ children }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Shared state map per route
    const [stateMap, setStateMap] = useState<Record<string, unknown>>({});

    // Subscriber map (per route)
    const subscribers = useRef<Map<string, Set<() => void>>>(new Map());

    // Create only once per route
    const ctxRef = useRef<ActionContext | null>(null);

    const stateRef = useRef(stateMap);

    // Function to notify subscribers directly (no React state dependency)
    const notifySubscribers = (key: string) => {
        console.log(`🔄 Notifying subscribers for key: "${key}"`);
        
        // Notify specific key subscribers
        const keySubscribers = subscribers.current.get(key);
        if (keySubscribers && keySubscribers.size > 0) {
            keySubscribers.forEach(fn => {
                try {
                    fn();
                } catch (error) {
                    console.error(`Error in subscriber for key "${key}":`, error);
                }
            });
        }

        // Also notify global subscribers (for useAllSharedState)
        const globalSubscribers = subscribers.current.get('__all__');
        if (globalSubscribers && globalSubscribers.size > 0) {
            console.log(`🌐 Notifying ${globalSubscribers.size} global subscribers for key: "${key}"`);
            globalSubscribers.forEach(fn => {
                try {
                    fn();
                } catch (error) {
                    console.error(`Error in global subscriber for key "${key}":`, error);
                }
            });
        }
    };

    // Update stateRef when stateMap changes
    useEffect(() => {
        stateRef.current = stateMap;
    }, [stateMap]);


    // Memoize context to prevent recreation on every render
    const contextValue = useMemo(() => {
        if (!ctxRef.current) {
            const navigateTo: ActionContext['navigate'] = (path) => {
                if (typeof path !== 'string') throw new Error('navigate requires path to be a string');
                navigate(path);
            };

            const setState: ActionContext['setState'] = (key, setter) => {
                setStateMap(prev => {
                    const prevVal = prev[key];
                    const newVal =
                        typeof setter === 'function'
                            ? (setter as (p: unknown) => unknown)(prevVal)
                            : setter;

                    // Deep equality check for objects and arrays
                    const isEqual = (a: unknown, b: unknown): boolean => {
                        if (a === b) return true;
                        if (a === null || b === null || a === undefined || b === undefined) return a === b;
                        if (typeof a !== typeof b) return false;
                        if (typeof a !== 'object') return false;
                        
                        if (Array.isArray(a) !== Array.isArray(b)) return false;
                        if (Array.isArray(a)) {
                            const arrA = a as unknown[];
                            const arrB = b as unknown[];
                            if (arrA.length !== arrB.length) return false;
                            return arrA.every((item, i) => isEqual(item, arrB[i]));
                        }
                        
                        const keysA = Object.keys(a as object);
                        const keysB = Object.keys(b as object);
                        if (keysA.length !== keysB.length) return false;
                        
                        return keysA.every(k => isEqual((a as any)[k], (b as any)[k]));
                    };

                    // Only update if value actually changed
                    if (isEqual(prevVal, newVal)) {
                        console.log(`⏭️ Skipping state update for key "${key}" (no change detected)`);
                        return prev;
                    }

                    console.log(`📝 State change for key "${key}":`, { prevVal, newVal });
                    const updated = { ...prev, [key]: newVal };
                    
                    // Notify subscribers immediately after state update
                    // Use setTimeout to ensure state is updated before notification
                    setTimeout(() => {
                        stateRef.current = updated;
                        notifySubscribers(key);
                    }, 0);
                    
                    return updated;
                });
            };

            const getState: ActionContext['getState'] = (key) => {
                return stateRef.current[key];
            };

            const getAllState: ActionContext['getAllState'] = () => stateRef.current;

            const makeApiCall: ActionContext['makeApiCall'] = async ({ url, method = 'GET', body }) => {
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    ...(body ? { body: JSON.stringify(body) } : {}),
                });
                if (!res.ok) throw new Error(`API error: ${res.status}`);
                return res.json();
            };

            const dynamic: ActionContext['dynamic'] = (name, args, event) => {
                console.log(`[Dynamic] ${name}`, args, event);
            };

            const ctx: ActionContext = {
                navigate: navigateTo,
                setState,
                getState,
                getAllState,
                makeApiCall,
                dynamic,
                get __state() { return stateRef.current; }, // Getter for dynamic state access
            };

            // Cache and register this context
            ctxRef.current = ctx;
            ActionContextSubscribers.set(ctx, subscribers.current);
            console.log('🏗️ ActionContext created and registered');
        }
        
        return ctxRef.current;
    }, [navigate]); // Only recreate if navigate function changes

    return (
        <ActionContextReact.Provider value={contextValue}>
            {children}
        </ActionContextReact.Provider>
    );
};

export function useSharedState<T>(key: string): T | undefined {
    const ctx = useActionContext();

    return useSyncExternalStore(
        // Subscribe to changes
        (callback) => {
            console.log(`🔌 Subscribing to state key: "${key}"`);
            const map = ActionContextSubscribers.get(ctx);
            if (!map) return () => {};
            if (!map.has(key)) map.set(key, new Set());
            map.get(key)!.add(callback);
            return () => {
                console.log(`🔌 Unsubscribing from state key: "${key}"`);
                map.get(key)?.delete(callback);
                // Clean up empty sets to prevent memory leaks
                if (map.get(key)?.size === 0) {
                    map.delete(key);
                }
            };
        },

        // Get current value — must always return the same object across renders unless changed
        () => {
            const value = ctx.getState(key) as T | undefined;
            console.log(`📖 Reading state for key "${key}":`, value);
            return value;
        },

        // Server render fallback
        () => undefined
    );
}

export function useAllSharedState(): Record<string, unknown> {
    const ctx = useActionContext();

    return useSyncExternalStore(
        (callback) => {
            const subs = ActionContextSubscribers.get(ctx);
            if (!subs) return () => {};

            // Use a special key for global subscriptions
            const globalKey = '__all__';
            if (!subs.has(globalKey)) {
                subs.set(globalKey, new Set());
            }
            subs.get(globalKey)!.add(callback);

            return () => {
                subs.get(globalKey)?.delete(callback);
                // Clean up empty sets
                if (subs.get(globalKey)?.size === 0) {
                    subs.delete(globalKey);
                }
            };
        },
        () => ctx.getAllState?.() ?? {},
        () => ({})
    );
}