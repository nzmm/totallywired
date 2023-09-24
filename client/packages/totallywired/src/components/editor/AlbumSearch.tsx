import { useState, FormEvent, useEffect } from "react";
import { useReleaseSearch } from "../../lib/hooks/editor";
import { AlbumSearchResult } from "./SearchResult";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { Album } from "../../lib/types";
import Loading from "../display/Loading";
import "./AlbumSearch.css";

type AlbumMetadataSearchProps = {
  release: Album | undefined;
  selectedId: string;
  disabled: boolean;
  onSelect: (result: MBReleaseSearchItem) => void;
};

export default function AlbumMetadataSearch({
  release,
  selectedId,
  disabled,
  onSelect,
}: AlbumMetadataSearchProps) {
  const [autoRunFor, setAutoRunFor] = useState("");
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
        </fieldset>
      </form>

      <div className="album-search-results">
        {searchLoading ? (
          <div className="feedback">
            <Loading />
          </div>
        ) : searchResults.length ? (
          searchResults.map((sr) => (
            <AlbumSearchResult
              key={sr.id}
              active={sr.id === selectedId}
              onSelect={onSelect}
              {...sr}
            />
          ))
        ) : (
          <div className="feedback message muted">No search results</div>
        )}
      </div>
    </section>
  );
}
