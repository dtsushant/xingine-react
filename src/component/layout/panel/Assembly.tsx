import { Breadcrumb, Tabs } from "antd";
import {Link, Outlet, useLocation} from "react-router-dom";
import React from "react";
import { Content } from "antd/lib/layout/layout";

const Assembly = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  return (
    <section className="p-4">
        <Breadcrumb
            className="mb-4"
            items={[
                { title: <Link to="/">Home</Link> },
                ...pathSnippets.map((_, index) => {
                    const isLast = index === pathSnippets.length - 1;
                    const path = `/${pathSnippets.slice(0, index + 1).join("/")}`;
                    return {
                        title: isLast ? _ : <Link to={path}>{_}</Link>,
                        key: path,
                    };
                }),
            ]}
        />

      <Content className="p-6">
        <Outlet />
      </Content>
    </section>
  );
};

export default Assembly;
