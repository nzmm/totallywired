import {
  AlbumChangeProposal,
  EditorInputEventHandler,
} from "../../lib/editor/types";
import { DEFAULT_COVERART_URL } from "../../lib/musicbrainz/consts";
import { Thumbnail } from "../display/Thumbnail";
import ApproveChangeTool from "./ApproveChangeTool";
import "./ArtTable.css";

type ArtTableProps = {
  proposal: AlbumChangeProposal;
  label: string;
  version: "oldValue" | "newValue";
  readOnly?: boolean;
  onChange?: EditorInputEventHandler;
  onApprove?: EditorInputEventHandler;
};

export default function ArtTable({
  proposal,
  label,
  version,
  readOnly,
  //onChange,
  onApprove,
}: ArtTableProps) {
  const { coverArt } = proposal;
  const src = coverArt[version] ? coverArt[version] : DEFAULT_COVERART_URL;
  return (
    <table className="cover-art metadata-table">
      <caption>Cover art</caption>

      <thead>
        <tr className="sr-only">
          <th scope="col" colSpan={2}>
            Image
          </th>
          <th scope="col">Tools</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            <Thumbnail src={src} alt={label} className="large-release-art" />
          </td>
          <td></td>
          <td>
            {readOnly ? null : (
              <ApproveChangeTool
                id={coverArt.key}
                cr={coverArt}
                key={coverArt.key}
                dataKey={coverArt.key}
                onChange={onApprove}
              />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
