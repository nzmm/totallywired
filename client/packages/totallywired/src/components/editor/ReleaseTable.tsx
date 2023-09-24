import { ChangeEvent } from "react";
import {
  AlbumChangeProposal,
  AlbumChangeableFields,
  MetadataChangeRequest,
} from "../../lib/editor/types";
import { editorDisptach } from "../../providers/EditorProvider";
import { updateProposal } from "../../lib/editor/actions";
import { AlbumDetail } from "../../lib/types";
import ApproveChangeTool from "./ApproveChangeTool";
import "./MetadataTable.css";

type ReleaseTableProps = {
  current: AlbumDetail;
  proposal?: AlbumChangeProposal;
  readOnly?: boolean;
};

type ReleaseRowProps = {
  oldValue: string | number;
  newValue?: MetadataChangeRequest<any>;
  label: string;
  name: string;
  readOnly?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function ReleaseRow({
  oldValue,
  newValue,
  name,
  label,
  readOnly,
  onChange,
}: ReleaseRowProps) {
  const isReadOnly = readOnly || !newValue?.approved || !newValue.active;
  return (
    <tr>
      <th scope="row" className="sr-only">
        {label}
      </th>
      <td>
        <input
          type="text"
          name={name}
          autoComplete="off"
          autoCorrect="off"
          placeholder={label}
          readOnly={isReadOnly}
          value={newValue?.value ?? oldValue}
          onInput={onChange}
        />
      </td>
      <td>
        {readOnly ? null : (
          <ApproveChangeTool
            name={name}
            readOnly={readOnly}
            approval={newValue}
            onChange={onChange}
          />
        )}
      </td>
    </tr>
  );
}

export default function ReleaseTable({
  current,
  proposal,
  readOnly,
}: ReleaseTableProps) {
  const dispatch = editorDisptach();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { type } = e.currentTarget;

    switch (type) {
      case "text": {
        const { name, value } = e.currentTarget;
        dispatch(
          updateProposal(name as keyof AlbumChangeableFields, { value }),
        );
        break;
      }
      case "checkbox": {
        const { id, checked: approved } = e.currentTarget;
        dispatch(
          updateProposal(id as keyof AlbumChangeableFields, { approved }),
        );
        break;
      }
      default:
        console.warn(`Unknown action type: ${type}`);
        break;
    }
  };

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
          name="name"
          label="Release name"
          oldValue={current.name}
          newValue={proposal?.name}
          readOnly={readOnly}
          onChange={onChange}
        />
        <ReleaseRow
          name="artistName"
          label="Release artist"
          oldValue={current.artistName}
          newValue={proposal?.artistName}
          readOnly={readOnly}
          onChange={onChange}
        />
        <ReleaseRow
          name="year"
          label="Release year"
          oldValue={current.year}
          newValue={proposal?.year}
          readOnly={readOnly}
          onChange={onChange}
        />
        <ReleaseRow
          name="recordLabel"
          label="Record label"
          oldValue={current.recordLabel}
          newValue={proposal?.recordLabel}
          readOnly={readOnly}
          onChange={onChange}
        />
        <ReleaseRow
          name="country"
          label="Country"
          oldValue={current.country}
          newValue={proposal?.country}
          readOnly={readOnly}
          onChange={onChange}
        />
      </tbody>
    </table>
  );
}
