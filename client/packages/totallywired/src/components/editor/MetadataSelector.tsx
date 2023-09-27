import { MBTrack } from "../../lib/musicbrainz/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../vendor/radix-ui/Popover";
import "./MetadataSelector.css";

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
        <div className="metadata-selector-content">
          <h5>Tracks</h5>
          {candidateTracks.map((t) => {
            return (
              <button key={t.id}>
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
