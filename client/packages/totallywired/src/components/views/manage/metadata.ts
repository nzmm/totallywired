import { Provider } from "../../../lib/types";

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

export const getProviderDefaultName = (provider: Provider) => {
  const shortId = provider.id.split("-").slice(-1)[0].slice(-5);
  return `Music collection (${shortId})`;
};
