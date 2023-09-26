import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { MBReleaseSearchItem } from "../musicbrainz/types";
import { getCAFrontArtUrl, searchReleases } from "../musicbrainz/api";
import { EditorContext, EditorDispatchContext } from "./context";
import { update } from "../reducer";
import { setLoading } from "./actions";
import { DEFAULT_COVERART_URL } from "../musicbrainz/consts";

export type SearchResult = MBReleaseSearchItem;

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

export const useArtCollection = (releases: MBReleaseSearchItem[]) => {
  const [art, setArt] = useState<Record<string, string>>({});
  const curatedArt = useRef<Record<string, string>>({});
  const dispatch = useEditorDisptach();

  useEffect(() => {
    dispatch(update((state) => ({ ...state, artCollection: {} })));

    Promise.all(
      releases.map(async (r) => {
        const { exists, url = DEFAULT_COVERART_URL } = await getCAFrontArtUrl(r.id);
        setArt((a) => ({
          ...a,
          [r.id]: url,
        }));

        if (exists) {
          curatedArt.current[r.id] = url;
        }
      }),
    ).finally(() => {
      dispatch(
        update((state) => ({ ...state, artCollection: curatedArt.current })),
      );
    });
  }, [releases, setLoading, setArt]);

  return art;
};
