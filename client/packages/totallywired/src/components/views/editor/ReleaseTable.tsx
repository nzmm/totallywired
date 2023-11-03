import { ChangeEvent } from "react";
import { changeClassName } from "../../../lib/editor/helpers";
import {
  AlbumChangeProposal,
  AttributeChangeRequest,
  EditorInputEventHandler,
} from "../../../lib/editor/types";
import ApproveChangeTool from "./ApproveChangeTool";

type ReleaseTableProps = {
  proposal: AlbumChangeProposal;
  version: "oldValue" | "newValue";
  readOnly?: boolean;
  onChange?: EditorInputEventHandler;
  onApprove?: EditorInputEventHandler;
};

type ReleaseRowProps = {
  label: string;
  cr: AttributeChangeRequest<string | number | undefined>;
  version: "oldValue" | "newValue";
  readOnly?: boolean;
  type?: "text" | "number";
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onApprove?: (e: ChangeEvent<HTMLInputElement>) => void;
};

function ReleaseRow({
  cr,
  label,
  version,
  readOnly,
  type = "text",
  onChange,
  onApprove,
}: ReleaseRowProps) {
  return (
    <tr>
      <th scope="row" className="sr-only">
        {label}
      </th>
      <td className={changeClassName(cr, readOnly)}>
        <input
          type={type}
          name={cr.key}
          autoComplete="off"
          autoCorrect="off"
          placeholder={label}
          readOnly={readOnly}
          value={cr[version] ?? ""}
          data-key={cr.key}
          onInput={onChange}
        />
      </td>
      <td>
        {readOnly ? null : (
          <ApproveChangeTool
            cr={cr}
            id={`approve[${cr.key}]`}
            dataKey={cr.key}
            onChange={onApprove}
          />
        )}
      </td>
    </tr>
  );
}

export default function ReleaseTable({
  proposal,
  version,
  readOnly,
  onChange,
  onApprove,
}: ReleaseTableProps) {
  return (
    <table className="release metadata-table">
      <caption>Release</caption>

      <thead>
        <tr className="sr-only">
          <td></td>
          <th scope="col">Value</th>
          <th scope="col">Tools</th>
        </tr>
      </thead>

      <tbody>
        <ReleaseRow
          label="Release name"
          cr={proposal.name}
          version={version}
          readOnly={readOnly}
          onChange={onChange}
          onApprove={onApprove}
        />
        <ReleaseRow
          label="Release artist"
          cr={proposal.artistName}
          version={version}
          readOnly={readOnly}
          onChange={onChange}
          onApprove={onApprove}
        />
        <ReleaseRow
          type="number"
          label="Release year"
          cr={proposal.year}
          version={version}
          readOnly={readOnly}
          onChange={onChange}
          onApprove={onApprove}
        />
        <ReleaseRow
          label="Record label"
          cr={proposal.recordLabel}
          version={version}
          readOnly={readOnly}
          onChange={onChange}
          onApprove={onApprove}
        />
        <ReleaseRow
          label="Country"
          cr={proposal.country}
          version={version}
          readOnly={readOnly}
          onChange={onChange}
          onApprove={onApprove}
        />
        <ReleaseRow
          label="Release type"
          cr={proposal.type}
          version={version}
          readOnly={readOnly}
          onChange={onChange}
          onApprove={onApprove}
        />
      </tbody>
    </table>
  );
}
