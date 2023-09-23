import { Album } from "../../lib/types";
import AcceptChangeTool from "./AcceptChangeTool";
import "./ReleaseTable.css";

type ReleaseTableProps = {
  release: Album;
  readOnly?: boolean;
};

export default function ReleaseTable({ release, readOnly }: ReleaseTableProps) {
  return (
    <table className="release-table">
      <caption>Release</caption>

      <tr className="sr-only">
        <td></td>
        <th scope="col">Value</th>
        <th scope="col">Tools</th>
      </tr>

      <tr>
        <th scope="row" className="sr-only">
          Release name
        </th>
        <td>
          <input
            type="text"
            value={release.name}
            readOnly
            placeholder="Release name"
          />
        </td>
        <td>
          <AcceptChangeTool oldValue={release.name} readOnly={readOnly} />
        </td>
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
        <td>
          <AcceptChangeTool oldValue={release.artistName} readOnly={readOnly} />
        </td>
      </tr>
      <tr>
        <th scope="row" className="sr-only">
          Release year
        </th>
        <td>
          <input type="text" value={release.year} placeholder="Year" readOnly />
        </td>
        <td>
          <AcceptChangeTool oldValue={release.year} readOnly={readOnly} />
        </td>
      </tr>
      <tr>
        <th scope="row" className="sr-only">
          Record label
        </th>
        <td>
          <input type="text" value="" placeholder="Record label" readOnly />
        </td>
        <td>
          <AcceptChangeTool oldValue="" readOnly={readOnly} />
        </td>
      </tr>
      <tr>
        <th scope="row" className="sr-only">
          Country
        </th>
        <td>
          <input type="text" value="" placeholder="Country" readOnly />
        </td>
        <td>
          <AcceptChangeTool oldValue="" readOnly={readOnly} />
        </td>
      </tr>
    </table>
  );
}
