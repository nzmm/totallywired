export type User = {
  userId: string;
  username: string;
  name: string;
  isAuthenticated: boolean;
};

export type Track = {
  trackId: string;
  name: string;
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
