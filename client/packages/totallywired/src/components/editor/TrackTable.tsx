import { TrackChangeRequest } from "../../lib/editor/types";
import { MBTrack } from "../../lib/musicbrainz/types";
import { Track } from "../../lib/types";
import ApproveChangeTool from "./ApproveChangeTool";
import "./MetadataTable.css";
import "./TrackTable.css";

type TrackTable = {
  currentTracks: Track[];
  proposedTracks?: TrackChangeRequest[];
  candidateTracks?: MBTrack[];
  readOnly?: boolean;
};

export default function TrackTable({
  currentTracks,
  proposedTracks,
  candidateTracks = [],
  readOnly,
}: TrackTable) {
  return (
    <table className="track metadata-table">
      <caption>Tracks</caption>

      <thead>
        <tr className="sr-only">
          <th scope="column">Track number</th>
          <th scope="column">Track name</th>
          <th scope="column">Track duration (h:m:s)</th>
        </tr>
      </thead>

      <tbody>
        {currentTracks.map((cur, i) => {
          const id = cur.id;
          const prop = proposedTracks?.[i];
          return (
            <tr key={id}>
              <td className="num">
                <input
                  type="text"
                  name={`number-${id}`}
                  value={prop?.number ?? cur.number}
                  autoComplete="off"
                  autoCorrect="off"
                  readOnly={readOnly}
                />
              </td>
              <td className="name">
                <input
                  type="text"
                  name={`name-${id}`}
                  value={prop?.name ?? cur.name}
                  autoComplete="off"
                  autoCorrect="off"
                  readOnly={readOnly}
                />
              </td>
              <td className="len">
                <input
                  type="text"
                  name={`len-${id}`}
                  value={cur.displayLength}
                  autoComplete="off"
                  readOnly
                />
              </td>
              <td>
                <ApproveChangeTool
                  name={`accept-${id}`}
                  approval={prop}
                  readOnly={readOnly}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
