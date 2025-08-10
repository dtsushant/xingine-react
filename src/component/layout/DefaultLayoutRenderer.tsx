import React from "react";
import {LayoutRenderer, runAction, SerializableAction} from "xingine";
import {toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {RenderComponent, initComponentDetailWithScope} from "./utils/Layout.utils";
import {Outlet} from "react-router-dom";
import {createLayoutStateActions, DEFAULT_STATE_KEYS, DEFAULT_TOGGLE_ACTIONS} from "./constant";
import {useActionExecutionContext, useGlobalState} from "../../context/HierarchicalActionContext";

const useCurrentScreenSize = () => {
    const executionContext = useActionExecutionContext();
    const globalState = useGlobalState();
    const current = globalState.getState(DEFAULT_STATE_KEYS.CURRENT_SCREEN_SIZE) as number | undefined;

    React.useEffect(() => {
        const checkScreenSize = () => {
            console.info("Screen size check triggered")
            const currentWidth = window.innerWidth
            // Get fresh value inside effect to avoid re-ender-in-render
            const currentVal = globalState.getState(DEFAULT_STATE_KEYS.CURRENT_SCREEN_SIZE) as number;

            if (currentWidth !== currentVal) {
                const action: SerializableAction = {
                    action: 'setState',
                    args: {
                        key: DEFAULT_STATE_KEYS.CURRENT_SCREEN_SIZE,
                        value: currentWidth,
                    },
                };
                runAction(action, executionContext);
            }
        };

        // Delay first check until after mount to prevent re-entrant render
        setTimeout(checkScreenSize, 0);

        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [executionContext, globalState]);

    return current;
};

export const DefaultLayoutRenderer: React.FC<LayoutRenderer> = (
    layout,
) => {
    // ✅ HOOKS MUST BE CALLED IN THE SAME ORDER EVERY TIME
    const executionContext = useActionExecutionContext();
    const globalState = useGlobalState();
    const hasInitialized = React.useRef(false);
    
    // ✅ Always call useCurrentScreenSize hook - no conditional calls
    const _ = useCurrentScreenSize();

    // Initialize default states and actions only on first load
    React.useEffect(() => {
        if (hasInitialized.current) return;
        
        const defaultActions = createLayoutStateActions(layout);

        // Execute each action to initialize the state
        defaultActions.forEach(action => {
            runAction(action, executionContext);
        });
        
        hasInitialized.current = true;
    }, [layout, executionContext]);

    // ✅ Always get state values - no conditional hook calls
    const collapsed = globalState.getState(DEFAULT_STATE_KEYS.COLLAPSED) as boolean;
    const darkMode = globalState.getState(DEFAULT_STATE_KEYS.DARK_MODE) as boolean;
    const hasHeader = globalState.getState(DEFAULT_STATE_KEYS.HAS_HEADER) as boolean;
    const hasSider = globalState.getState(DEFAULT_STATE_KEYS.HAS_SIDER) as boolean;
    const hasFooter = globalState.getState(DEFAULT_STATE_KEYS.HAS_FOOTER) as boolean;


    // Default actions available for components to use:
    // 
    // For collapse toggle: DEFAULT_TOGGLE_ACTIONS.TOGGLE_COLLAPSE
    // onClick: {
    //     action: 'toggleState',
    //     args: {
    //         key: 'collapsed'
    //     }
    // }
    //
    // For dark mode toggle: DEFAULT_TOGGLE_ACTIONS.TOGGLE_DARK_MODE
    // onClick: {
    //     action: 'toggleState',
    //     args: {
    //         key: 'darkMode'
    //     }
    // }
    //
    // Or use the constants directly:
    // onClick: DEFAULT_TOGGLE_ACTIONS.TOGGLE_COLLAPSE
    // onClick: DEFAULT_TOGGLE_ACTIONS.TOGGLE_DARK_MODE
    return (
        <div
            className={toCSSClassName(layout.style?.className)}
            style={toCSSProperties(layout.style?.style)}
        >
            {/* Header - Always render to maintain hook consistency */}
            <header
                className={toCSSClassName(layout.header?.style?.className)}
                style={{
                    ...toCSSProperties(layout.header?.style?.style),
                    display: layout.header ? 'block' : 'none'
                }}
            >
                {layout.header?.meta && <RenderComponent {...initComponentDetailWithScope(layout.header.meta,'header')} />}
            </header>

            <div className={toCSSClassName(`flex ${hasHeader ? "mt-16" : ""}`)}>
                {/* Sidebar - Always render container to maintain hook consistency */}
                <aside
                    style={{
                        display: layout.sider?.meta ? 'block' : 'none'
                    }}
                >
                    {layout.sider?.meta && <RenderComponent {...initComponentDetailWithScope(layout.sider.meta,'sider')} />}
                </aside>

                {/* Main Content Area */}
                <div
                    className={toCSSClassName(layout.content?.style?.className || "flex-1 transition-all duration-200 pt-6")}
                    style={toCSSProperties(layout.content?.style?.style)}
                >
                    {/* Content */}
                    <main
                        className={toCSSClassName(`${darkMode ? "bg-gray-800" : "bg-white"} p-6 min-h-screen ${hasFooter ? "pb-20" : "pb-6"}`)}
                    >
                        <div
                            className={toCSSClassName(`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm p-6`)}
                        >
                            <Outlet />
                        </div>
                    </main>

                    {/* Footer - Always render to maintain hook consistency */}
                    <footer
                        className={toCSSClassName(layout.footer?.style?.className)}
                        style={{
                            ...toCSSProperties(layout.footer?.style?.style),
                            display: layout.footer ? 'block' : 'none'
                        }}
                    >
                        {layout.footer?.meta && <RenderComponent {...initComponentDetailWithScope(layout.footer.meta,'footer')} />}
                    </footer>
                </div>
            </div>
        </div>
    );
};