import { useState, FormEvent } from "react";
import { useReleaseSearch } from "../../lib/hooks/editor";
import { AlbumSearchResult } from "./AlbumSearchResult";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { Album } from "../../lib/types";
import Loading from "../display/Loading";

type AlbumMetadataSearchProps = {
  disabled: boolean;
  release: Album | undefined;
  onSelect: (result: MBReleaseSearchItem) => void;
};

export default function AlbumMetadataSearch({
  release,
  disabled,
  onSelect,
}: AlbumMetadataSearchProps) {
  const [showBest, setShowBest] = useState(true);

  const [searchLoading, searchResults, performSearch] =
    useReleaseSearch(release);

  const onSearch = async (
    e: FormEvent<HTMLFormElementWithInputs<"album" | "artist">>,
  ) => {
    e.preventDefault();
    const { album, artist } = e.currentTarget;
    await performSearch(album.value, artist.value);
  };

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
          <label>
            <input
              type="checkbox"
              name="low-sim"
              checked={showBest}
              onChange={(e) => setShowBest(e.currentTarget.checked)}
            />
            Best matches only
          </label>

          <button type="submit">Search</button>
        </fieldset>
      </form>

      <hr />

      <div className="album-search-results">
        {searchLoading ? (
          <Loading />
        ) : (
          searchResults
            .filter((r) => !showBest || r.similarity <= 10)
            .map((sr) => (
              <AlbumSearchResult key={sr.id} onSelect={onSelect} {...sr} />
            ))
        )}
      </div>
    </section>
  );
}
