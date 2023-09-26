import { useState, useCallback, useContext } from "react";
import { MBReleaseSearchItem } from "../musicbrainz/types";
import { searchReleases } from "../musicbrainz";
import { EditorContext, EditorDispatchContext } from "./context";

export type SearchResult = MBReleaseSearchItem;

export const useEditor = () => {
  return useContext(EditorContext);
};

export const useEditorDisptach = () => {
  return useContext(EditorDispatchContext);
};

export const useReleaseSearch = (
  releaseId: string,
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
        if (!releaseId) {
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
      [releaseId, setLoading, setResults],
    ),
  ];
};
