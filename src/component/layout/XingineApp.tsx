import {useXingineContext} from "../../context/XingineContextBureau";
import {useMemo} from "react";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import { GlobalStateProvider, ContentStateProvider } from "../../context/HierarchicalActionContext";
import { ToastProvider } from "../group/ToastProvider";

// Layout component that wraps all routes with context providers
function XingineLayout() {
    return (
        <ToastProvider>
            <GlobalStateProvider>
                <ContentStateProvider>
                    <Outlet />
                </ContentStateProvider>
            </GlobalStateProvider>
        </ToastProvider>
    );
}

export function XingineApp() {
    const { routes } = useXingineContext();

    const router = useMemo(() => {
        if (routes.length === 0) return null;
        
        // Wrap all routes with the XingineLayout that provides contexts
        const routesWithLayout = [
            {
                path: "/",
                element: <XingineLayout />,
                children: routes
            }
        ];
        
        return createBrowserRouter(routesWithLayout);
    }, [routes]);

    return router ? <RouterProvider router={router} /> : <div>Loading...</div>;
}