type ProviderMetadata = {
  name: string;
};

export const METADATA: Record<string, ProviderMetadata> = {
  microsoft: {
    name: "Microsoft OneDrive",
  },
  google: {
    name: "Google Drive",
  },
};
