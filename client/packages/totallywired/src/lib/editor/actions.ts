import { update } from "../reducer";
import { MBTrack } from "../musicbrainz/types";
import {
  AlbumChangeProposal,
  AttributeChangeRequest,
  ChangeRequest,
  EditorContextState,
  TrackChangeRequest,
} from "./types";

export const setLoading = (loading: boolean) => {
  return update((state: EditorContextState) => ({ ...state, loading }));
};

export const setProposal = (
  proposal: AlbumChangeProposal,
  candidateTracks: MBTrack[] = [],
) => {
  return update((state: EditorContextState) => ({
    ...state,
    proposal,
    candidateTracks,
  }));
};

const getAttrCR = (
  state: EditorContextState,
  k: keyof AlbumChangeProposal,
): AttributeChangeRequest<any> | null => {
  const { proposal } = state;
  if (!proposal) {
    return null;
  }

  const cr = proposal[k] as AttributeChangeRequest<never>;
  if (cr?.key !== k) {
    return null;
  }

  return cr;
};

export const updateAttrApproval = (
  key: string | undefined,
  approved: boolean,
) => {
  return update((state: EditorContextState) => {
    if (!key) {
      return state;
    }

    const k = key as keyof AlbumChangeProposal;
    const cr = getAttrCR(state, k);

    if (!cr) {
      return state;
    }

    return {
      ...state,
      proposal: {
        ...state.proposal!,
        [k]: {
          ...cr,
          approved,
        },
      },
    };
  });
};

export const updateAttrValue = (
  key: string | undefined,
  value: string | number,
) => {
  return update((state: EditorContextState) => {
    if (!key) {
      return state;
    }

    const k = key as keyof AlbumChangeProposal;
    const cr = getAttrCR(state, k);

    if (!cr) {
      return state;
    }

    return {
      ...state,
      proposal: {
        ...state.proposal!,
        [k]: {
          ...cr,
          newValue: value,
          active: !!value && value !== cr.oldValue,
        },
      },
    };
  });
};

const getTrackInfo = (
  state: EditorContextState,
  trackId?: string,
): [TrackChangeRequest[], TrackChangeRequest, number] | null => {
  if (!trackId || !state.proposal) {
    return null;
  }

  const tracks = state.proposal.tracks;
  const i = tracks.findIndex((t) => t.id === trackId);
  return i !== -1 ? [[...tracks], tracks[i], i] : null;
};

const getTrackAttr = (
  cr: TrackChangeRequest,
  key: keyof TrackChangeRequest,
): ChangeRequest<string> | null => {
  const attr = cr[key] as ChangeRequest<string>;
  return attr?.key === key ? attr : null;
};

export const updateTrackApproval = (
  trackId: string | undefined,
  approved: boolean,
) => {
  return update((state: EditorContextState) => {
    if (!trackId || !state.proposal) {
      return state;
    }

    const inf = getTrackInfo(state, trackId);
    if (!inf) {
      return state;
    }

    const [tracks, cr, i] = inf;
    tracks.splice(i, 1, { ...cr, approved });

    return {
      ...state,
      proposal: {
        ...state.proposal,
        tracks,
      },
    };
  });
};

export const updateTrackValue = (
  trackId: string | undefined,
  key: string | undefined,
  value: string,
) => {
  return update((state: EditorContextState) => {
    if (!trackId || !key || !state.proposal) {
      return state;
    }

    const inf = getTrackInfo(state, trackId);
    if (!inf) {
      return state;
    }

    const k = key as keyof TrackChangeRequest;
    const [tracks, cr, i] = inf;
    const attr = getTrackAttr(cr, k);
    if (!attr) {
      return state;
    }

    tracks.splice(i, 1, {
      ...cr,
      [k]: {
        ...attr,
        newValue: value,
        active: !!value && value !== attr.oldValue,
      },
    });

    return {
      ...state,
      proposal: {
        ...state.proposal,
        tracks,
      },
    };
  });
};
