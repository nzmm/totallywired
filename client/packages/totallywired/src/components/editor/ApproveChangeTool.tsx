import {
  ChangeRequestApproval,
  EditorInputEventHandler,
} from "../../lib/editor/types";

type ApproveChangeToolProps = {
  attrKey: string;
  cr: ChangeRequestApproval;
  readOnly?: boolean;
  onChange?: EditorInputEventHandler;
};

export default function ApproveChangeTool({
  attrKey,
  cr,
  readOnly,
  onChange,
}: ApproveChangeToolProps) {
  if (readOnly) {
    return null;
  }
  const id = `approve[${attrKey}]`;
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
        data-key={attrKey}
        onChange={onChange}
      />
    </>
  );
}
