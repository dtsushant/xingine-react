import {useActionContext, useSharedState} from "../../context/ActionContextBureau";
import React from "react";
import {LayoutRenderer, runAction, SerializableAction} from "xingine";
import {toCSSClassName, toCSSProperties} from "../utils/Component.utils";
import {RenderComponent, onInitRegister} from "./utils/Layout.utils";
import {Outlet} from "react-router-dom";
import {createLayoutStateActions, DEFAULT_STATE_KEYS, DEFAULT_TOGGLE_ACTIONS} from "./constant";

const useCurrentScreenSize = () => {
    const actionContext = useActionContext();
    const current = useSharedState<number>(DEFAULT_STATE_KEYS.CURRENT_SCREEN_SIZE) || undefined;

    React.useEffect(() => {
        const checkScreenSize = () => {
            console.info("how often am i triggered")
            const currentWidth = window.innerWidth
            // Get fresh value inside effect to avoid re-render-in-render
            const currentVal = actionContext.getState(DEFAULT_STATE_KEYS.CURRENT_SCREEN_SIZE) as number;

            if (currentWidth !== currentVal) {
                const action: SerializableAction = {
                    action: 'setState',
                    args: {
                        key: DEFAULT_STATE_KEYS.CURRENT_SCREEN_SIZE,
                        value: currentWidth,
                    },
                };
                runAction(action, actionContext);
            }
        };

        // Delay first check until after mount to prevent re-entrant render
        setTimeout(checkScreenSize, 0);

        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [actionContext]);

    return current;
};

export const DefaultLayoutRenderer: React.FC<LayoutRenderer> = (
    layout,
) => {
    const actionContext = useActionContext();
    const hasInitialized = React.useRef(false);

    // Initialize default states and actions only on first load
    React.useEffect(() => {
        if (hasInitialized.current) return;
        
        const defaultActions = createLayoutStateActions(layout);

        onInitRegister(defaultActions, actionContext);
        hasInitialized.current = true;
    }, [layout, actionContext]);

    const _ = useCurrentScreenSize();


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
            {/* Header */}
            {layout.header && (
                <header
                    className={toCSSClassName(layout.header.style?.className)}
                    style={toCSSProperties(layout.header.style?.style)}
                >
                    <RenderComponent {...layout.header.meta} />
                </header>
            )}

            <div className={toCSSClassName(`flex #{hasHeader ? "mt-46" : ""}`)}>
                {/* Sidebar */}
                {layout.sider && <RenderComponent {...layout.sider.meta} />}

                {/* Main Content Area */}
                <div
                    className={toCSSClassName(`flex-1 transition-all duration-200 #{hasSider && collapsed ? "ml-20" : hasSider && collapsed === false ? "ml-52" : "ml-0"} pt-6`)}
                >
                    {/* Content */}
                    <main
                        className={toCSSClassName(`#{darkMode ? "bg-gray-800" : "bg-white"} p-6 min-h-screen #{hasFooter ? "pb-20" : "pb-6"}`)}
                    >
                        <div
                            className={toCSSClassName(`#{darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm p-6`)}
                        >
                            <Outlet />
                        </div>
                    </main>

                    {/* Footer */}
                    {layout.footer && (
                        <footer
                            className={toCSSClassName(layout.footer.style?.className)}
                        >
                            <RenderComponent {...layout.footer.meta} />
                        </footer>
                    )}
                </div>
            </div>
        </div>
    );
};