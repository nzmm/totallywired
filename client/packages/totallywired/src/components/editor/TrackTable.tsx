import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  EditorInputEventHandler,
  TrackChangeRequest,
} from "../../lib/editor/types";
import { MBTrack } from "../../lib/musicbrainz/types";
import TrackPickerPopover from "./TrackPickerPopover";
import ApproveChangeTool from "./ApproveChangeTool";
import "./TrackTable.css";

type TrackTable = {
  tracks: TrackChangeRequest[];
  version: "oldValue" | "newValue";
  candidateTracks?: MBTrack[];
  readOnly?: boolean;
  onChange?: EditorInputEventHandler;
  onApprove?: EditorInputEventHandler;
};

export default function TrackTable({
  tracks,
  version,
  candidateTracks,
  readOnly,
  onChange,
  onApprove,
}: TrackTable) {
  return (
    <table className="track metadata-table">
      <caption>Tracks</caption>

      <thead>
        <tr className="sr-only">
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
              <td className="num">
                <input
                  type="text"
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
              <td className="name">
                <input
                  type="text"
                  name={`name[${i}]`}
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
                  <TrackPickerPopover candidateTracks={candidateTracks}>
                    <button className="picker-tool">
                      <DotsHorizontalIcon />
                    </button>
                  </TrackPickerPopover>
                )}
              </td>
              <td className="len">
                <input
                  type="text"
                  name={`len[${i}]`}
                  value={cr.track.displayLength}
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
