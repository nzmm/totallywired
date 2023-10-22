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

export type Track = {
  id: string;
  name: string;
  disc: number;
  number: string;
  releaseId: string;
  releaseName: string;
  artistId: string;
  artistName: string;
  length: number;
  displayLength: string;
  liked: boolean;
};

export type Album = {
  id: string;
  name: string;
  artistId: string;
  artistName: string;
  year?: number;
};

export type AlbumDetail = Album & {
  recordLabel: string;
  coverArt: string;
  country: string;
  /**
   * Album, Compilation etc...
   */
  type: string;
  mbid: string;
};

export type AlbumCollection = AlbumDetail & {
  trackCount: number;
  tracks?: Track[];
};

export type Artist = {
  id: string;
  name: string;
};

export type ArtistDetail = Artist;

export type Provider = {
  id: string;
  sourceType: number;
  sourceName: string;
  createdOn: string;
  modifiedOn: string;
  trackCount: number;
};

export type ProviderGroup = {
  groupName: string;
  contentProviders: Provider[];
};

export type Playlist = {
  id: string;
  userId: string;
  name: string;
  trackCount: number;
};
