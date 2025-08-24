import {useXingineContext} from "../../context/XingineContextBureau";
import {useMemo} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

export function XingineApp() {
    const { routes } = useXingineContext();

    const router = useMemo(() => {
        if (routes.length === 0) return null;
        return createBrowserRouter(routes);
    }, [routes]);

    return router ? <RouterProvider router={router} /> : <div>Loading...</div>;
}