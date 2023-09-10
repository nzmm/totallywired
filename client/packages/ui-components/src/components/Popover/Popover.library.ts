import React, {
  CSSProperties,
  ForwardedRef,
  MutableRefObject,
  useMemo,
} from "react";

type PathResult = [string, CSSProperties];

type Orientaion = "north" | "south" | "east" | "west" | "southwest";

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

const refs = (...refs: Refs[]) => {
  return (el: HTMLElement | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      ref instanceof Function ? ref(el) : (ref.current = el);
    }
  };
};

const CLEAN_STRING_REGEX = /[\r\n]+|^\s+|\s+$|(\s)\s+/gm;

/**
 * Removes extraneous whitespace and newlines from a string.
 */
const compress = (s: string) => {
  return s.length > 2000 ? s : s.replace(CLEAN_STRING_REGEX, "$1");
};

const getPositionStyle = (
  el: HTMLElement,
  orientation: Orientaion,
  width: number,
  height: number,
  offset: number,
  gap = 0
) => {
  switch (orientation) {
    case "north":
    default:
      return {
        left: el.offsetLeft + (offset + el.offsetWidth - width) / 2,
        top: el.offsetTop - height + offset - gap,
      };
    case "south":
      return {
        left: el.offsetLeft + (offset + el.offsetWidth - width) / 2,
        top: el.offsetTop + el.offsetHeight - offset + gap,
      };
    case "southwest":
      return {
        left: el.offsetLeft + offset + el.offsetWidth - width,
        top: el.offsetTop + el.offsetHeight - offset + gap,
      };
  }
};

/**
 * Returns memoised svg path and margin styles
 */
const getPath = (
  orientation: Orientaion,
  m: number,
  x: number,
  y: number,
  w: number,
  h: number,
  br: number,
  aw: number,
  ah: number,
  ao: number,
  po = 0.5
): PathResult => {
  return useMemo(() => {
    switch (orientation) {
      case "north":
      default:
        return [
          compress(`
            M${x + po} ${y + br}
            Q${x + po} ${y + po} ${br + x} ${po + y}
            H${w - br - po}
            Q${w - po} ${y + po} ${w - po} ${y + br}
            V${h - br - ah - po}
            Q${w - po} ${h - ah - po} ${w - br - po} ${h - ah - po}
            H${(w + x) * ao + aw / 2 - po}
            L${(w + x) * ao} ${h - po}
            L${(w + x) * ao - aw / 2 + po} ${h - ah - po}
            H${x + br + po}
            Q${x + po} ${h - ah - po} ${x + po} ${h - ah - br - po}
            Z`),
          {
            marginBottom: ah + m + x,
            marginTop: m + x,
            marginLeft: m + x,
            marginRight: m + x,
          },
        ];
      case "south":
      case "southwest":
        return [
          compress(`
            M${x + po} ${y + br + ah + po}
            Q${x + po} ${y + ah + po} ${br + x} ${y + ah + po}
            H${(w + x) * ao - aw / 2 + po}
            L${(w + x) * ao} ${ah + po}
            L${(w + x) * ao + aw / 2} ${y + ah + po}
            H${w - br - po}
            Q${w - po} ${y + ah + po} ${w - po} ${y + ah + br}
            V${h - br - po}
            Q${w - po} ${h - po} ${w - br - po} ${h - po}
            H${x + br + po}
            Q${x + po} ${h - po} ${x + po} ${h - br - po}
            Z`),
          {
            marginTop: ah + m + x,
            marginBottom: m + x,
            marginLeft: m + x,
            marginRight: m + x,
          },
        ];
    }
  }, [orientation, m, x, y, w, h, br, aw, ah, po]);
};

export { refs, getPath, getPositionStyle };
export type { PopoverProps };
