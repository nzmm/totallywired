export type User = {
  userId: string;
  username: string;
  name: string;
  isAuthenticated: boolean;
};

export type Artist = {
  id: string;
  name: string;
};

export type Album = {
  id: string;
  name: string;
  artistId: string;
  artistName: string;
  year: number;
};

export type AlbumDetails = Album & {};

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
