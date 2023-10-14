import { PropsWithChildren } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import "./Sidebar.css";

type NavLinkClassNamer = (props: {
  isActive: boolean;
  isPending: boolean;
}) => string;

const classNamer: NavLinkClassNamer = ({ isActive }) =>
  isActive ? "list selector active" : "list selector";

export function Sidebar({ children }: PropsWithChildren) {
  return (
    <aside>
      <nav>{children}</nav>
    </aside>
  );
}

export function SidebarSection({ children }: PropsWithChildren) {
  return <menu>{children}</menu>;
}

export function SidebarLink({ children, ...props }: NavLinkProps) {
  return (
    <li>
      <NavLink {...props} className={classNamer}>
        {children}
      </NavLink>
    </li>
  );
}

export function SidebarJube({ children }: PropsWithChildren) {
  return <span className="jube">{children}</span>;
}
