import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FocalItem,
  IVirtualListItem,
  ListItemProps,
  ListItemRenderer,
  NO_FOCUS,
  NumericRange,
  VirtualListProps,
  VisibleItem,
  getHeight,
  getItemAtY,
  getVisible,
} from "./VirtualList.library";
import "./VirtualList.scss";
import { useScrollRestoration } from "./ScrollRestoration";

/**
 * A list component which renders only the visible items.
 */
const VirtualList = <T extends IVirtualListItem>({
  items,
  renderer: ItemRenderer,
  xOverflow = "auto",
  yOverflow = "auto",
  className,
  onClick,
  onDoubleClick,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: VirtualListProps<T>) => {
  const restoration = useScrollRestoration();
  const [initialYOffset] = useState(() => restoration.get(location.pathname));

  const scrollTop = useRef(0);
  const pending = useRef(false);
  const vlist = useRef<HTMLDivElement>(null);
  const indexRange = useRef<NumericRange>([0, 0]);
  const pixelRange = useRef<NumericRange>([0, 0]);
  const focalItem = useRef<FocalItem>(NO_FOCUS);

  const [height, setHeight] = useState(0);
  const [visible, setVisible] = useState<VisibleItem<T>[]>([]);

  // Update height
  useLayoutEffect(() => {
    if (!vlist.current) {
      return;
    }

    const h = getHeight(items);
    setHeight(h);
  }, [items, setHeight]);

  // Scroll restoration
  useLayoutEffect(() => {
    const key = location.pathname;

    if (vlist.current && initialYOffset && height) {
      vlist.current.scrollTo(0, initialYOffset);
      restoration.complete(key);
    }

    return () => {
      restoration.add(key, scrollTop.current);
    };
  }, [restoration, initialYOffset, height]);

  // Wire up signal handlers
  useEffect(() => {
    if (!vlist.current) {
      return;
    }

    const processScroll = () => {
      if (!vlist.current) {
        return;
      }

      const top = vlist.current.scrollTop;
      const [vis, ir, pr, update] = getVisible(
        items,
        indexRange.current,
        pixelRange.current,
        top,
        top - scrollTop.current,
        vlist.current.clientHeight,
        focalItem.current,
        500, // overscan pixels
      );

      if (update) {
        indexRange.current = ir;
        pixelRange.current = pr;
        setVisible(vis);
      }

      scrollTop.current = top;
      pending.current = false;
    };

    const handleScroll = () => {
      if (pending.current) {
        return;
      }

      scrollTop.current = vlist.current?.scrollTop ?? 0;

      pending.current = true;
      window.requestAnimationFrame(processScroll);
    };

    const handleResize = () => {
      if (!vlist.current) {
        return;
      }

      scrollTop.current = vlist.current.scrollTop;
      indexRange.current = [0, items.length];
      pixelRange.current = [0, height];

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
  }, [height, items, setVisible]);

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!vlist.current || e.target.nodeName !== "LI") {
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

  const handleClick = onClick
    ? (e: React.MouseEvent<HTMLElement>) => {
        if (!vlist.current) {
          return;
        }

        const item = getItemAtY(vlist.current, visible, e.clientY);
        if (item) {
          onClick(e, item);
        }
      }
    : undefined;

  const handleDoubleClick = onDoubleClick
    ? (e: React.MouseEvent<HTMLElement>) => {
        if (!vlist.current) {
          return;
        }

        const item = getItemAtY(vlist.current, visible, e.clientY);
        if (item) {
          onDoubleClick(e, item);
        }
      }
    : undefined;

  const handleDragStart = onDragStart
    ? (e: React.DragEvent<HTMLElement>) => {
        if (!vlist.current) {
          return;
        }
        const item = getItemAtY(vlist.current, visible, e.clientY);
        if (item) {
          onDragStart(e, item);
        }
      }
    : undefined;

  const handleDragOver = onDragOver
    ? (e: React.DragEvent<HTMLElement>) => {
        if (!vlist.current) {
          return;
        }
        const item = getItemAtY(vlist.current, visible, e.clientY);
        if (item) {
          onDragOver(e, item);
        }
      }
    : undefined;

  const handleDragEnd = onDragEnd
    ? (e: React.DragEvent<HTMLElement>) => {
        if (!vlist.current) {
          return;
        }
        const item = getItemAtY(vlist.current, visible, e.clientY);
        if (item) {
          onDragEnd(e, item);
        }
      }
    : undefined;

  const handleDrop = onDrop
    ? (e: React.DragEvent<HTMLElement>) => {
        if (!vlist.current) {
          return;
        }
        const item = getItemAtY(vlist.current, visible, e.clientY);
        if (item) {
          onDrop(e, item);
        }
      }
    : undefined;

  return (
    <div
      className={`vlist x-${xOverflow} y-${yOverflow}${
        className ? ` ${className}` : ""
      }`}
      ref={vlist}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
    >
      <ol style={{ height }}>
        {visible.map((v) => (
          <ItemRenderer
            {...v.data}
            index={v.i}
            top={v.y}
            height={v.data.height}
            key={v.data.key ?? v.i}
          />
        ))}
      </ol>
    </div>
  );
};

export { VirtualList };
export type {
  ListItemRenderer,
  ListItemProps,
  VirtualListProps,
  VisibleItem,
  IVirtualListItem,
};
