/**
 * MusicBrainz
 * @url https://musicbrainz.org/doc/MusicBrainz_API
 */

/**
 * MusicBrainz release search item
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
  }[];
};

/**
 * MusicBrainz release search result collection
 */
export type MBReleaseSearchCollection = {
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
  title: string;
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
 * Cover art archive
 * @url https://musicbrainz.org/doc/Cover_Art_Archive/API
 */

/**
 * The current supported thumbnail sizes are 250px, 500px, and 1200px
 */
export type CAImageSize = 250 | 500 | 1200;
