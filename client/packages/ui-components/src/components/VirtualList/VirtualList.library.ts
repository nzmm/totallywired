import { PropsWithChildren } from "react";

interface IVirtualListItem {
  /**
   * The height of the list item
   */
  height: number;

  /**
   * Optional key, otherwise index is used
   */
  key?: string | number;
}

type VisibleItem<T extends IVirtualListItem = IVirtualListItem> = {
  i: number;
  y: number;
  data: T;
};

type ListItemProps<T> = T & { index: number; top: number; height: number };

type ListItemRenderer<T> = (props: ListItemProps<T>) => React.ReactNode;

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

  onDragStart?: (
    e: React.DragEvent<HTMLElement>,
    item: VisibleItem<T>,
    vlist: React.RefObject<HTMLDivElement>
  ) => void;
  onDragOver?: (
    e: React.DragEvent<HTMLElement>,
    item: VisibleItem<T>,
    vlist: React.RefObject<HTMLDivElement>
  ) => void;
  onDragEnd?: (
    e: React.DragEvent<HTMLElement>,
    item: VisibleItem<T>,
    vlist: React.RefObject<HTMLDivElement>
  ) => void;
  onDrop?: (
    e: React.DragEvent<HTMLElement>,
    item: VisibleItem<T>,
    vlist: React.RefObject<HTMLDivElement>
  ) => void;
};

type VisibleResult<T extends IVirtualListItem> = [
  VisibleItem<T>[],
  NumericRange,
  NumericRange,
  boolean
];

type NumericRange = [number, number];

type FocalItem = { i: number; y: number };

const SKIP_UPDATE: VisibleResult<any> = [[], [0, 0], [0, 0], false];
const EMPTY_UPDATE: VisibleResult<any> = [[], [0, 0], [0, 0], true];
const NO_FOCUS: FocalItem = { i: -1, y: -1 };

const getHeight = (data: IVirtualListItem[]) =>
  data.reduce((acc, cur) => acc + cur.height, 0);

const getItemAtY = <T extends IVirtualListItem>(
  vlist: HTMLDivElement,
  visible: VisibleItem<T>[],
  y: number
) => {
  const { y: vy } = vlist.getBoundingClientRect();
  const cy = vlist.scrollTop + y - vy;
  return visible.find((x) => x.y <= cy && x.y + x.data.height > cy);
};

const getDragItemAtY = <T extends IVirtualListItem>(
  vlist: HTMLDivElement,
  visible: VisibleItem<T>[],
  y: number
) => {
  const { y: vy } = vlist.getBoundingClientRect();
  const cy = vlist.scrollTop + y - vy;

  for (let i = 0; i < visible.length; i++) {
    const item = visible[i];
    const h = item.data.height;

    if (cy >= item.y && cy <= item.y + h / 2) {
      return item;
    }
    if (cy > item.y + h && cy <= item.y + h) {
      return visible[i + 1] ?? item;
    }
  }
  return null;
};

const getResponse = <T extends IVirtualListItem>(
  v: VisibleItem<T>[]
): VisibleResult<T> => {
  if (!v.length) {
    return EMPTY_UPDATE;
  }

  const [ir, pr] = getVisibleRanges(v);
  return [v, ir, pr, true];
};

const getVisibleUpward = <T extends IVirtualListItem>(
  items: T[],
  imin: number,
  pmin: number,
  pmax: number,
  topOffset: number,
  topExtent: number,
  focalItem: FocalItem,
  force = false
): VisibleResult<T> => {
  const updateRequired =
    force ||
    (items[imin] &&
      (pmin + items[imin].height < topOffset || pmax <= topExtent));

  if (!updateRequired) {
    return SKIP_UPDATE;
  }

  let y = pmin;
  let focusSeen = false;
  const visible: VisibleItem<T>[] = [];

  for (let i = imin; i < items.length; i++) {
    const data = items[i];

    if (!data) {
      continue;
    }

    if (y + data.height <= topOffset) {
      y += data.height;
      continue;
    }

    if (y > topExtent) {
      break;
    }

    visible.push({ i, y, data });
    y += data.height;
    focusSeen ||= i === focalItem.i;
  }

  const response = getResponse(visible);

  if (!focusSeen && focalItem.i >= 0 && items.length) {
    visible.push({ ...focalItem, data: items[focalItem.i] });
  }

  return response;
};

const getVisibleDownward = <T extends IVirtualListItem>(
  items: T[],
  imax: number,
  pmin: number,
  pmax: number,
  topOffset: number,
  topExtent: number,
  focalItem: FocalItem
): VisibleResult<T> => {
  const updateRequired =
    items[imax] && (topOffset <= pmin || topExtent < pmax - items[imax].height);

  if (!updateRequired) {
    return SKIP_UPDATE;
  }

  let y = pmax;
  let focusSeen = false;
  const visible: VisibleItem<T>[] = [];

  for (let i = imax; i >= 0; i--) {
    const data = items[i];
    if (!data) {
      continue;
    }

    if (y - data.height >= topExtent) {
      y -= data.height;
      continue;
    }

    if (y < topOffset) {
      break;
    }

    y -= data.height;
    focusSeen ||= i === focalItem.i;
    visible.unshift({ i, y, data });
  }

  const response = getResponse(visible);

  if (!focusSeen && focalItem.i >= 0 && items.length) {
    visible.push({ ...focalItem, data: items[focalItem.i] });
  }

  return response;
};

const getVisible = (
  items: IVirtualListItem[],
  indexRange: NumericRange,
  pixelRange: NumericRange,
  topOffset: number,
  scrollDelta: number,
  clientHeight: number,
  focalItem: FocalItem
) => {
  if (!items) {
    return SKIP_UPDATE;
  }

  const [imin, imax] = indexRange;
  const [pmin, pmax] = pixelRange;

  const topExtent = topOffset + clientHeight;

  return scrollDelta >= 0
    ? // upward scrolling (down arrow clicked)
      getVisibleUpward(
        items,
        imin,
        pmin,
        pmax,
        topOffset,
        topExtent,
        focalItem,
        scrollDelta === 0
      )
    : // downward scrolling (up arrow clicked)
      getVisibleDownward(
        items,
        imax,
        pmin,
        pmax,
        topOffset,
        topExtent,
        focalItem
      );
};

/**
 * Returns the `indexRange` and the `pixelRange`
 */
const getVisibleRanges = (v: VisibleItem[]): [NumericRange, NumericRange] => {
  const min = v[0];
  const max = v[v.length - 1];
  const indexRange: NumericRange = [min.i, max.i];
  const pixelRange: NumericRange = [min.y, max.y + max.data.height];
  return [indexRange, pixelRange];
};

export { getHeight, getItemAtY, getDragItemAtY, getVisible, NO_FOCUS };
export type {
  NumericRange,
  VirtualListProps,
  ListItemRenderer,
  ListItemProps,
  IVirtualListItem,
  VisibleItem,
  FocalItem
};
