import { ChangeRequest } from "./types";

export function hasChanged<T extends string | number | undefined>(
  cr: ChangeRequest<T>,
) {
  return (cr.oldValue?.toString() ?? "") !== (cr.newValue?.toString() ?? "");
}

export function changeClassName<T extends string | number | undefined>(
  cr: ChangeRequest<T>,
  readOnly?: boolean,
) {
  return !readOnly && hasChanged(cr) ? "changed" : "";
}
