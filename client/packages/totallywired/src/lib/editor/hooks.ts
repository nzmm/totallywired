import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { MBReleaseSearchResult } from "../musicbrainz/types";
import { getCAFrontArtUrl, searchReleases } from "../musicbrainz/api";
import { EditorContext, EditorDispatchContext } from "./context";
import { updateArtCollection } from "./actions";

export type SearchResult = MBReleaseSearchResult;

export const useEditor = () => {
  return useContext(EditorContext);
};

export const useEditorDisptach = () => {
  return useContext(EditorDispatchContext);
};

export const useReleaseSearch = (): [
  boolean,
  SearchResult[],
  (releaseId: string, albumName: string, artistName: string) => Promise<void>,
] => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  return [
    loading,
    results,
    useCallback(
      async (releaseId: string, albumName: string, artistName: string) => {
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
      [setLoading, setResults],
    ),
  ];
};

export const useArtCollection = (releases: MBReleaseSearchResult[]) => {
  const [art, setArt] = useState<Record<string, string>>({});
  const curatedArt = useRef<Record<string, string>>({});
  const dispatch = useEditorDisptach();

  useEffect(() => {
    Promise.all(
      releases.map(async (r) => {
        const { exists, url } = await getCAFrontArtUrl(r.id);
        setArt((a) => ({
          ...a,
          [r.id]: url,
        }));

        if (exists) {
          curatedArt.current[r.id] = url;
        }
      }),
    ).finally(() => {
      dispatch(updateArtCollection(curatedArt.current));
    });
  }, [releases, setArt, dispatch]);

  return art;
};
