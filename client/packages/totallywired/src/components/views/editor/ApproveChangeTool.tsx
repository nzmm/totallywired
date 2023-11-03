import {
  ChangeRequestApproval,
  EditorInputEventHandler,
} from "../../../lib/editor/types";

type ApproveChangeToolProps = {
  id: string;
  dataKey: string;
  cr: ChangeRequestApproval;
  readOnly?: boolean;
  onChange?: EditorInputEventHandler;
};

export default function ApproveChangeTool({
  id,
  dataKey,
  cr,
  readOnly,
  onChange,
}: ApproveChangeToolProps) {
  if (readOnly) {
    return null;
  }
  return (
    <>
      <label className="sr-only" htmlFor={id}>
        Accept change
      </label>
      <input
        id={id}
        type="checkbox"
        autoComplete="off"
        defaultChecked={cr.approved}
        disabled={!cr.active}
        data-key={dataKey}
        onChange={onChange}
      />
    </>
  );
}
