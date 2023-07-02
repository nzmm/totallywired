import React, { useEffect, useRef, useState } from "react";
import {
  IVirtualListItem,
  NumericRange,
  ListItemRenderer,
  VisibleItem,
  VirtualListItemProps,
  VirtualListProps,
  getHeight,
  getVisible,
  getItemAtY,
  FocalItem,
  NO_FOCUS
} from "./VirtualList.library";

import "./VirtualList.scss";

const VirtualListItem = ({
  top,
  height,
  children
}: VirtualListItemProps) => {
  return (
    <li tabIndex={0} style={{ top, height }}>
      {children}
    </li>
  );
};

/**
 * A list component which renders only the visible items.
 */
const VirtualList = <T extends IVirtualListItem>({
  items,
  renderer: ItemRenderer,
  xOverflow = "auto",
  yOverflow = "auto",
  onDoubleClick,
  onClick
}: VirtualListProps<T>) => {
  const vlist = useRef<HTMLDivElement>(null);
  const scrollTop = useRef<number>(0);
  const indexRange = useRef<NumericRange>([0, 0]);
  const pixelRange = useRef<NumericRange>([0, 0]);
  const focalItem = useRef<FocalItem>(NO_FOCUS);

  const [height, setHeight] = useState<number>(0);
  const [visible, setVisible] = useState<VisibleItem<T>[]>([]);

  useEffect(() => {
    if (!vlist.current) {
      return;
    }

    const handleScroll = () => {
      if (!vlist.current) {
        return;
      }

      const [vis, ir, pr, update] = getVisible(
        items,
        indexRange.current,
        pixelRange.current,
        vlist.current.scrollTop,
        vlist.current.scrollTop - scrollTop.current,
        vlist.current.clientHeight,
        focalItem.current
      );

      if (update) {
        indexRange.current = ir;
        pixelRange.current = pr;
        setVisible(vis);
      }

      scrollTop.current = vlist.current.scrollTop;
    };

    const handleResize = () => {
      if (!vlist.current) {
        return;
      }

      const h = getHeight(items);
      setHeight(h);

      scrollTop.current = vlist.current.scrollTop;
      indexRange.current = [0, items.length];
      pixelRange.current = [0, h];

      handleScroll();
    };

    handleResize();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          handleResize();
        }
      }
    });

    vlist.current.addEventListener("scroll", handleScroll);
    observer.observe(vlist.current);

    return () => {
      if (!vlist.current) {
        return;
      }

      vlist.current.removeEventListener("scroll", handleScroll);
      observer.unobserve(vlist.current);
    };
  }, [items]);

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!vlist.current || e.target.nodeName !== 'LI') {
      return;
    }

    const { y } = e.target.getBoundingClientRect();
    const item = getItemAtY(vlist.current, visible, y);    
    if (item) {
      focalItem.current = { i: item.i, y: item.y };
    }

    /*
      const [imin, imax] = indexRange.current;

      if (i >= imax - 1) {
        vlist.current.scrollBy(0, items[imax].height);
      } else if (i <= imin + 1) {
        vlist.current.scrollBy(0, -items[imin].height);
      }
      */
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (e.target.nodeName === "LI") {
      focalItem.current = NO_FOCUS;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onClick || !vlist.current) {
      return;
    }

    const item = getItemAtY(vlist.current, visible, e.clientY);    
    if (item) {
      onClick(e, item);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onDoubleClick || !vlist.current) {
      return;
    }

    const item = getItemAtY(vlist.current, visible, e.clientY);    
    if (item) {
      onDoubleClick(e, item);
    }
  };

  return (
    <div
      className={`vlist x-${xOverflow} y-${yOverflow}`}
      ref={vlist}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <ol style={{ height }}>
        {visible.map((v) => (
          <VirtualListItem
            key={v.i}
            top={v.y}
            height={v.data.height}
          >
            <ItemRenderer {...v.data} />
          </VirtualListItem>
        ))}
      </ol>
    </div>
  );
};

export { VirtualList };
export type { ListItemRenderer, VirtualListProps, VirtualListItemProps, VisibleItem };
