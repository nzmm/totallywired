export enum ReactionType {
  None,
  Liked,
}

export type User = {
  id: string;
  username: string;
  name: string;
  isAuthenticated: boolean;
};

export type Artist = {
  id: string;
  name: string;
};

export type ArtistDetail = Artist & {};

export type Album = {
  id: string;
  name: string;
  artistId: string;
  artistName: string;
  year: number;
};

export type AlbumDetail = Album & {
  recordLabel: string;
  coverArt: string;
  country: string;
};

export type Track = {
  id: string;
  name: string;
  number: string;
  releaseId: string;
  releaseName: string;
  artistId: string;
  artistName: string;
  length: number;
  displayLength: string;
  liked: boolean;
};

export type Provider = {
  sourceId: string;
  sourceType: number;
  trackCount: number;
  createdOn: string;
  modifiedOn: string;
};

export type ProviderCollection = {
  sourceType: number;
  providers: Provider[];
};

export type Playlist = {
  id: string;
  userId: string;
  name: string;
  trackCount: number;
};
