/// <reference types="react" />
type Unit = "%" | "px" | "em" | "vw" | "vh";
type CSSDimension = number | `${number}${Unit}`;
type Orientation = "vertical" | "horizontal";
type SplitterProps = {
    /**
     * The orientation of the split panels.
     */
    orientation: Orientation;
    /**
     * The initial position of the splitter handle.
     */
    initialPosition?: CSSDimension;
    /**
     * The smallest size that a child can have.
     */
    minSize?: CSSDimension;
    /**
     * The component must be supplied with exactly two children (the panels).
     * The first child will occupy `panel a` and the second child will occupy `panel b`.
     */
    children: [React.ReactNode, React.ReactNode];
};
declare const SUPPORTED_KEYS: Set<string>;
declare const getPosition: (e: DragEvent, orientation: Orientation, splitter: HTMLDivElement) => number;
declare const getStyles: (orientation: Orientation, position: CSSDimension, minSize: CSSDimension) => ({
    width: CSSDimension;
    minWidth: CSSDimension;
} | {
    minWidth: CSSDimension;
    width?: undefined;
})[] | ({
    height: CSSDimension;
    minHeight: CSSDimension;
} | {
    minHeight: CSSDimension;
    height?: undefined;
})[];
declare const shiftX: (parent: HTMLElement, step: number) => number;
declare const shiftY: (parent: HTMLElement, step: number) => number;
export { SUPPORTED_KEYS, getPosition, getStyles, shiftX, shiftY };
export type { CSSDimension, SplitterProps };
