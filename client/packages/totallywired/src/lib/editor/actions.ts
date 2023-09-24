import { update } from "../reducer";
import { AlbumWithTracks } from "../types";
import {
  AlbumChangeableFields,
  EditorContextState,
  TrackChangeRequest,
} from "./types";

export const setLoading = (loading: boolean) => {
  return update((state: EditorContextState) => ({ ...state, loading }));
};

export const setCurrentRelease = (release: AlbumWithTracks) => {
  return update((state: EditorContextState) => ({
    ...state,
    current: release,
  }));
};

type Change = { value?: string | number; approved?: boolean };

export const updateReleaseProposal = (
  key: keyof AlbumChangeableFields,
  change: Change,
) => {
  return update((state: EditorContextState) => {
    if (!state.proposal) {
      return state;
    }

    const proposal = { ...state.proposal };
    const field = proposal[key];

    if (!field) {
      return state;
    }

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

export const updateTrackProposal = (
  trackId: string,
  key: keyof TrackChangeRequest,
  value: string | number | boolean,
) => {
  return update((state: EditorContextState) => {
    if (!state.proposal) {
      return state;
    }

    const tracks = [...state.proposal.tracks];
    const i = tracks.findIndex((x) => x.id === trackId);

    if (i === -1) {
      return state;
    }

    const track = { ...tracks[i], [key]: value };
    tracks.splice(i, 1, track);

    return {
      ...state,
      proposal: {
        ...state.proposal,
        tracks,
      },
    };
  });
};
