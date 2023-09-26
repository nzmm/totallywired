import { FormEvent, useEffect, useRef } from "react";
import { useArtCollection, useReleaseSearch } from "../../lib/editor/hooks";
import { AlbumSearchResult } from "./SearchResult";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { AlbumChangeProposal } from "../../lib/editor/types";
import Loading from "../display/Loading";
import "./AlbumSearch.css";

type AlbumMetadataSearchProps = {
  proposal: AlbumChangeProposal;
  disabled: boolean;
  onSelect: (result: MBReleaseSearchItem) => void;
};

export default function AlbumMetadataSearch({
  proposal,
  disabled,
  onSelect,
}: AlbumMetadataSearchProps) {
  const { id, mbid, name, artistName } = proposal;

  const [searchLoading, searchResults, searchReleases] = useReleaseSearch();
  const art = useArtCollection(searchResults);
  const autoRunFor = useRef("");

  const onSearch = async (
    e: FormEvent<HTMLFormElementWithInputs<"album" | "artist">>,
  ) => {
    e.preventDefault();
    const { album, artist } = e.currentTarget;
    await searchReleases(id, album.value, artist.value);
  };

  useEffect(() => {
    if (autoRunFor.current === id) {
      return;
    }
    autoRunFor.current = id;
    searchReleases(id, name.oldValue, artistName.oldValue);
  }, [id, name, artistName, autoRunFor, searchReleases]);

  return (
    <section className="album-search">
      <form onSubmit={onSearch} autoComplete="off">
        <fieldset disabled={disabled || searchLoading}>
          <input
            type="text"
            name="album"
            placeholder="Album"
            defaultValue={name.oldValue}
          />
          <input
            type="text"
            name="artist"
            placeholder="Artist"
            defaultValue={artistName.oldValue}
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
              coverArt={art[sr.id]}
              active={sr.id === mbid}
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
