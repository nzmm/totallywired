import { ChangeEvent } from "react";
import { TrackChangeRequest } from "../../lib/editor/types";
import { MBTrack } from "../../lib/musicbrainz/types";
import { Track } from "../../lib/types";
import { updateTrackProposal } from "../../lib/editor/actions";
import { editorDisptach } from "../../providers/EditorProvider";
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
  const dispatch = editorDisptach();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const [key, id] = name.split(":", 2);
    dispatch(updateTrackProposal(id, key as keyof TrackChangeRequest, value));
  };

  const onApprove = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.currentTarget;
    const [, trackId] = id.split(":", 2);
    dispatch(updateTrackProposal(trackId, "approved", checked));
  };

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
                  name={`number:${id}`}
                  value={prop?.number ?? cur.number}
                  autoComplete="off"
                  autoCorrect="off"
                  readOnly={readOnly}
                  onInput={onChange}
                />
              </td>
              <td className="name">
                <input
                  type="text"
                  name={`name:${id}`}
                  value={prop?.name ?? cur.name}
                  autoComplete="off"
                  autoCorrect="off"
                  readOnly={readOnly}
                  onInput={onChange}
                />
              </td>
              <td className="len">
                <input
                  type="text"
                  name={`len:${id}`}
                  value={cur.displayLength}
                  autoComplete="off"
                  readOnly
                />
              </td>
              <td>
                <ApproveChangeTool
                  name={`approve:${id}`}
                  approval={prop}
                  onChange={onApprove}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
