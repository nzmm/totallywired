import { Link1Icon, LinkNone1Icon } from "@radix-ui/react-icons";
import {
  EditorInputEventHandler,
  TrackChangeRequest,
} from "../../../lib/editor/types";
import { MBMedia } from "../../../lib/musicbrainz/types";
import { displayLength } from "../../../lib/utils";
import { changeClassName } from "../../../lib/editor/helpers";
import MetadataSelector from "./MetadataSelector";
import ApproveChangeTool from "./ApproveChangeTool";
import "./TrackTable.css";

type TrackTable = {
  tracks: TrackChangeRequest[];
  version: "oldValue" | "newValue";
  candidateMedia?: MBMedia[];
  readOnly?: boolean;
  onChange?: EditorInputEventHandler;
  onApprove?: EditorInputEventHandler;
};

export default function TrackTable({
  tracks,
  version,
  readOnly,
  candidateMedia = [],
  onChange,
  onApprove,
}: TrackTable) {
  return (
    <table className="track metadata-table">
      <caption>Tracks ({tracks.length})</caption>

      <thead>
        <tr className="sr-only">
          <th scope="column">Media position</th>
          <th scope="column">Track number</th>
          <th scope="column" colSpan={2}>
            Track name
          </th>
          <th scope="column">Track duration (h:m:s)</th>
          <th scope="column"></th>
        </tr>
      </thead>

      <tbody>
        {tracks.map((cr, i) => {
          const id = cr.id;
          return (
            <tr key={id}>
              <td className={`disc ${changeClassName(cr.disc, readOnly)}`}>
                <input
                  type="number"
                  min={0}
                  step={1}
                  name={`disc[${i}]`}
                  value={cr.disc[version]}
                  autoComplete="off"
                  autoCorrect="off"
                  data-tid={id}
                  data-key="disc"
                  readOnly={readOnly}
                  onInput={onChange}
                />
              </td>
              <td className={`num ${changeClassName(cr.number, readOnly)}`}>
                <input
                  type="number"
                  min={0}
                  step={1}
                  name={`number[${i}]`}
                  value={cr.number[version]}
                  autoComplete="off"
                  autoCorrect="off"
                  data-tid={id}
                  data-key="number"
                  readOnly={readOnly}
                  onInput={onChange}
                />
              </td>
              <td className={`name ${changeClassName(cr.name, readOnly)}`}>
                <input
                  type="text"
                  name={`name[${i}]`}
                  title={cr.name[version]}
                  value={cr.name[version]}
                  autoComplete="off"
                  autoCorrect="off"
                  data-tid={id}
                  data-key="name"
                  readOnly={readOnly}
                  onInput={onChange}
                />
              </td>
              <td>
                {readOnly ? null : (
                  <>
                    <MetadataSelector cr={cr} candidateMedia={candidateMedia}>
                      <button
                        className={`picker-tool${cr.mbid ? " matched" : ""}`}
                      >
                        {cr.mbid ? <Link1Icon /> : <LinkNone1Icon />}
                      </button>
                    </MetadataSelector>
                  </>
                )}
              </td>
              <td className="len">
                <input
                  type="text"
                  name={`len[${i}]`}
                  value={
                    readOnly ? cr.track.displayLength : displayLength(cr.length)
                  }
                  autoComplete="off"
                  readOnly
                />
              </td>
              <td>
                {readOnly ? null : (
                  <ApproveChangeTool
                    cr={cr}
                    id={`approve[${i}]`}
                    dataKey={id}
                    readOnly={readOnly}
                    onChange={onApprove}
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
