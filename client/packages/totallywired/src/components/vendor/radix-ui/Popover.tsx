import React, { forwardRef } from "react";
import * as RPopover from "@radix-ui/react-popover";
import "./Popover.css";

type PopoverContentProps = React.PropsWithChildren & {
  sideOffset?: number;
};

const Arrow = forwardRef<SVGSVGElement, RPopover.PopoverArrowProps>(
  (props, ref) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...props} ref={ref}>
        <path
          d="M0 0 L 15 10 L 30 0 "
          stroke="black"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
);

export function Popover({ children }: React.PropsWithChildren) {
  return <RPopover.Root>{children}</RPopover.Root>;
}

export const PopoverTrigger = RPopover.Trigger;

export const PopoverContent = ({
  children,
  sideOffset,
}: PopoverContentProps) => {
  return (
    <RPopover.Portal>
      <RPopover.Content className="PopoverContent" sideOffset={sideOffset ?? 5}>
        {children}
        <RPopover.Arrow asChild className="PopoverArrow">
          <Arrow />
        </RPopover.Arrow>
      </RPopover.Content>
    </RPopover.Portal>
  );
};
