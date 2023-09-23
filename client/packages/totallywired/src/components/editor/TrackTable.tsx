import { Track } from "../../lib/types";
import "./TrackTable.css";

type TrackTable = {
  tracks: Track[];
};

export default function TrackTable({ tracks }: TrackTable) {
  return (
    <table className="track-table">
      <caption>Tracks</caption>
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
            <td></td>
          </tr>
        );
      })}
    </table>
  );
}
