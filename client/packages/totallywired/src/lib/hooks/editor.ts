import { useState, useCallback } from "react";
import { distance } from "../editor/damerau-lvenshtein";
import { searchReleases } from "../musicbrainz";
import { Album } from "../types";
import { MBReleaseSearchItem } from "../musicbrainz/types";

export type HasSimilarity = { similarity: number };
export type SearchResult = MBReleaseSearchItem & HasSimilarity;

const LOW_SIMILARITY_THRESHOLD = 10;

/**
 * Values less-than-or-equal the threshold are considered highly similar.
 */
export function similar(similarity: number) {
  return similarity <= LOW_SIMILARITY_THRESHOLD;
}

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
              `${artistName} ${albumName}`,
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
