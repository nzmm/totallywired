import { Album } from "../../lib/types";
import "./ReleaseTable.css";

type ReleaseTableProps = {
  release: Album;
};

export default function ReleaseTable({ release }: ReleaseTableProps) {
  return (
    <table className="release-table">
      <caption>Release</caption>

      <tr className="sr-only">
        <td></td>
        <th scope="col">Value</th>
        <th scope="col">Actions</th>
      </tr>

      <tr>
        <th scope="row" className="sr-only">
          Release name
        </th>
        <td>
          <input type="text" value={release.name} readOnly />
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row" className="sr-only">
          Artist name
        </th>
        <td>
          <input
            type="text"
            value={release.artistName}
            placeholder="Artist name"
            readOnly
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row" className="sr-only">
          Release year
        </th>
        <td>
          <input type="text" value={release.year} placeholder="Year" readOnly />
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row" className="sr-only">
          Record label
        </th>
        <td>
          <input type="text" value="" placeholder="Record label" readOnly />
        </td>
        <td></td>
      </tr>
      <tr>
        <th scope="row" className="sr-only">
          Country
        </th>
        <td>
          <input type="text" value="" placeholder="Country" readOnly />
        </td>
        <td></td>
      </tr>
    </table>
  );
}
