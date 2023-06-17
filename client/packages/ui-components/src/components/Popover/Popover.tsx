import React, { forwardRef, useLayoutEffect, useRef, useState } from "react";

import {
  PopoverProps,
  refs,
  getPath,
  getPositionStyle
} from "./Popover.library";

import "./Popover.scss";

const Popover = forwardRef<HTMLElement, PopoverProps>(
  (
    {
      show = false,
      orientation = "north",
      borderRadius = 6,
      arrowWidth = 20,
      arrowHeight = 10,
      arrowOffset = 0.5,
      margin = 15,
      offset = 8,
      id,
      subject,
      children,
      className
    },
    ref
  ) => {
    const popover = useRef<HTMLDivElement | null>(null);
    const [svgRect, setSvgRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));
    const [position, setPosition] = useState<React.CSSProperties>({});

    const { width, height } = svgRect;

    useLayoutEffect(() => {
      if (!show || !popover.current) {
        return;
      }

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            setSvgRect(entry.contentRect);
          }
        }
      });

      setSvgRect(popover.current.getBoundingClientRect());
      observer.observe(popover.current);

      return () => {
        if (!popover.current) return;
        observer.unobserve(popover.current);
      };
    }, [show]);

    useLayoutEffect(() => {
      if (!show || !subject?.current) {
        return;
      }

      const handleReposition = () => {
        const el = subject.current as HTMLElement;
        const position = getPositionStyle(
          el,
          orientation,
          width,
          height,
          offset
        );
        setPosition(position);
      };

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            handleReposition();
          }
        }
      });

      handleReposition();
      observer.observe(subject.current);
      observer.observe(document.body);

      return () => {
        if (!subject.current) return;
        observer.unobserve(subject.current);
        observer.unobserve(document.body);
      };
    }, [show, subject, orientation, width, height]);

    const [d, contentStyle] = getPath(
      orientation,
      margin,
      offset,
      offset,
      width - offset,
      height - offset,
      borderRadius,
      arrowWidth,
      arrowHeight,
      arrowOffset
    );

    return (
      <div
        id={id}
        ref={refs(ref, popover)}
        className={`popover ${className || ""} ${
          subject?.current ? "anchored" : ""
        }`}
        style={position}
      >
        {show ? (
          <>
            <svg viewBox={`0 0 ${width} ${height}`}>
              <path d={d} />
            </svg>
            <div className="content" role="tooltip" style={contentStyle}>
              {children}
            </div>
          </>
        ) : null}
      </div>
    );
  }
);

export { Popover };
export type { PopoverProps }