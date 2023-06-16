import React from "react";
import { PopoverProps } from "./Popover.library";
import "./Popover.css";
declare const Popover: React.ForwardRefExoticComponent<{
    children?: React.ReactNode;
} & {
    id?: string | undefined;
    show?: boolean | undefined;
    arrowWidth?: number | undefined;
    arrowHeight?: number | undefined;
    arrowOffset?: number | undefined;
    borderRadius?: number | undefined;
    offset?: number | undefined;
    margin?: number | undefined;
    subject?: React.RefObject<HTMLElement> | undefined;
    orientation?: ("north" | "south" | "east" | "west") | undefined;
    className?: string | undefined;
} & React.RefAttributes<HTMLElement>>;
export { Popover };
export type { PopoverProps };
