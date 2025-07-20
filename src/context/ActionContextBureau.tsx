import React, {createContext, useContext, useEffect, useRef, useState, useSyncExternalStore} from "react";
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
    const [keyModified, setKeyModified] = useState<string>('');

    // Subscriber map (per route)
    const subscribers = useRef<Map<string, Set<() => void>>>(new Map());

    // Create only once per route
    const ctxRef = useRef<ActionContext | null>(null);

    const stateRef = useRef(stateMap);

    useEffect(() => {
        stateRef.current = stateMap;

        // Reload the component on that are using the key
        subscribers.current.get(keyModified)?.forEach(fn => {
            fn();
        });
        /*for (const [key, subs] of subscribers.current.entries()) {
            console.info("the key here is ", key)
            subs.forEach(fn => fn());
        }*/
    }, [keyModified,stateMap]);


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

                const updated = { ...prev, [key]: newVal };
                setKeyModified(key);
                return updated;
            });
        };

        const getState: ActionContext['getState'] = (key) => {
            return stateRef.current[key];
        };

        const  getAllState:ActionContext['getAllState']=()=>stateRef.current;

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
            __state: stateMap, // Internal state for registry
        };

        // Cache and register this context
        ctxRef.current = ctx;
           //ActionContextRegistry.set(pathname, ctx);
        ActionContextSubscribers.set(ctx, subscribers.current);
    }
    const context = ctxRef.current;

    if(context)
        ActionContextSubscribers.set(context, subscribers.current)



    return (
        context && <ActionContextReact.Provider value={context}>
            {children}
        </ActionContextReact.Provider>
    );
};

export function useSharedState<T>(key: string): T | undefined {
    const ctx = useActionContext();

    return useSyncExternalStore(
        // Subscribe to changes
        (callback) => {
            const map = ActionContextSubscribers.get(ctx);
            if (!map) return () => {};
            if (!map.has(key)) map.set(key, new Set());
            map.get(key)!.add(callback);
            return () => {
                map.get(key)?.delete(callback);
            };
        },

        // Get current value — must always return the same object across renders unless changed
        () => ctx.getState(key) as T | undefined,

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

            // Subscribe to all keys
            const keys = Array.from(subs.keys());
            keys.forEach((key) => {
                if (!subs.get(key)) subs.set(key, new Set());
                subs.get(key)!.add(callback);
            });

            return () => {
                keys.forEach((key) => {
                    subs.get(key)?.delete(callback);
                });
            };
        },
        () => ctx.getAllState?.() ?? {},
        () => ({})
    );
}