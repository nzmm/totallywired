import { update } from "../reducer";
import { MBMedia } from "../musicbrainz/types";
import { hasChanged } from "./helpers";
import {
  AlbumChangeProposal,
  AttributeChangeRequest,
  ChangeRequest,
  EditorContextState,
  TrackChangeRequest,
} from "./types";

/**
 * Update the loading state
 */
export const setLoading = (loading: boolean) => {
  return update<EditorContextState>((state) => ({
    ...state,
    loading,
  }));
};

/**
 * Update the proposal state
 */
export const setProposal = (
  proposal: AlbumChangeProposal,
  candidateMedia: MBMedia[] = [],
) => {
  return update<EditorContextState>((state) => ({
    ...state,
    proposal,
    candidateMedia,
  }));
};

const getAttrCR = (
  state: EditorContextState,
  k: keyof AlbumChangeProposal,
): AttributeChangeRequest<unknown> | null => {
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

/**
 * Updates the approval state for a single attribute on the release proposal
 */
export const updateAttrApproval = (
  key: string | undefined,
  approved: boolean,
) => {
  return update<EditorContextState>((state) => {
    if (!key || !state.proposal) {
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
        ...state.proposal,
        [k]: {
          ...cr,
          approved,
        },
      },
    };
  });
};

/**
 * Updates a single attribute value on the release proposal
 */
export const updateAttrValue = (
  key: string | undefined,
  value: string | number,
) => {
  return update<EditorContextState>((state) => {
    if (!key || !state.proposal) {
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
        ...state.proposal,
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

/**
 * Updates the approval state for a single track on the release proposal
 */
export const updateTrackApproval = (
  trackId: string | undefined,
  approved: boolean,
) => {
  return update<EditorContextState>((state) => {
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

/**
 * Updates a single track attribute on the release proposal
 */
export const updateTrackValue = (
  trackId: string | undefined,
  key: string | undefined,
  value: string,
) => {
  return update<EditorContextState>((state) => {
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

    const active =
      (hasChanged(cr.disc) || hasChanged(cr.number) || hasChanged(cr.name)) &&
      !!value;

    tracks.splice(i, 1, {
      ...cr,
      [k]: {
        ...attr,
        newValue: value,
      },
      active,
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

/**
 * Updates all editable track attributes on the release proposal
 */
export const updateTrackFull = (
  trackId: string,
  mbid: string,
  record: Record<"disc" | "number" | "name" | "length", string>,
) => {
  return update<EditorContextState>((state) => {
    if (!trackId || !mbid || !state.proposal) {
      return state;
    }

    const inf = getTrackInfo(state, trackId);
    if (!inf) {
      return state;
    }

    const [tracks, cr, i] = inf;

    const { number, name } = record;
    const discInt = parseInt(record.disc);
    const lengthInt = parseInt(record.length);

    const discVariance = discInt !== cr.disc.oldValue;
    const numVariance = record.number !== cr.number.oldValue;
    const nameVariance = record.name !== cr.name.oldValue;

    tracks.splice(i, 1, {
      ...cr,
      disc: {
        ...cr.disc,
        newValue: discInt,
      },
      number: {
        ...cr.number,
        newValue: number,
      },
      name: {
        ...cr.name,
        newValue: name,
      },
      mbid,
      length: lengthInt,
      active: discVariance || numVariance || nameVariance,
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

/**
 * Updates the art collection to be the `curatedCollection`.
 *
 * If the current cover art is equal to the `DEFAULT_COVERART_URL`, and art for the
 * selected MusicBrainz search result exists within the `curatedCollection`, then the
 * proposed `coverArt` `newValue` will be updated to be the art from the `curatedCollection`.
 */
export const updateArtCollection = (
  curatedCollection: Record<string, string>,
) => {
  return update<EditorContextState>((state) => {
    if (!state.proposal) {
      return state;
    }

    const newState = { ...state, artCollection: curatedCollection };
    const { mbid, coverArt } = state.proposal;

    if (!mbid && coverArt.newValue !== coverArt.oldValue) {
      return newState;
    }

    const artSrc = curatedCollection[mbid] ?? coverArt.oldValue;
    return {
      ...state,
      artCollection: curatedCollection,
      proposal: {
        ...state.proposal,
        coverArt: {
          ...coverArt,
          newValue: artSrc,
          active: artSrc !== coverArt.oldValue,
        },
      },
    };
  });
};

/**
 * Updates the proposed `coverArt` `newValue` to be the supplied `artSrc` url.
 */
export const updateCoverArt = (artSrc: string) => {
  return update<EditorContextState>((state) => {
    if (!state.proposal) {
      return state;
    }
    const { coverArt } = state.proposal;
    return {
      ...state,
      proposal: {
        ...state.proposal,
        coverArt: {
          ...coverArt,
          newValue: artSrc,
          active: artSrc !== coverArt.oldValue,
        },
      },
    };
  });
};

const commitChange = <T extends ChangeRequest<unknown>>(cr: T): T => {
  return { ...cr, oldValue: cr.newValue };
};

const commitAttrChange = <T extends string | number | undefined>(
  cr: AttributeChangeRequest<T>,
): AttributeChangeRequest<T> => {
  return cr.active && cr.approved ? { ...commitChange(cr), active: false } : cr;
};

const commitTrackChange = (cr: TrackChangeRequest): TrackChangeRequest => {
  if (cr.active && cr.approved) {
    return {
      ...cr,
      disc: commitChange(cr.disc),
      number: commitChange(cr.number),
      name: commitChange(cr.name),
      active: false,
    };
  }
  return cr;
};

/**
 * Commits (synchronises) all accepted newValues to be oldValues
 */
export const commitAllChanges = () => {
  return update<EditorContextState>((state) => {
    const proposal = state.proposal;

    if (!proposal) {
      return state;
    }

    return {
      ...state,
      proposal: {
        ...proposal,
        name: commitAttrChange(proposal.name),
        artistName: commitAttrChange(proposal.artistName),
        year: commitAttrChange(proposal.year),
        recordLabel: commitAttrChange(proposal.recordLabel),
        country: commitAttrChange(proposal.country),
        type: commitAttrChange(proposal.type),
        coverArt: commitAttrChange(proposal.coverArt),
        tracks: proposal.tracks.map((t) => {
          return t.active && t.approved ? commitTrackChange(t) : t;
        }),
      },
    };
  });
};
