/**
 * MusicBrainz release
 */
export type MBReleaseSearchItem = {
  id: string;
  score: number;
  status: string;
  title: string;
  ["artist-credit"]: {
    name: string;
    artist: {
      id: string;
      name: string;
      ["sort-name"]: string;
    };
  }[];
  ["release-group"]: {
    ["primary-type"]: string;
  };
  date: string;
  country: string;
  barcode: string;
  asin: string;
  ["label-info"]?: {
    ["catalog-number"]: string;
    label: {
      id: string;
      name: string;
    };
  }[];
  ["track-count"]: number;
  media: {
    format: string;
    ["disc-count"]: number;
    ["track-count"]: number;
  };
};

/**
 * MusicBrainz release query response
 */
export type MBReleaseSearchResponse = {
  created: string;
  count: number;
  offset: number;
  releases: MBReleaseSearchItem[];
};

/**
 * MusicBrainz track
 */
export type MBTrack = {
  id: string;
  position: number;
  length: number;
  title: string;
  number: string;
  ["artist-credit"]: {
    id: string;
    name: string;
  }[];
};

/**
 * MusicBrainz media
 */
export type MBMedia = {
  ["track-count"]: number;
  position: number;
  format: string;
  tracks: MBTrack[];
};

/**
 * MusicBrainz release details
 */
export type MBReleaseResponse = {
  id: string;
  status: string;
  title: string;
  date: string;
  country: string;
  asin: string;
  barcode: string;
  ["artist-credit"]: [
    {
      name: string;
      artist: {
        id: string;
        name: string;
      };
    },
  ];
  media: MBMedia[];
  ["label-info"]: {
    ["catalog-number"]: string;
    label: {
      name: string;
      id: string;
    };
  }[];
  ["cover-art-archive"]: {
    artwork: boolean;
    count: number;
    front: boolean;
    back: boolean;
    darkened: boolean;
  };
};

/**
 * Coverart response
 */
export type CAResponse = {
  url: string;
};

export interface MetadataSearchResult extends MBReleaseSearchItem {
  coverArtUrl?: string;
}
