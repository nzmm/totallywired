import { MBTrack } from "../musicbrainz/types";
import { Track } from "../types";

export type HasSimiliarity = { similarity: number };

export type MatchedTrack = HasSimiliarity & {
  track: Track;
  match?: MBTrack;
};

export type ChangeRequest<T> = {
  key: string;
  oldValue: T;
  newValue: T;
};

export type ChangeRequestApproval = {
  active: boolean;
  approved: boolean;
};

export type AttributeChangeRequest<T> = ChangeRequestApproval &
  ChangeRequest<T>;

export type TrackChangeRequest = ChangeRequestApproval &
  HasSimiliarity & {
    id: string;
    mbid: string;
    track: Track;
    length: number;
    number: ChangeRequest<string>;
    name: ChangeRequest<string>;
  };

export type AlbumChangeProposal = {
  id: string;
  mbid: string;
  artistId: string;
  artistMbid: string;
  name: AttributeChangeRequest<string>;
  artistName: AttributeChangeRequest<string>;
  year: AttributeChangeRequest<number>;
  recordLabel: AttributeChangeRequest<string>;
  country: AttributeChangeRequest<string>;
  type: AttributeChangeRequest<string>;
  coverArt: AttributeChangeRequest<string>;
  tracks: TrackChangeRequest[];
};

export type EditorContextState = {
  loading: boolean;
  proposal?: AlbumChangeProposal;
  candidateTracks: MBTrack[];
  artCollection: Record<string, string>;
};

export type EditorInputEventHandler = React.ChangeEventHandler<
  Omit<HTMLInputElement, "dataset"> & {
    dataset: {
      /**
       * Holds the attribute key
       */
      key?: string;

      /**
       * Holds the track id
       */
      tid?: string;
    };
  }
>;
