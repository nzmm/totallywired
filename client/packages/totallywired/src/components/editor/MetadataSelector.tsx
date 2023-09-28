import { MBMedia } from "../../lib/musicbrainz/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../vendor/radix-ui/Popover";
import "./MetadataSelector.css";

type TrackPickerPopover = React.PropsWithChildren & {
  candidateMedia: MBMedia[];
};

export default function TrackPickerPopover({
  children,
  candidateMedia = [],
}: TrackPickerPopover) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={-3}>
        <div className="metadata-selector-content">
          <h5>Tracks</h5>
          {candidateMedia.map((m) => {
            return (
              <div key={m.position}>
                <p>{m.title || `Disc ${m.position}`}</p>
                {m.tracks.map((t) => {
                  return (
                    <button key={t.id}>
                      <span className="num">{t.number}.</span>
                      <span className="name">{t.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
