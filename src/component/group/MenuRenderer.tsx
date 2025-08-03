import React from 'react';
import {Menu, MenuProps} from 'antd';
import {IconMeta, LayoutComponentDetail} from "xingine";
import {useSharedState} from "../../context/ActionContextBureau";
import {useLocation, useNavigate} from "react-router-dom";
import {IconRenderer} from "./IconRenderer";

export interface MenuItems {
  key: string;
  label: string;
  icon?: IconMeta;
  path?: string;
  children?: MenuItems[];
}
export interface MenuMeta {
  menuItems?: MenuItems[];
  loadFromHeader?: boolean;
}

export const MenuRenderer: React.FC<MenuMeta> = (meta) => {
  const collapsed = useSharedState<boolean>("collapsed");
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Detects current path

  const defaultMenuItems = (menus: MenuItems[]): MenuProps["items"] =>
      menus.map(({ key, label, icon, path, children }) => ({
        key: path || key, // Ensure path is the click key
        label,
        icon: icon ? <IconRenderer {...icon} /> : undefined,
        children: children ? defaultMenuItems(children) : undefined,
      }));

  const handleClick = ({ key }: { key: string }) => {
    navigate(key); // key = path
  };


  return (
      <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          inlineCollapsed={collapsed}
          items={defaultMenuItems(meta.menuItems!)}
          onClick={handleClick}
      />
  );
};
export default MenuRenderer;