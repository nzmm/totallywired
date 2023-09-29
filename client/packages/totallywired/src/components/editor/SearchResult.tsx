import { ChevronRightIcon } from "@radix-ui/react-icons";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { SearchResult } from "../../lib/editor/hooks";
import { getYear } from "../../lib/utils";
import { Thumbnail } from "../common/Thumbnail";
import "./SearchResult.css";

export type AlbumSearchResultProps = SearchResult & {
  coverArt?: string;
  active?: boolean;
  onSelect: (result: MBReleaseSearchItem) => void;
};

function AdditionalDetails(result: MBReleaseSearchItem) {
  return [
    result.country,
    result.media[0]?.format,
    `${result["track-count"]} tracks`,
    getYear(result.date) ?? 0,
  ]
    .filter((s) => !!s)
    .join(" · ");
}

export function AlbumSearchResult({
  coverArt,
  active,
  onSelect,
  ...result
}: AlbumSearchResultProps) {
  return (
    <button
      className={`search-result${active ? " active" : ""}`}
      onClick={() => onSelect(result)}
    >
      <div>
        <Thumbnail
          className="search-release-art"
          src={coverArt}
          alt="The release art for the album search result"
        />
      </div>

      <div className="search-release-details">
        <div className="detail">
          <strong title={result.title}>{result.title}</strong>
        </div>
        <div className="detail">
          {result["artist-credit"].map((a) => a.name).join(", ")}
        </div>
        <div className="additional-details">
          <small>
            <AdditionalDetails {...result} />
          </small>
        </div>
      </div>
      <div className="chevron">
        <ChevronRightIcon />
      </div>
    </button>
  );
}
