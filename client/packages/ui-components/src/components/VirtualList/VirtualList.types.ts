export interface IVirtualListItem {
  /**
   * The height of the list item
   */
  height: number;

  /**
   * Optional key, otherwise index is used
   */
  key?: string | number;
}

export type VisibleItem<T extends IVirtualListItem = IVirtualListItem> = {
  i: number;
  y: number;
  data: T;
};

export type ListItemProps<T> = T & {
  index: number;
  top: number;
  height: number;
};
export type ListItemRenderer<T> = (props: ListItemProps<T>) => React.ReactNode;

export type VirtualListProps<T extends IVirtualListItem> = {
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

  /**
   * Option click handler
   */
  onClick?: (e: React.MouseEvent<HTMLElement>, item: VisibleItem<T>) => void;

  /**
   * Option double-click handler
   */
  onDoubleClick?: (
    e: React.MouseEvent<HTMLElement>,
    item: VisibleItem<T>
  ) => void;

  onDragStart?: (e: React.DragEvent<HTMLElement>, item: VisibleItem<T>) => void;

  onDragOver?: (e: React.DragEvent<HTMLElement>, item: VisibleItem<T>) => void;

  onDragEnd?: (e: React.DragEvent<HTMLElement>, item: VisibleItem<T>) => void;

  onDrop?: (e: React.DragEvent<HTMLElement>, item: VisibleItem<T>) => void;
};

export type VisibleResult<T extends IVirtualListItem> = [
  VisibleItem<T>[],
  NumericRange,
  NumericRange,
  boolean
];

export type NumericRange = [number, number];
export type FocalItem = { i: number; y: number };
