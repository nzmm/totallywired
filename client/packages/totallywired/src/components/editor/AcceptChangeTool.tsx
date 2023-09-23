import { useId } from "react";

type AcceptToggleToolProps = {
  oldValue: string | number;
  newValue?: string | number;
  readOnly?: boolean;
};

export default function AcceptChangeTool({
  oldValue,
  newValue,
  readOnly,
}: AcceptToggleToolProps) {
  const id = useId();

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
        checked={true}
        disabled={!newValue || newValue === oldValue}
      />
    </>
  );
}
