export type User = {
  userId: string;
  username: string;
  name: string;
  isAuthenticated: boolean;
};

export type Track = {
  id: string;
  name: string;
  number: string;
  releaseName: string;
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
