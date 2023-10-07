import { Fragment, MouseEventHandler } from "react";
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
  HTMLTableRowElement
>;

export default function MetadataSelector({
  cr,
  children,
  candidateMedia = [],
}: TrackPickerPopover) {
  const dispatch = useEditorDisptach();

  const onClick: MouseEventHandler<HTMLButtonWithTrackDataset> = (e) => {
    const { id: mbid, dataset } = e.currentTarget;
    dispatch(updateTrackFull(cr.id, mbid, dataset));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={-3}>
        <div className="metadata-selector-content">
          <table>
            <caption className="sr-only">Matched Tracks</caption>

            <tbody>
              {candidateMedia.map((m) => {
                return (
                  <Fragment key={m.position}>
                    <tr className="media">
                      <th colSpan={3}>Set {m.position}</th>
                    </tr>

                    {m.tracks.map((t) => {
                      const matched = cr.mbid === t.id;
                      return (
                        <tr
                          tabIndex={0}
                          key={t.id}
                          id={t.id}
                          data-disc={m.position}
                          data-number={t.position}
                          data-name={t.title}
                          data-length={t.length}
                          className={matched ? "selector active" : "selector"}
                          onClick={onClick}
                        >
                          <td className="num">{t.position}</td>
                          <td className="name">{t.title}</td>
                          <td className="len">{displayLength(t.length)}</td>
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </PopoverContent>
    </Popover>
  );
}
