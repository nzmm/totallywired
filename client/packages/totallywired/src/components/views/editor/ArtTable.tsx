import { MouseEventHandler } from "react";
import {
  AlbumChangeProposal,
  EditorInputEventHandler,
} from "../../../lib/editor/types";
import { Thumbnail } from "../../common/Thumbnail";
import ApproveChangeTool from "./ApproveChangeTool";
import ArtSelector from "./ArtSelector";
import "./ArtTable.css";

type ArtTableProps = {
  proposal: AlbumChangeProposal;
  artCollection: Record<string, string>;
  label: string;
  version: "oldValue" | "newValue";
  readOnly?: boolean;
  onSelect?: MouseEventHandler;
  onApprove?: EditorInputEventHandler;
};

export default function ArtTable({
  proposal,
  artCollection,
  label,
  version,
  readOnly,
  onSelect,
  onApprove,
}: ArtTableProps) {
  const { coverArt } = proposal;
  const src = coverArt[version]
    ? coverArt[version]
    : `/api/v1/releases/${proposal.id}/art`;
  return (
    <table className="cover-art metadata-table">
      <caption>Cover art</caption>

      <thead>
        <tr className="sr-only">
          <th scope="col">Cover art</th>
          <th scope="col">Art selector</th>
          <th scope="col">Tools</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            <Thumbnail src={src} alt={label} className="large-release-art" />
          </td>
          <td>
            {readOnly ? null : (
              <ArtSelector
                mbid={proposal.mbid}
                coverArt={coverArt}
                artCollection={artCollection}
                onSelect={onSelect}
              />
            )}
          </td>
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
