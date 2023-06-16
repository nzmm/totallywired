import React, { CSSProperties, ForwardedRef, MutableRefObject } from "react";
type PathResult = [string, CSSProperties];
type Orientaion = "north" | "south" | "east" | "west";
type PopoverProps = React.PropsWithChildren & {
    /**
     * Optional element id.
     */
    id?: string;
    /**
     * When true displays the popover.
     */
    show?: boolean;
    /**
     * The width of the arrow point in pixels.
     */
    arrowWidth?: number;
    /**
     * The height of the arrow point in pixels.
     */
    arrowHeight?: number;
    /**
     * The value of the arrow offset.
     * It should be a float value between 0 and 1. Defaults to 0.5.
     */
    arrowOffset?: number;
    /**
     * The border radius (in pixels) of the popover corners.
     */
    borderRadius?: number;
    /**
     * The value in pixels to offset the popover, to allow for dropshadows.
     */
    offset?: number;
    /**
     * The value in pixels of the popover content margin.
     */
    margin?: number;
    /**
     * Optional ref to an anchor element.
     */
    subject?: React.RefObject<HTMLElement>;
    /**
     * Optional position of the popover relative to the subject.
     */
    orientation?: Orientaion;
    /**
     * Optional class name.
     */
    className?: string;
};
type Refs = ForwardedRef<HTMLElement> | MutableRefObject<HTMLElement> | null;
declare const refs: (...refs: Refs[]) => (el: HTMLElement | null) => void;
declare const getPositionStyle: (el: HTMLElement, orientation: Orientaion, width: number, height: number, offset: number, gap?: number) => {
    left: number;
    top: number;
};
/**
 * Returns memoised svg path and margin styles
 */
declare const getPath: (orientation: Orientaion, m: number, x: number, y: number, w: number, h: number, br: number, aw: number, ah: number, ao: number, po?: number) => PathResult;
export { refs, getPath, getPositionStyle };
export type { PopoverProps };
