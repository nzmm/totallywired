import { useState, useCallback } from "react";
import { distance } from "../editor/damerau-lvenshtein";
import { searchReleases } from "../musicbrainz";
import { Album } from "../types";
import { MBReleaseSearchItem } from "../musicbrainz/types";

type SearchResult = MBReleaseSearchItem & { similarity: number };

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

        const releases = (res.data?.releases ?? []).map((r) => {
          return {
            ...r,
            similarity: distance(
              `${release?.artistName} ${release?.name}`,
              `${r["artist-credit"][0]?.name} ${r.title}`,
            ),
          };
        });

        setResults(releases);
        setLoading(false);
      },
      [release, setLoading, setResults],
    ),
  ];
};
