import { Track } from "../../lib/types";
import AcceptChangeTool from "./AcceptChangeTool";
import "./TrackTable.css";

type TrackTable = {
  tracks: Track[];
  readOnly?: boolean;
};

export default function TrackTable({ tracks, readOnly }: TrackTable) {
  return (
    <table className="track-table">
      <caption>Tracks</caption>

      <tr className="sr-only">
        <th scope="column">Track number</th>
        <th scope="column">Track name</th>
        <th scope="column">Track duration (h:m:s)</th>
      </tr>

      {tracks.map((t) => {
        return (
          <tr key={t.id}>
            <td className="num">
              <input type="text" value={t.number} readOnly />
            </td>
            <td className="name">
              <input type="text" value={t.name} readOnly />
            </td>
            <td className="len">
              <input type="text" value={t.displayLength} readOnly />
            </td>
            <td>
              <AcceptChangeTool oldValue={t.name} readOnly={readOnly} />
            </td>
          </tr>
        );
      })}
    </table>
  );
}
