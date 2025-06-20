import { Card } from "antd";

export const TabRenderer = ({ children }: { children: React.ReactNode }) => (
  <Card style={{ margin: 24 }}>{children}</Card>
);

