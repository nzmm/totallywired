import { MBTrack } from "../../lib/musicbrainz/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../vendor/radix-ui/Popover";
import "./TrackPickerPopover.css";

type TrackPickerPopover = React.PropsWithChildren & {
  candidateTracks?: MBTrack[];
};

export default function TrackPickerPopover({
  children,
  candidateTracks = [],
}: TrackPickerPopover) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={-3}>
        <div className="track-picker-content">
          {candidateTracks.map((t) => {
            return (
              <button key={t.id}>
                {t.position}. {t.title}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
