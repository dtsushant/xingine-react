import { Card } from "antd";
import React from "react";
import {TabMeta} from "xingine";

export const TabRenderer:React.FC<TabMeta> = (meta) => (
    <Card style={{ margin: 24 }}>
        <pre>
            {JSON.stringify(meta, null, 2)}
        </pre>
    </Card>
);

