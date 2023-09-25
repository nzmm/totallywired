import { ChevronRightIcon } from "@radix-ui/react-icons";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { SearchResult } from "../../lib/editor/hooks";
import { Thumbnail } from "../display/Thumbnail";
import "./SearchResult.css";

export type AlbumSearchResultProps = SearchResult & {
  active?: boolean;
  onSelect: (result: MBReleaseSearchItem) => void;
};

const dateCountryStr = (date?: string, country?: string) => {
  return [date, country].filter((v) => !!v).join(", ");
};

export function AlbumSearchResult({
  active,
  onSelect,
  ...result
}: AlbumSearchResultProps) {
  const whenWhere = dateCountryStr(result.date, result.country);
  return (
    <button
      className={`search-result${active ? " active" : ""}`}
      onClick={() => onSelect(result)}
    >
      <div>
        <Thumbnail
          className="search-release-art"
          src=""
          alt="The release art for the album search result"
        />
      </div>

      <div className="search-release-details">
        <div>
          <strong>{result.title}</strong>
        </div>
        <div>{result["artist-credit"].map((a) => a.name).join(", ")}</div>
        <div>
          {result["track-count"]} tracks {whenWhere ? ` · ${whenWhere}` : null}
        </div>
      </div>
      <div className="chevron">
        <ChevronRightIcon />
      </div>
    </button>
  );
}
