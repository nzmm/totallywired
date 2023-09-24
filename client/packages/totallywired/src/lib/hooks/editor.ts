import { useState, useCallback } from "react";
import { Album } from "../types";
import { MBReleaseSearchItem } from "../musicbrainz/types";
import { searchReleases } from "../musicbrainz";

export type SearchResult = MBReleaseSearchItem;

export const useReleaseSearch = (
  release: Album | undefined,
): [
  boolean,
  SearchResult[],
  (albumName: string, artistName: string) => Promise<void>,
] => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  return [
    loading,
    results,
    useCallback(
      async (albumName: string, artistName: string) => {
        if (!release) {
          setResults([]);
          setLoading(false);
          return;
        }

        setLoading(true);

        const res = await searchReleases(albumName, artistName);
        if (!res.ok) {
          return;
        }

        const releases = res.data?.releases ?? [];
        setResults(releases);
        setLoading(false);
      },
      [release, setLoading, setResults],
    ),
  ];
};
