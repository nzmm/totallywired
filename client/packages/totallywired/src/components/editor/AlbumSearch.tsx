import { useState, FormEvent, useEffect } from "react";
import { similar, useReleaseSearch } from "../../lib/hooks/editor";
import { AlbumSearchResult } from "./SearchResult";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { Album } from "../../lib/types";
import Loading from "../display/Loading";
import "./AlbumSearch.css";

type AlbumMetadataSearchProps = {
  release: Album | undefined;
  disabled: boolean;
  selectedId: string;
  onSelect: (result: MBReleaseSearchItem) => void;
};

export default function AlbumMetadataSearch({
  release,
  disabled,
  selectedId,
  onSelect,
}: AlbumMetadataSearchProps) {
  const [autoRunFor, setAutoRunFor] = useState("");
  const [bestOnly, setBestOnly] = useState(true);

  const [searchLoading, searchResults, performSearch] =
    useReleaseSearch(release);

  const onSearch = async (
    e: FormEvent<HTMLFormElementWithInputs<"album" | "artist">>,
  ) => {
    e.preventDefault();
    const { album, artist } = e.currentTarget;
    await performSearch(album.value, artist.value);
  };

  useEffect(() => {
    if (!release || autoRunFor === release.id) {
      return;
    }

    setAutoRunFor(release.id);
    performSearch(release.name, release.artistName);
  }, [release, autoRunFor]);

  const filteredResults = searchResults.filter(
    (r) => !bestOnly || similar(r.similarity),
  );

  return (
    <section className="album-search">
      <form onSubmit={onSearch} autoComplete="off">
        <fieldset disabled={disabled || searchLoading}>
          <input
            type="text"
            name="album"
            placeholder="Album"
            defaultValue={release?.name}
          />
          <input
            type="text"
            name="artist"
            placeholder="Artist"
            defaultValue={release?.artistName}
          />

          <button type="submit">Search</button>

          <label className="checkbox">
            <input
              type="checkbox"
              name="best-only"
              checked={bestOnly}
              onChange={(e) => setBestOnly(e.currentTarget.checked)}
            />
            Show just the best matches
          </label>
        </fieldset>
      </form>

      <div className="album-search-results">
        {searchLoading ? (
          <Loading />
        ) : filteredResults.length ? (
          filteredResults.map((sr) => (
            <AlbumSearchResult
              key={sr.id}
              active={sr.id === selectedId}
              onSelect={onSelect}
              {...sr}
            />
          ))
        ) : searchResults.length ? (
          <button
            className="feedback action"
            onClick={() => setBestOnly(false)}
          >
            Show {searchResults.length - filteredResults.length} omitted
            results?
          </button>
        ) : (
          <div className="feedback message muted">No search results</div>
        )}
      </div>
    </section>
  );
}
