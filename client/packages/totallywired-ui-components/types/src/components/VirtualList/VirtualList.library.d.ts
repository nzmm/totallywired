import { PropsWithChildren } from "react";
interface IVirtualListItem {
    /**
     * The height of the list item
     */
    height: number;
}
type VisibleItem<T extends IVirtualListItem = IVirtualListItem> = {
    i: number;
    y: number;
    data: T;
};
type ListItemRenderer<T extends IVirtualListItem> = (props: PropsWithChildren & T) => React.ReactElement<T>;
type VirtualListProps<T extends IVirtualListItem> = {
    /**
     * The list items to be rendered.
     */
    items: T[];
    /**
     * A component to render each list item.
     */
    renderer: ListItemRenderer<T>;
    /**
     * The x-overflow behaviour.
     */
    xOverflow?: "auto" | "scroll" | "hidden";
    /**
     * The y-overflow behaviour.
     */
    yOverflow?: "auto" | "scroll" | "hidden";
};
type VirtualListItemProps = PropsWithChildren & {
    index: number;
    top: number;
    height: number;
    onFocus: (i: number) => void;
};
type VisibleResult<T extends IVirtualListItem> = [
    VisibleItem<T>[],
    NumericRange,
    NumericRange,
    boolean
];
type NumericRange = [number, number];
declare const getHeight: (data: IVirtualListItem[]) => number;
declare const getVisible: (items: IVirtualListItem[], indexRange: NumericRange, pixelRange: NumericRange, topOffset: number, scrollDelta: number, clientHeight: number) => VisibleResult<any>;
export { getHeight, getVisible };
export type { NumericRange, VirtualListProps, VirtualListItemProps, ListItemRenderer, IVirtualListItem, VisibleItem };
