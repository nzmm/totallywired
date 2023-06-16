import React from "react";
import { IVirtualListItem, ListItemRenderer, VirtualListProps } from "./VirtualList.library";
import "./VirtualList.css";
/**
 * A list component which renders only the visible items.
 */
declare const VirtualList: <T extends IVirtualListItem>({ items, renderer: ItemRenderer, xOverflow, yOverflow }: VirtualListProps<T>) => React.JSX.Element;
export { VirtualList };
export type { ListItemRenderer, VirtualListProps };
