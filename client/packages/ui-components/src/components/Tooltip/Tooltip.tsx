import React, { useEffect, useRef, useState } from "react";
import { Popover, TooltipProps, isOver } from "./Tooltip.library";

const Tooltip = ({ id, text, children, as = "span" }: TooltipProps) => {
  const popover = useRef<HTMLDivElement>(null);
  const subject = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  const Wrapper: any = as ?? "span";

  useEffect(() => {
    if (!subject?.current) {
      return;
    }

    const handleHover = (e: MouseEvent) => {
      const over = isOver(e, popover.current);
      setShow(over);
    };

    subject.current.addEventListener("mouseenter", handleHover);
    subject.current.addEventListener("mouseleave", handleHover);
    popover.current?.addEventListener("mouseleave", handleHover);

    return () => {
      subject.current?.removeEventListener("mouseenter", handleHover);
      subject.current?.removeEventListener("mouseleave", handleHover);
      popover.current?.removeEventListener("mouseleave", handleHover);
    };
  }, [show]);

  return (
    <>
      <Popover
        id={id}
        className="tooltip"
        show={show}
        subject={subject}
        ref={popover}
      >
        {text}
      </Popover>
      <Wrapper ref={subject} aria-describedby={id}>
        {children}
      </Wrapper>
    </>
  );
};

export { Tooltip };
export type { TooltipProps };
