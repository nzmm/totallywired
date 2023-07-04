import { IVirtualListItem, VisibleItem } from "./VirtualList.library";
import { NumericRange, VisibleResult } from "./VirtualList.types";

const EMPTY_UPDATE: VisibleResult<any> = [[], [0, 0], [0, 0], true];

export const getHeight = (data: IVirtualListItem[]) =>
  data.reduce((acc, cur) => acc + cur.height, 0);

export const getItemAtY = <T extends IVirtualListItem>(
  vlist: HTMLDivElement,
  visible: VisibleItem<T>[],
  y: number
) => {
  const { y: vy } = vlist.getBoundingClientRect();
  const cy = vlist.scrollTop + y - vy;
  return visible.find((x) => x.y <= cy && x.y + x.data.height > cy);
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

export const getResponse = <T extends IVirtualListItem>(
  v: VisibleItem<T>[]
): VisibleResult<T> => {
  if (!v.length) {
    return EMPTY_UPDATE;
  }

  const [ir, pr] = getVisibleRanges(v);
  return [v, ir, pr, true];
};

export const isUpwardUpdateRequired = <T extends IVirtualListItem>(
  items: T[],
  imin: number,
  pmin: number,
  pmax: number,
  topOffset: number,
  topExtent: number,
  force = false
) => {
  return (
    force ||
    (items[imin] &&
      (pmin + items[imin].height < topOffset || pmax <= topExtent))
  );
};

export const isDownwardUpdateRequired = <T extends IVirtualListItem>(
  items: T[],
  imax: number,
  pmin: number,
  pmax: number,
  topOffset: number,
  topExtent: number
) => {
  return (
    items[imax] && (topOffset <= pmin || topExtent < pmax - items[imax].height)
  );
};
