import { update } from "../reducer";
import { AlbumChangeableFields, EditorContextState } from "./types";

type Change = { value?: string | number; approved?: boolean };

export const updateProposal = (
  key: keyof AlbumChangeableFields,
  change: Change,
) => {
  return update((state: EditorContextState) => {
    if (!state.proposal) {
      return state;
    }

    const proposal = { ...state.proposal };
    const field = proposal[key];
    const newValue = change.value ?? field.value;

    proposal[key].approved = change.approved ?? field.approved;
    proposal[key].active = !!newValue || newValue !== field.value;
    proposal[key].value = newValue;

    return {
      ...state,
      proposal: {
        ...proposal,
      },
    };
  });
};
