import { MouseEventHandler } from "react";
import { Link1Icon } from "@radix-ui/react-icons";
import { useEditorDisptach } from "../../lib/editor/hooks";
import { MBMedia } from "../../lib/musicbrainz/types";
import { updateTrackFull } from "../../lib/editor/actions";
import { displayLength } from "../../lib/utils";
import { TrackChangeRequest } from "../../lib/editor/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../vendor/radix-ui/Popover";
import "./MetadataSelector.css";

type TrackPickerPopover = React.PropsWithChildren & {
  cr: TrackChangeRequest;
  candidateMedia: MBMedia[];
};

type HTMLButtonWithTrackDataset = HTMLElementWithDataset<
  "disc" | "number" | "name" | "length",
  HTMLButtonElement
>;

export default function MetadataSelector({
  cr,
  children,
  candidateMedia = [],
}: TrackPickerPopover) {
  const dispatch = useEditorDisptach();

  const onClick: MouseEventHandler<HTMLButtonWithTrackDataset> = (e) => {
    const { value: mbid, dataset } = e.currentTarget;
    dispatch(updateTrackFull(cr.id, mbid, dataset));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={-3}>
        <div className="metadata-selector-content">
          <h5>Tracks</h5>

          {candidateMedia.map((m) => {
            return (
              <div className="media" key={m.position}>
                {m.tracks.map((t) => {
                  const matched = cr.mbid === t.id;
                  return (
                    <button
                      key={t.id}
                      value={t.id}
                      data-disc={m.position}
                      data-number={t.number}
                      data-name={t.title}
                      data-length={t.length}
                      className={matched ? "matched" : ""}
                      onClick={onClick}
                    >
                      <span className="num">{t.position}</span>
                      <span className="name">
                        {t.title}
                        {matched ? <Link1Icon className="matched" /> : null}
                      </span>
                      <span className="len">{displayLength(t.length)}</span>
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
