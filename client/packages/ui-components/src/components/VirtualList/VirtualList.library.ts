import {
  isUpwardUpdateRequired,
  getResponse,
  getHeight,
  getItemAtY,
  isDownwardUpdateRequired
} from "./VirtualList.helpers";
import {
  VisibleResult,
  FocalItem,
  NumericRange,
  IVirtualListItem,
  VisibleItem,
  VirtualListProps,
  ListItemRenderer,
  ListItemProps
} from "./VirtualList.types";

const SKIP_UPDATE: VisibleResult<any> = [[], [0, 0], [0, 0], false];
const NO_FOCUS: FocalItem = { i: -1, y: -1 };

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
  if (
    !isUpwardUpdateRequired(
      items,
      imin,
      pmin,
      pmax,
      topOffset,
      topExtent,
      force
    )
  ) {
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
  if (
    !isDownwardUpdateRequired(items, imax, pmin, pmax, topOffset, topExtent)
  ) {
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

export { getHeight, getItemAtY, getVisible, NO_FOCUS };
export type {
  NumericRange,
  VirtualListProps,
  ListItemRenderer,
  ListItemProps,
  IVirtualListItem,
  VisibleItem,
  FocalItem
};
