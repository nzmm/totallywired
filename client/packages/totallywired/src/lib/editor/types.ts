import { MBTrack } from "../musicbrainz/types";
import { AlbumWithTracks } from "../types";

export type HasSimiliarity = { similarity: number };

export type ChangeRequestApproval = {
  active: boolean;
  approved: boolean;
};

export type MetadataChangeRequest<T> = ChangeRequestApproval & {
  value: T;
};

export type TrackChangeRequest = ChangeRequestApproval &
  HasSimiliarity & {
    id: string;
    number: string;
    name: string;
    mbid: string;
  };

export type AlbumChangeableFields = {
  name: MetadataChangeRequest<string>;
  artistName: MetadataChangeRequest<string>;
  year: MetadataChangeRequest<number>;
  recordLabel: MetadataChangeRequest<string>;
  country: MetadataChangeRequest<string>;
  coverArt: MetadataChangeRequest<string>;
};

export type AlbumChangeProposal = AlbumChangeableFields & {
  id: string;
  artistId: string;
  artistMbid: string;
  releaseMbid: string;
  tracks: TrackChangeRequest[];
};

export type EditorContextState = {
  loading: boolean;
  current?: AlbumWithTracks;
  proposal?: AlbumChangeProposal;
  candidateTracks: MBTrack[];
  artCollection: Record<string, string>;
};
