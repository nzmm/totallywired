import { ChangeRequest } from "./types";

export function changeClassName<T extends string | number>(
  cr: ChangeRequest<T>,
  readOnly?: boolean,
) {
  return !readOnly && cr["oldValue"].toString() !== cr["newValue"].toString()
    ? "changed"
    : "";
}
