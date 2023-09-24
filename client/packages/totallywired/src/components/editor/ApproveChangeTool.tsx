import { ChangeEvent } from "react";
import { ChangeRequestApproval } from "../../lib/editor/types";

type ApproveChangeToolProps = {
  name: string;
  readOnly?: boolean;
  approval?: ChangeRequestApproval;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ApproveChangeTool({
  name,
  readOnly,
  approval,
  onChange,
}: ApproveChangeToolProps) {
  if (readOnly || !approval) {
    return null;
  }

  return (
    <>
      <label className="sr-only" htmlFor={name}>
        Accept change
      </label>
      <input
        id={name}
        type="checkbox"
        autoComplete="off"
        defaultChecked={approval.approved}
        disabled={!approval.active}
        onChange={onChange}
      />
    </>
  );
}
