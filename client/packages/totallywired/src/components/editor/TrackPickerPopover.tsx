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
          <h5>Tracks</h5>
          {candidateTracks.map((t) => {
            return (
              <button>
                <span className="num">{t.number}.</span>
                <span className="name">{t.title}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
