import { Popover } from "../Popover/Popover";

type TooltipProps = React.PropsWithChildren & {
  text: string;
  id?: string;
  as?: keyof JSX.IntrinsicElements;
};

const isOver = (
  e: MouseEvent & { toElement?: HTMLElement },
  popover: HTMLElement | null
) =>
  e.type === "mouseenter" ||
  (!!e.toElement &&
    (e.toElement === popover || (popover?.contains(e.toElement) ?? false)));

export { Popover, isOver };
export type { TooltipProps };
