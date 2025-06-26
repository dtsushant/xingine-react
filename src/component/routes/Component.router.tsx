import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { lazyLoadComponent } from "../utils/Component.utils";
import { AccessGuard } from "../ComponentAccessGuard";
import { DefaultLayout } from "../ComponentDefaultLayout";
import { NotFound } from "../group/NotFound";
import {ComponentMetaMap, UIComponentDetail} from "xingine";

export const DynamicRouter = (modules: UIComponentDetail[]) => {
  console.log("the modules", modules);

  return (
    <>
      {modules.length > 0 &&
        modules.map((mod) => {
            const componentName = mod.meta?.component!;
          const Component = lazyLoadComponent(mod.meta?.component!);

          return (
            <Route
              key={mod.path}
              path={mod.path}
              element={
                <AccessGuard
                  roles={mod.roles}
                  permissions={mod.permissions}
                  comrade={undefined}
                >
                  <DefaultLayout>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Component meta={mod?.meta!.properties as ComponentMetaMap[typeof componentName]} />
                    </Suspense>
                  </DefaultLayout>
                </AccessGuard>
              }
            />
          );
        })}
      <Route path="*" element={<NotFound />} />
    </>
  );
};
