/// <reference types="react" />
import { Popover } from "../Popover/Popover";
type TooltipProps = React.PropsWithChildren & {
    text: string;
    id?: string;
    as?: keyof JSX.IntrinsicElements;
};
declare const isOver: (e: MouseEvent & {
    toElement?: HTMLElement;
}, popover: HTMLElement | null) => boolean;
export { Popover, isOver };
export type { TooltipProps };
